import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { model_photos } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { unlink } from 'fs/promises'
import path from 'path'

interface RouteParams {
  params: {
    id: string
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const modelId = parseInt(params.id)
    if (isNaN(modelId)) {
      return NextResponse.json(
        { error: "Неверный ID модели" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { photoUrls } = body

    if (!Array.isArray(photoUrls) || photoUrls.length === 0) {
      return NextResponse.json(
        { error: "Необходимо указать URL фотографий" },
        { status: 400 }
      )
    }

    const photoValues = photoUrls.map((url: string) => ({
      model_id: modelId,
      photo_url: url
    }))

    await db.insert(model_photos).values(photoValues)

    return NextResponse.json({
      message: "Фотографии успешно добавлены"
    })
  } catch (error) {
    console.error("Error adding photos:", error)
    return NextResponse.json(
      { error: "Ошибка добавления фотографий" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const modelId = parseInt(params.id)
    if (isNaN(modelId)) {
      return NextResponse.json(
        { error: "Неверный ID модели" },
        { status: 400 }
      )
    }

    const { searchParams } = new URL(request.url)
    const photoUrl = searchParams.get('url')

    if (!photoUrl) {
      return NextResponse.json(
        { error: "Необходимо указать URL фотографии" },
        { status: 400 }
      )
    }

    const [deletedPhoto] = await db
      .delete(model_photos)
      .where(and(
        eq(model_photos.model_id, modelId),
        eq(model_photos.photo_url, photoUrl)
      ))
      .returning()

    if (deletedPhoto && photoUrl.startsWith('/uploads/')) {
      try {
        const filePath = path.join(process.cwd(), 'public', photoUrl)
        await unlink(filePath)
      } catch (fileError) {
        console.warn('Could not delete file:', photoUrl, fileError)
      }
    }

    return NextResponse.json({
      message: "Фотография успешно удалена"
    })
  } catch (error) {
    console.error("Error deleting photo:", error)
    return NextResponse.json(
      { error: "Ошибка удаления фотографии" },
      { status: 500 }
    )
  }
} 