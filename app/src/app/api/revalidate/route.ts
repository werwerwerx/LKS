import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { verifyAdminToken } from "@/lib/auth-middleware"

export async function POST(request: NextRequest) {
  try {
    await verifyAdminToken(request)
    
    const body = await request.json().catch(() => ({}))
    const { path, type = 'page' } = body

    if (path) {
      // Инвалидируем конкретный путь
      revalidatePath(path, type)
      
      return NextResponse.json({ 
        revalidated: true, 
        path,
        now: Date.now() 
      })
    } else {
      // Инвалидируем все основные страницы
      revalidatePath('/', 'layout') // Инвалидирует весь лейаут
      revalidatePath('/')
      revalidatePath('/models')
      
      return NextResponse.json({ 
        revalidated: true, 
        message: "Весь кеш обновлен",
        now: Date.now() 
      })
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    console.error("Revalidation error:", error)
    return NextResponse.json({
      revalidated: false,
      error: "Ошибка обновления кеша",
      now: Date.now(),
    }, { status: 500 })
  }
}

// Публичный эндпоинт для webhook (с секретным ключом)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const secret = searchParams.get('secret')
  const path = searchParams.get('path')
  
  // Проверяем секретный ключ для webhook
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ 
      revalidated: false, 
      message: 'Invalid secret' 
    }, { status: 401 })
  }

  if (path) {
    revalidatePath(path)
    return NextResponse.json({ 
      revalidated: true, 
      path,
      now: Date.now() 
    })
  }

  // Обновляем все основные страницы
  revalidatePath('/', 'layout')
  revalidatePath('/')
  revalidatePath('/models')
  
  return NextResponse.json({ 
    revalidated: true, 
    message: "Весь кеш обновлен",
    now: Date.now() 
  })
} 