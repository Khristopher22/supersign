import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import fs from 'fs'
import { PDFDocument } from 'pdf-lib'

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { documentId, signatureImg, posX, posY, page } = await req.json()

    const document = await prisma.document.findUnique({
        where: { id: documentId, userId: session.user.id },
    })

    if (!document) {
        return NextResponse.json({ success: false, error: 'Documento não encontrado' }, { status: 404 })
    }

    const filePath = document.fileKey
    if (!fs.existsSync(filePath)) {
        return NextResponse.json({ success: false, error: 'Arquivo não encontrado no sistema' }, { status: 404 })
    }


    const existingPdfBytes = fs.readFileSync(filePath)
    const pdfDoc = await PDFDocument.load(existingPdfBytes)

    const pngImageBytes = Buffer.from(signatureImg.split(',')[1], 'base64')
    const pngImage = await pdfDoc.embedPng(pngImageBytes)
    const pngDims = pngImage.scale(0.5)

    const pageIndex = page === -1 ? pdfDoc.getPageCount() - 1 : page
    const pdfPage = pdfDoc.getPages()[pageIndex]

    pdfPage.drawImage(pngImage, {
        x: posX,
        y: posY,
        width: pngDims.width,
        height: pngDims.height,
    })

    const modifiedPdfBytes = await pdfDoc.save()
    fs.writeFileSync(filePath, modifiedPdfBytes)

    await prisma.document.update({
        where: { id: documentId },
        data: { status: 'SIGNED', updatedAt: new Date() },
    })

    return NextResponse.json({ success: true })
}
