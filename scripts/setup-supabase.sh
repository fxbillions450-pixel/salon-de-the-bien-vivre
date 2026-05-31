#!/usr/bin/env bash
# ============================================================
# Salon de Thé Bien Vivre — Supabase Setup Script
# Run this from your LOCAL machine (not a remote server)
# Requires: psql installed locally
# ============================================================

set -euo pipefail

DB_URL="postgresql://postgres.kjqduijwicmmcmndithk:YlbR1qDcfVMvE5SE@aws-0-ca-central-1.pooler.supabase.com:6543/postgres"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MIGRATIONS_DIR="$SCRIPT_DIR/../supabase/migrations"

echo "🍵 Salon de Thé Bien Vivre — Supabase migration runner"
echo ""

echo "📋 Running migration 001: Initial schema..."
psql "$DB_URL" -f "$MIGRATIONS_DIR/001_initial_schema.sql"
echo "✅ Migration 001 complete"

echo "📋 Running migration 002: RLS policies..."
psql "$DB_URL" -f "$MIGRATIONS_DIR/002_rls_policies.sql"
echo "✅ Migration 002 complete"

echo "📋 Running migration 003: Seed data..."
psql "$DB_URL" -f "$MIGRATIONS_DIR/003_seed_data.sql"
echo "✅ Migration 003 complete"

echo ""
echo "✅ All migrations applied successfully!"
echo ""
echo "Next step: Create your admin user."
echo "Run: bash scripts/create-admin-user.sh"
