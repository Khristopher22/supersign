import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma"; // Certifique-se de que este caminho está correto
import bcrypt from "bcryptjs";
import { toast } from 'react-toastify';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(" Body recebido:", body);

    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Usuário já existe" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return NextResponse.json({ message: "Usuário registrado com sucesso" }, { status: 201 });

  } catch (error) {
    console.error("Erro ao registrar usuário:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
