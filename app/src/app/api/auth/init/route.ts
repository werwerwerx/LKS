import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { admin } from "@/lib/db/schema";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const existingAdmins = await db.select().from(admin).limit(1);
    
    if (existingAdmins.length > 0) {
      return NextResponse.json(
        { error: "Администратор уже существует" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { login, password } = body;

    if (!login || !password) {
      return NextResponse.json(
        { error: "Логин и пароль обязательны" },
        { status: 400 }
      );
    }

    if (login.length < 3) {
      return NextResponse.json(
        { error: "Логин должен содержать минимум 3 символа" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Пароль должен содержать минимум 6 символов" },
        { status: 400 }
      );
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(admin).values({
      login: login.trim(),
      password: hashedPassword
    });

    return NextResponse.json({
      success: true,
      message: "Администратор создан"
    });

  } catch (error) {
    console.error("Admin init error:", error);
    return NextResponse.json(
      { error: "Ошибка создания администратора" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const existingAdmins = await db.select().from(admin).limit(1);
    
    return NextResponse.json({
      hasAdmin: existingAdmins.length > 0
    });

  } catch (error) {
    console.error("Admin check error:", error);
    return NextResponse.json(
      { error: "Ошибка проверки администратора" },
      { status: 500 }
    );
  }
} 