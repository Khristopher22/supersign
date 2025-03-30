import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import fs from "fs"

export const DELETE = async (req: NextRequest) => {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
        return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const documentId = searchParams.get("id")

    if (!documentId) {
        return NextResponse.json({ success: false, error: "Missing document ID" }, { status: 400 })
    }

    const document = await prisma.document.findUnique({
        where: { id: documentId },
    })

    if (!document || document.userId !== session.user.id) {
        return NextResponse.json({ success: false, error: "Unauthorized or document not found" }, { status: 403 })
    }

    if (!document.fileKey) {
        return NextResponse.json({ success: false, error: "File path not found" }, { status: 500 })
    }

    try {
        if (fs.existsSync(document.fileKey)) {
            fs.unlinkSync(document.fileKey)
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to delete file" }, { status: 500 })
    }

    await prisma.document.delete({
        where: { id: documentId },
    })

    return NextResponse.json({ success: true, message: "Documento excluído com sucesso" })
}
