import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export const GET = async (req: NextRequest) => {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const documentId = searchParams.get("id")

    if (!documentId) {
        return new NextResponse("Missing document ID", { status: 400 })
    }

    const document = await prisma.document.findUnique({
        where: { id: documentId },
    })

    if (!document || document.userId !== session.user.id) {
        return new NextResponse("Not found or unauthorized", { status: 403 })
    }

    if (!document.fileKey || !fs.existsSync(document.fileKey)) {
        return new NextResponse("File not found", { status: 404 })
    }

    const fileBuffer = fs.readFileSync(document.fileKey)

    return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": "inline; filename=" + encodeURIComponent(document.name),
        },
    })
}
