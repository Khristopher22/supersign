import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { put, del } from '@vercel/blob'
import { PDFDocument } from 'pdf-lib'
import fetch from 'node-fetch'

const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? '', 'uploads')

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user?.id) {
            return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 })
        }

        const { documentId, signatureImg, posX, posY } = await req.json()

        if (!documentId || !signatureImg) {
            return NextResponse.json({ success: false, error: 'Dados incompletos' }, { status: 400 })
        }

        const document = await prisma.document.findUnique({
            where: { id: documentId, userId: session.user.id },
        })

        if (!document || !document.url || !document.fileKey) {
            return NextResponse.json({ success: false, error: 'Documento não encontrado' }, { status: 404 })
        }

        // 1. Baixar o PDF original
        const blobRes = await fetch(document.url)
        if (!blobRes.ok) {
            throw new Error('Erro ao baixar o PDF do blob')
        }

        const originalPdfBytes = await blobRes.arrayBuffer()
        const pdfDoc = await PDFDocument.load(originalPdfBytes)

        // 2. Assinar o PDF
        const pngImageBytes = Buffer.from(signatureImg.split(',')[1], 'base64')
        const pngImage = await pdfDoc.embedPng(pngImageBytes)
        const pngDims = pngImage.scale(0.5)

        const pageIndex = pdfDoc.getPageCount() - 1
        const pdfPage = pdfDoc.getPage(pageIndex)

        pdfPage.drawImage(pngImage, {
            x: posX,
            y: posY,
            width: pngDims.width,
            height: pngDims.height,
        })

        const signedPdfBytes = await pdfDoc.save()

        // 3. Upload do PDF assinado com nova chave
        const fileName = path.basename(document.fileKey)
        const filePath = path.join(UPLOAD_DIR, session.user.id)
        const fullPath = path.join(filePath, fileName)

        const blob = await put(fullPath, new Blob([signedPdfBytes], { type: 'application/pdf' }), {
            access: 'public',
        })

        // 4. Deletar blob antigo
        await del(document.fileKey)

        // 5. Atualizar banco de dados
        await prisma.document.update({
            where: { id: documentId },
            data: {
                fileKey: blob.url,
                url: blob.downloadUrl,
                status: 'SIGNED',
                updatedAt: new Date(),
            },
        })

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('Erro ao assinar documento:', err)
        return NextResponse.json({ success: false, error: 'Erro ao assinar o documento' }, { status: 500 })
    }
}
