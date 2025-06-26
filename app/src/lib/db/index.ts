import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { config } from '../../../config'

const client = postgres(config.postgresUrl)
export const db = drizzle(client, { schema })

export * from './schema' 