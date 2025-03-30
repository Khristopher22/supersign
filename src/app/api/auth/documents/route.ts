import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      include: { signatures: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(documents);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, fileKey, url, userId } = await request.json();

    const document = await prisma.document.create({
      data: {
        name,
        fileKey,
        url,
        userId,
        status: 'PENDING',
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }
}