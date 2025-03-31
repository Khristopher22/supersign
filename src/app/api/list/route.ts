// app/api/list/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export const GET = async () => {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.id) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
  }

  try {
    const documents = await prisma.document.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })

    const formatted = documents.map(doc => ({
      id: doc.id,
      pathname: doc.fileKey,
      fileKey: doc.fileKey,
      url: doc.url,
      uploadedAt: doc.createdAt.toISOString(),
      size: 1024 * 5,
      status: doc.status
    }))

    return NextResponse.json({ success: true, blobs: formatted })
  } catch (err) {
    console.error("Erro ao buscar documentos:", err)
    return NextResponse.json({ success: false, error: "Erro interno ao listar documentos" }, { status: 500 })
  }
}
