import { db } from "@/lib/db"
import { site_settings } from "@/lib/db/schema"

export type SiteSettings = {
  id: number
  phone: string
  telegram: string
  email: string | null
  address: string
  inn: string
  city: string
  hero_description: string
  home_title: string
  models_title: string
  model_title_template: string
  created_at: Date | null
  updated_at: Date | null
}

const DEFAULT_SETTINGS = {
  id: 1,
  phone: "+7 996 679 44 78",
  telegram: "@lks_models",
  email: "",
  address: "Офис в Москве: Пресненская наб., 8 стр 1, Москва, Россия",
  inn: "ООО К.Л.С. ИНН 205414867О КПП 658202759 ОГРН 725666120З132",
  hero_description: "Модельное агентство К.Л.С. предлагает премиальные услуги профессиональных моделей в Москве. С нами заказать профессиональную модель для мероприятий стало гораздо проще. Мы гарантируем полную конфиденциальность каждому клиенту, обеспечивая индивидуальный подбор модели под ваши требования. Наши модели умеют создавать идеальную атмосферу для любого мероприятия: от деловых встреч до светских событий.",
  home_title: "К.Л.С. - Модельное агентство премиум класса в Москве",
  models_title: "Каталог моделей К.Л.С. - Профессиональные модели Москвы",
  model_title_template: "{name}, {age} лет - Профессиональная модель К.Л.С.",
  city: "Москва",
  created_at: new Date(),
  updated_at: new Date()
}

export const getSiteSettings = async (): Promise<SiteSettings> => {
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
}