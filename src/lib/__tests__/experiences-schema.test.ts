import fs from 'fs'
import path from 'path'
import {
  EXPERIENCE_PUBLIC_SELECT,
  EXPERIENCE_BOOKING_SELECT,
  EXPERIENCE_ALL_COLUMNS,
} from '../db/selects'

function parseMigrationColumns(): Set<string> {
  const migrationsDir = path.resolve(__dirname, '../../../../supabase/migrations')
  const cols = new Set<string>()
  const files = fs.readdirSync(migrationsDir).sort()

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
    const createMatch = sql.match(/CREATE TABLE.*?experiences\s*\((.+?)\);/is)
    if (createMatch) {
      for (const line of createMatch[1].split('\n')) {
        const m = line.trim().match(/^(\w+)\s+/)
        if (m && !['CONSTRAINT', 'PRIMARY', 'CHECK'].includes(m[1])) {
          cols.add(m[1].toLowerCase())
        }
      }
    }
    for (const m of sql.matchAll(/ADD\s+COLUMN\s+IF\s+NOT\s+EXISTS\s+(\w+)\s+/gi)) {
      cols.add(m[1].toLowerCase())
    }
  }
  return cols
}

function selectToColumns(select: string): string[] {
  return select.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
}

describe('experiences schema consistency', () => {
  let migrationCols: Set<string>

  beforeAll(() => {
    migrationCols = parseMigrationColumns()
  })

  it('EXPERIENCE_ALL_COLUMNS contains no column absent from migrations', () => {
    const missing = (EXPERIENCE_ALL_COLUMNS as readonly string[]).filter(c => !migrationCols.has(c))
    expect(missing).toEqual([])
  })

  it('EXPERIENCE_PUBLIC_SELECT references only columns that exist in migrations', () => {
    const missing = selectToColumns(EXPERIENCE_PUBLIC_SELECT).filter(c => !migrationCols.has(c))
    expect(missing).toEqual([])
  })

  it('EXPERIENCE_BOOKING_SELECT references only columns that exist in migrations', () => {
    const missing = selectToColumns(EXPERIENCE_BOOKING_SELECT).filter(c => !migrationCols.has(c))
    expect(missing).toEqual([])
  })

  it('EXPERIENCE_PUBLIC_SELECT includes the columns that caused the production error', () => {
    const cols = selectToColumns(EXPERIENCE_PUBLIC_SELECT)
    expect(cols).toContain('what_to_bring_fr')
    expect(cols).toContain('what_to_bring_en')
    expect(cols).toContain('cancellation_policy_fr')
    expect(cols).toContain('cancellation_policy_en')
  })

  it('EXPERIENCE_BOOKING_SELECT has all columns needed for reservation create flow', () => {
    const cols = selectToColumns(EXPERIENCE_BOOKING_SELECT)
    expect(cols).toContain('id')
    expect(cols).toContain('status')
    expect(cols).toContain('capacity')
    expect(cols).toContain('spots_reserved')
    expect(cols).toContain('spots_confirmed')
    expect(cols).toContain('price_cents')
    expect(cols).toContain('currency')
  })
})
