import { db } from "@/lib/db"
import { models, model_photos } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export interface Model {
  id: number
  name: string
  age: number
  description?: string
  price?: string
  is_active: boolean
  created_at: string
  updated_at: string
  photos: string[]
}

export async function getPublicModels(): Promise<Model[]> {
  try {
    const allModels = await db
      .select({
        id: models.id,
        name: models.name,
        age: models.age,
        description: models.description,
        price: models.price,
        is_active: models.is_active,
        created_at: models.created_at,
        updated_at: models.updated_at,
        photos: model_photos.photo_url
      })
      .from(models)
      .leftJoin(model_photos, eq(models.id, model_photos.model_id))
      .where(eq(models.is_active, true))

    const modelsMap = new Map<number, Model>()
    
    allModels.forEach(model => {
      if (!modelsMap.has(model.id)) {
        modelsMap.set(model.id, {
          id: model.id,
          name: model.name,
          age: model.age,
          description: model.description || undefined,
          price: model.price || undefined,
          is_active: model.is_active || false,
          created_at: model.created_at?.toISOString() || new Date().toISOString(),
          updated_at: model.updated_at?.toISOString() || new Date().toISOString() ,
          photos: []
        })
      }
      
      if (model.photos) {
        modelsMap.get(model.id)!.photos.push(model.photos)
      }
    })

    return Array.from(modelsMap.values())
  } catch (error) {
    console.error("Error fetching public models:", error)
    return []
  }
}

export async function getModelById(id: number): Promise<Model | null> {
  try {
    const modelData = await db
      .select({
        id: models.id,
        name: models.name,
        age: models.age,
        description: models.description,
        price: models.price,
        is_active: models.is_active,
        created_at: models.created_at,
        updated_at: models.updated_at,
        photos: model_photos.photo_url
      })
      .from(models)
      .leftJoin(model_photos, eq(models.id, model_photos.model_id))
      .where(eq(models.id, id))

    if (modelData.length === 0) {
      return null
    }

    const model: Model = {
      id: modelData[0].id,
      name: modelData[0].name,
      age: modelData[0].age,
      description: modelData[0].description || "Описание отсутствует",
      price: modelData[0].price || undefined,
      is_active: modelData[0].is_active || false,
      created_at: modelData[0].created_at?.toISOString() || new Date().toISOString(),
      updated_at: modelData[0].updated_at?.toISOString() || new Date().toISOString(),
      photos: modelData.filter(item => item.photos).map(item => item.photos!)
    }

    return model
  } catch (error) {
    console.error("Error fetching model by ID:", error)
    return null
  }
}

export async function getModelIds(): Promise<number[]> {
  try {
    const modelIds = await db
      .select({ id: models.id })
      .from(models)
      .where(eq(models.is_active, true))

    return modelIds.map(m => m.id)
  } catch (error) {
    console.error("Error fetching model IDs:", error)
    return []
  }
} 