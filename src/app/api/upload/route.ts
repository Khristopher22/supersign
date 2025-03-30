import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "uploads");

export const POST = async (req: NextRequest) => {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user?.id) {
            return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ success: false, error: "No file received" }, { status: 400 });
        }

        const filePath = path.join(UPLOAD_DIR, session.user.id);
        const fullPath = path.join(filePath, file.name);

        const buffer = Buffer.from(await file.arrayBuffer());

        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true });
        }

        fs.writeFileSync(fullPath, buffer);

        await prisma.document.create({
            data: {
                name: file.name,
                fileKey: fullPath,
                userId: session.user.id,
                status: "PENDING",
                url: null,
            },
        });

        return NextResponse.json({
            success: true,
            name: file.name,
        });

    } catch (error) {
        console.error("Erro ao fazer upload:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
};