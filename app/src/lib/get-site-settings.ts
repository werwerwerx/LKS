import { db } from "@/lib/db"
import { site_settings } from "@/lib/db/schema"
import { cache } from "react"

export type SiteSettings = {
  id: number
  phone: string
  telegram: string
  email: string | null
  address: string
  inn: string
  hero_description: string
  created_at: Date | null
  updated_at: Date | null
}

const DEFAULT_SETTINGS = {
  id: 1,
  phone: "+7 996 679 44 78",
  telegram: "@lks_models",
  email: "",
  address: "Офис в Москве: Пресненская наб., 8 стр 1, Москва, Россия",
  inn: "ООО Л.К.С. ИНН 205414867О КПП 658202759 ОГРН 725666120З132",
  hero_description: "Наше эскорт агентство предлагает премиальные услуги в Москве. С нами заказать профессиональную модель стало гораздо проще. Мы гарантируем полную конфиденциальность каждому клиенту, обеспечивая индивидуальный подбор модели под ваши требования. Наши девушки умеют создавать идеальную атмосферу для любого мероприятия: от деловых встреч до романтических встреч.",
  created_at: new Date(),
  updated_at: new Date()
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const settings = await db.select().from(site_settings).limit(1)
    
    if (settings.length === 0) {
      return DEFAULT_SETTINGS
    }
    
    return settings[0]
  } catch (error) {
    console.error("Error fetching site settings:", error)
    return DEFAULT_SETTINGS
  }
}) 