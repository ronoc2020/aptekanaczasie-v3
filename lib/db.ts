import { drizzle } from 'drizzle-orm/node-postgres'
import { pgTable, text, uuid, integer, jsonb, boolean, timestamp } from 'drizzle-orm/pg-core'
import { Pool } from 'pg'

export const howToArticles = pgTable('how_to_articles', {
  id: uuid('id').primaryKey(),
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  category: text('category').notNull(),
  difficulty: text('difficulty').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  materials: jsonb('materials').$type<string[]>().notNull(),
  steps: jsonb('steps').$type<string[]>().notNull(),
  safetyNotes: jsonb('safety_notes').$type<string[]>().notNull(),
  sourceUrl: text('source_url'),
  published: boolean('published').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
})

const globalForDb = globalThis as unknown as { howToPool?: Pool }
const pool = globalForDb.howToPool ?? new Pool({ connectionString: process.env.DATABASE_URL })
if (process.env.NODE_ENV !== 'production') globalForDb.howToPool = pool

export const db = drizzle(pool)
