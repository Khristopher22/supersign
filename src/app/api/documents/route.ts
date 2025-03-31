import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export const GET = async (req: NextRequest) => {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
        return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    const documents = await prisma.document.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    })

    const enrichedDocuments = documents.map(doc => ({
        ...doc,
        fileUrl: doc.fileKey ? doc.fileKey : null
    }))

    return NextResponse.json({ success: true, documents: enrichedDocuments })
}
