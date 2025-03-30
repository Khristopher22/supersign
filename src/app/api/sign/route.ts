import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export const POST = async (req: NextRequest) => {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
        return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    const body = await req.json()
    const { documentId, signatureImg } = body

    if (!documentId || !signatureImg) {
        return NextResponse.json({ success: false, error: "Missing data" }, { status: 400 })
    }

    const signedAt = new Date()

    await prisma.signature.create({
        data: {
            documentId,
            userId: session.user.id,
            signatureImg,
            signedAt,
        },
    })

    await prisma.document.update({
        where: { id: documentId },
        data: { status: "SIGNED" },
    })

    return NextResponse.json({ success: true })
}
