import { pgTable, text, serial, timestamp, integer, boolean } from 'drizzle-orm/pg-core'

export const models = pgTable('models', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  height: integer('height').notNull(),
  experience: text('experience').notNull(),
  specialization: text('specialization').notNull(),
  portfolio_url: text('portfolio_url'),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  city: text('city').notNull(),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  client_name: text('client_name').notNull(),
  client_phone: text('client_phone').notNull(),
  client_email: text('client_email'),
  event_type: text('event_type').notNull(),
  event_date: timestamp('event_date').notNull(),
  duration: integer('duration').notNull(),
  location: text('location').notNull(),
  model_id: integer('model_id').references(() => models.id),
  special_requirements: text('special_requirements'),
  status: text('status').default('pending'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
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

export type Model = typeof models.$inferSelect
export type NewModel = typeof models.$inferInsert
export type Booking = typeof bookings.$inferSelect
export type NewBooking = typeof bookings.$inferInsert
export type ContactRequest = typeof contact_requests.$inferSelect
export type NewContactRequest = typeof contact_requests.$inferInsert 