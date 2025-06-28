import { pgTable, text, serial, timestamp, integer, boolean, decimal, varchar } from 'drizzle-orm/pg-core'

export const models = pgTable('models', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

export const model_photos = pgTable('model_photos', {
  id: serial('id').primaryKey(),
  model_id: integer('model_id').references(() => models.id),
  photo_url: text('photo_url'), 
})

export const app_configuration = pgTable('app_configuration', {
  id: serial('id').primaryKey(),
  tg_contact_id: text('tg_contact_id'),
})

export const contact_requests = pgTable('contact_requests', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  message: text('message'),
  status: text('status').default('new'),
  created_at: timestamp('created_at').defaultNow(),
})

export const telegram_settings = pgTable('telegram_settings', {
  id: serial('id').primaryKey(),
  bot_token: text('bot_token'),
  subscriber_chat_id: text('subscriber_chat_id'),
  is_active: boolean('is_active').default(false),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

export const site_settings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  phone: varchar('phone', { length: 20 }).notNull(),
  telegram: varchar('telegram', { length: 50 }).notNull(),
  email: varchar('email', { length: 100 }),
  address: text('address').notNull(),
  inn: text('inn').notNull(),
  hero_description: text('hero_description').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

export type Model = typeof models.$inferSelect
export type NewModel = typeof models.$inferInsert
export type ContactRequest = typeof contact_requests.$inferSelect
export type NewContactRequest = typeof contact_requests.$inferInsert
export type TelegramSettings = typeof telegram_settings.$inferSelect
export type NewTelegramSettings = typeof telegram_settings.$inferInsert 