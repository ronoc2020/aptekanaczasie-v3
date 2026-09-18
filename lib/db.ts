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

export const pharmacyAuditEvents = pgTable('pharmacy_audit_events', {
  id: uuid('id').primaryKey(),
  eventType: text('event_type').notNull(),
  mode: text('mode').notNull(),
  recipeName: text('recipe_name'),
  recipeVersion: integer('recipe_version'),
  batchNumber: text('batch_number'),
  operatorId: text('operator_id'),
  reviewerId: text('reviewer_id'),
  payload: jsonb('payload').$type<Record<string, unknown>>().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
})

export const herbsMedicines = pgTable('herbs_medicines', {
  id: uuid('id').primaryKey(),
  slug: text('slug').notNull(),
  name: text('name').notNull(),
  kind: text('kind').$type<'herb' | 'medicine'>().notNull(),
  latinName: text('latin_name'),
  activeCompounds: text('active_compounds').array().notNull(),
  uses: text('uses').array().notNull(),
  contraindications: text('contraindications').array().notNull(),
  sideEffects: text('side_effects').array().notNull(),
  interactions: text('interactions').array().notNull(),
  dosageNotes: text('dosage_notes'),
  evidenceLevel: text('evidence_level').notNull(),
  sourceUrl: text('source_url'),
  author: text('author').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
})

const globalForDb = globalThis as unknown as { howToPool?: Pool }
const pool = globalForDb.howToPool ?? new Pool({ connectionString: process.env.DATABASE_URL })
if (process.env.NODE_ENV !== 'production') globalForDb.howToPool = pool

export const db = drizzle(pool)
