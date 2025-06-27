import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { models, model_photos } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const resolvedParams = await params
    const modelId = parseInt(resolvedParams.id)
    
    if (isNaN(modelId)) {
      return NextResponse.json(
        { error: "Неверный ID модели" },
        { status: 400 }
      )
    }

    const modelData = await db
      .select({
        id: models.id,
        name: models.name,
        age: models.age,
        description: models.description,
        price: models.price,
        created_at: models.created_at,
        updated_at: models.updated_at,
        photos: model_photos.photo_url
      })
      .from(models)
      .leftJoin(model_photos, eq(models.id, model_photos.model_id))
      .where(and(eq(models.id, modelId), eq(models.is_active, true)))

    if (modelData.length === 0) {
      return NextResponse.json(
        { error: "Модель не найдена" },
        { status: 404 }
      )
    }

    const model = {
      id: modelData[0].id,
      name: modelData[0].name,
      age: modelData[0].age,
      description: modelData[0].description,
      price: modelData[0].price,
      created_at: modelData[0].created_at,
      updated_at: modelData[0].updated_at,
      photos: modelData.filter(item => item.photos).map(item => item.photos)
    }

    return NextResponse.json({ model })
  } catch (error) {
    console.error("Error fetching model:", error)
    return NextResponse.json(
      { error: "Ошибка получения модели" },
      { status: 500 }
    )
  }
} 