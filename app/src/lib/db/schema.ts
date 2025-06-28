import { pgTable, text, serial, timestamp, integer, boolean, decimal } from 'drizzle-orm/pg-core'

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
  company_name: text('company_name').notNull(),
  company_tagline: text('company_tagline').notNull(),
  city_name: text('city_name').notNull(),
  city_locative: text('city_locative').notNull(),
  phone: text('phone').notNull(),
  telegram: text('telegram').notNull(),
  email: text('email'),
  address: text('address').notNull(),
  inn: text('inn').notNull(),
  hero_title: text('hero_title').notNull(),
  hero_subtitle: text('hero_subtitle').notNull(),
  hero_button_text: text('hero_button_text').notNull(),
  hero_description: text('hero_description').notNull(),
  perfect_choice_title: text('perfect_choice_title').notNull(),
  perfect_choice_description: text('perfect_choice_description').notNull(),
  contact_form_title: text('contact_form_title').notNull(),
  contact_form_subtitle: text('contact_form_subtitle').notNull(),
  contact_form_subtitle_highlight: text('contact_form_subtitle_highlight').notNull(),
  form_name_placeholder: text('form_name_placeholder').notNull(),
  form_phone_placeholder: text('form_phone_placeholder').notNull(),
  form_privacy_text: text('form_privacy_text').notNull(),
  form_submit_button: text('form_submit_button').notNull(),
  nav_home: text('nav_home').notNull(),
  nav_catalog: text('nav_catalog').notNull(),
  nav_services: text('nav_services').notNull(),
  nav_contacts: text('nav_contacts').notNull(),
  nav_blog: text('nav_blog').notNull(),
  nav_cooperation: text('nav_cooperation').notNull(),
  footer_privacy_policy: text('footer_privacy_policy').notNull(),
  footer_user_agreement: text('footer_user_agreement').notNull(),
  header_connect_button: text('header_connect_button').notNull(),
  logo_short: text('logo_short').notNull(),
  logo_full_line1: text('logo_full_line1').notNull(),
  logo_full_line2: text('logo_full_line2').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

export type Model = typeof models.$inferSelect
export type NewModel = typeof models.$inferInsert
export type ContactRequest = typeof contact_requests.$inferSelect
export type NewContactRequest = typeof contact_requests.$inferInsert
export type TelegramSettings = typeof telegram_settings.$inferSelect
export type NewTelegramSettings = typeof telegram_settings.$inferInsert 