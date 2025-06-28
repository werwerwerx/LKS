import { z } from "zod"

export const ContactFormSchema = z.object({
  name: z
    .string()
    .min(1, "Имя обязательно")
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(50, "Имя не должно превышать 50 символов")
    .regex(/^[a-zA-Zа-яА-ЯёЁ\s]+$/, "Имя должно содержать только буквы"),
  phone: z
    .string()
    .min(1, "Номер телефона обязателен")
    .transform((phone) => phone.replace(/[\s\-\(\)]/g, ''))
    .refine((phone) => /^[\+]?[1-9][\d]{9,14}$/.test(phone), {
      message: "Введите корректный номер телефона",
    }),
  privacy: z.boolean().default(true).optional(),
})

export const TelegramBotTokenSchema = z.object({
  bot_token: z
    .string()
    .min(1, "Токен не может быть пустым")
    .regex(/^\d{8,10}:[a-zA-Z0-9_-]{35}$/, "Неверный формат токена Telegram бота")
})

export const ModelSchema = z.object({
  name: z.string().min(1, "Имя модели обязательно").max(100, "Имя слишком длинное"),
  age: z.number().min(16, "Возраст должен быть от 16 лет").max(99, "Возраст должен быть до 99 лет"),
  description: z.string().max(500, "Описание слишком длинное").optional(),
  price: z.number().min(0, "Цена не может быть отрицательной").optional(),
  photos: z.array(z.string().min(1, "URL фото не может быть пустым")).default([]),
  is_active: z.boolean().default(true),
})

export const SiteSettingsSchema = z.object({
  phone: z.string().min(1, "Телефон обязателен"),
  telegram: z.string().min(1, "Telegram обязателен"),
  email: z.string().email("Неверный формат email").optional().or(z.literal("")),
  address: z.string().min(1, "Адрес обязателен"),
  inn: z.string().min(1, "ИНН и реквизиты обязательны"),
  hero_description: z.string().min(1, "Описание на главной обязательно"),
  home_title: z.string().min(1, "Заголовок главной страницы обязателен"),
  models_title: z.string().min(1, "Заголовок каталога моделей обязателен"),
  model_title_template: z.string().min(1, "Шаблон заголовка страницы модели обязателен"),
})

export const AdminAuthSchema = z.object({
  login: z.string().min(3, "Логин должен содержать минимум 3 символа"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
})

export type ContactFormData = z.infer<typeof ContactFormSchema>
export type TelegramBotTokenData = z.infer<typeof TelegramBotTokenSchema>
export type ModelData = z.infer<typeof ModelSchema>
export type SiteSettingsData = z.infer<typeof SiteSettingsSchema>
export type AdminAuthData = z.infer<typeof AdminAuthSchema> 