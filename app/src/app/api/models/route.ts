import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { models, model_photos } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export const GET = async () => {
  try {
    const allModels = await db
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
      .where(eq(models.is_active, true))

    const modelsMap = new Map()
    
    allModels.forEach(model => {
      if (!modelsMap.has(model.id)) {
        modelsMap.set(model.id, {
          id: model.id,
          name: model.name,
          age: model.age,
          description: model.description,
          price: model.price,
          created_at: model.created_at,
          updated_at: model.updated_at,
          photos: []
        })
      }
      
      if (model.photos) {
        modelsMap.get(model.id).photos.push(model.photos)
      }
    })

    return NextResponse.json({
      models: Array.from(modelsMap.values())
    })
  } catch (error) {
    console.error("Error fetching models:", error)
    return NextResponse.json(
      { error: "Ошибка получения моделей" },
      { status: 500 }
    )
  }
} 