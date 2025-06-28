import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { admin } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET_KEY must be set in environment variables")
}

export async function POST(request: NextRequest) {
  try {
    const { login, password } = await request.json();

    if (!login || !password) {
      return NextResponse.json(
        { error: "Логин и пароль обязательны" },
        { status: 400 }
      );
    }

    const adminUser = await db.select().from(admin).where(
      eq(admin.login, login)
    ).limit(1);

    if (adminUser.length === 0) {
      return NextResponse.json(
        { error: "Неверный логин или пароль" },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, adminUser[0].password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Неверный логин или пароль" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { 
        id: adminUser[0].id, 
        login: adminUser[0].login 
      },
      JWT_SECRET!,
      { expiresIn: "24h" }
    );

    return NextResponse.json({
      success: true,
      token,
      admin: {
        id: adminUser[0].id,
        login: adminUser[0].login
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get("authorization");
    
    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Токен не предоставлен" },
        { status: 401 }
      );
    }

    const token = authorization.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET!) as { id: number; login: string };

    const adminUser = await db.select().from(admin).where(
      eq(admin.id, decoded.id)
    ).limit(1);

    if (adminUser.length === 0) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: adminUser[0].id,
        login: adminUser[0].login
      }
    });

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: "Недействительный токен" },
        { status: 401 }
      );
    }

    console.error("Auth verify error:", error);
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}