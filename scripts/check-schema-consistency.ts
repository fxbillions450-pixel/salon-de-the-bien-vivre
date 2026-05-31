/**
 * Schema consistency check.
 * Parses migration files to derive the experiences table column list,
 * then verifies that every column referenced in EXPERIENCE_PUBLIC_SELECT
 * actually exists in the migrations. Fails the build if there's a mismatch.
 */

import fs from 'fs'
import path from 'path'
import { EXPERIENCE_PUBLIC_SELECT, EXPERIENCE_BOOKING_SELECT, EXPERIENCE_ALL_COLUMNS } from '../src/lib/db/selects'

const MIGRATIONS_DIR = path.resolve(__dirname, '../supabase/migrations')

function parseMigrationColumns(): Set<string> {
  const cols = new Set<string>()
  const files = fs.readdirSync(MIGRATIONS_DIR).sort()

  for (const file of files) {
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8')

    // Pick up CREATE TABLE experiences columns
    const createMatch = sql.match(/CREATE TABLE.*?experiences\s*\((.+?)\);/is)
    if (createMatch) {
      const block = createMatch[1]
      const lines = block.split('\n')
      for (const line of lines) {
        const m = line.trim().match(/^(\w+)\s+/)
        if (m && m[1] !== 'CONSTRAINT' && m[1] !== 'PRIMARY' && m[1] !== 'CHECK') {
          cols.add(m[1].toLowerCase())
        }
      }
    }

    // Pick up ADD COLUMN IF NOT EXISTS in later migrations
    const addMatches = sql.matchAll(/ADD\s+COLUMN\s+IF\s+NOT\s+EXISTS\s+(\w+)\s+/gi)
    for (const m of addMatches) {
      cols.add(m[1].toLowerCase())
    }
  }
  return cols
}

function extractSelectColumns(selectStr: string): string[] {
  return selectStr
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(s => s.length > 0)
}

function main() {
  console.log('🔍 Checking experiences schema consistency...\n')

  const migrationCols = parseMigrationColumns()
  console.log(`Migration-derived columns (${migrationCols.size}):`)
  console.log([...migrationCols].sort().join(', '))
  console.log()

  let failed = false

  // Check EXPERIENCE_PUBLIC_SELECT
  const publicCols = extractSelectColumns(EXPERIENCE_PUBLIC_SELECT)
  const publicMissing = publicCols.filter(c => !migrationCols.has(c))
  if (publicMissing.length > 0) {
    console.error(`❌ EXPERIENCE_PUBLIC_SELECT references columns not in migrations:\n   ${publicMissing.join(', ')}`)
    failed = true
  } else {
    console.log(`✅ EXPERIENCE_PUBLIC_SELECT — all ${publicCols.length} columns exist in migrations`)
  }

  // Check EXPERIENCE_BOOKING_SELECT
  const bookingCols = extractSelectColumns(EXPERIENCE_BOOKING_SELECT)
  const bookingMissing = bookingCols.filter(c => !migrationCols.has(c))
  if (bookingMissing.length > 0) {
    console.error(`❌ EXPERIENCE_BOOKING_SELECT references columns not in migrations:\n   ${bookingMissing.join(', ')}`)
    failed = true
  } else {
    console.log(`✅ EXPERIENCE_BOOKING_SELECT — all ${bookingCols.length} columns exist in migrations`)
  }

  // Check EXPERIENCE_ALL_COLUMNS canonical list
  const allMissing = (EXPERIENCE_ALL_COLUMNS as readonly string[]).filter(c => !migrationCols.has(c))
  if (allMissing.length > 0) {
    console.error(`❌ EXPERIENCE_ALL_COLUMNS references columns not in migrations:\n   ${allMissing.join(', ')}`)
    failed = true
  } else {
    console.log(`✅ EXPERIENCE_ALL_COLUMNS — all ${EXPERIENCE_ALL_COLUMNS.length} columns exist in migrations`)
  }

  console.log()
  if (failed) {
    console.error('Schema consistency check FAILED. Add a migration or remove the column reference.')
    process.exit(1)
  } else {
    console.log('Schema consistency check PASSED ✅')
  }
}

main()
