export const dynamic = 'force-dynamic'
export const revalidate = 0

import { redirect } from 'next/navigation'
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/database.types'
import Link from 'next/link'

type Profile = Database['public']['Tables']['profiles']['Row']

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect(`/${locale}/admin/login`)
  }

  const adminClient = await createAdminSupabaseClient()
  const { data: profileData } = await adminClient
    .from('profiles')
    .select('role, status, full_name, email')
    .eq('id', session.user.id)
    .single()
  const profile = profileData as Pick<Profile, 'role' | 'status' | 'full_name' | 'email'> | null

  if (!profile || !['owner', 'admin', 'staff', 'content_editor', 'instructor'].includes(profile.role)) {
    redirect(`/${locale}`)
  }

  const isFr = locale === 'fr'

  const navLinks = [
    { href: `/${locale}/admin`, label: isFr ? 'Tableau de bord' : 'Dashboard' },
    { href: `/${locale}/admin/reservations`, label: isFr ? 'Réservations' : 'Reservations' },
    { href: `/${locale}/admin/experiences`, label: isFr ? 'Expériences' : 'Experiences' },
    { href: `/${locale}/admin/menu`, label: 'Menu' },
    { href: `/${locale}/admin/inquiries`, label: isFr ? 'Demandes' : 'Inquiries' },
    { href: `/${locale}/admin/vendor-applications`, label: isFr ? 'Candidatures' : 'Applications' },
    ...((['owner', 'admin'].includes(profile.role)) ? [
      { href: `/${locale}/admin/settings`, label: isFr ? 'Paramètres' : 'Settings' },
      { href: `/${locale}/admin/audit-logs`, label: isFr ? 'Journaux' : 'Audit logs' },
    ] : []),
  ]

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className="w-64 bg-charcoal flex flex-col flex-shrink-0" aria-label="Navigation admin">
        <div className="p-6 border-b border-cream/10">
          <Link href={`/${locale}/admin`} className="font-serif text-xl text-cream hover:text-sage transition-colors">
            Bien Vivre
          </Link>
          <p className="text-xs text-cream/40 mt-0.5">Admin</p>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center px-3 py-2 rounded-lg text-sm text-cream/70 hover:text-cream hover:bg-cream/10 transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-cream/10">
          <p className="text-xs text-cream/50 mb-1">{profile.full_name || profile.email}</p>
          <p className="text-xs text-cream/30">{profile.role}</p>
          <Link
            href={`/${locale}`}
            className="mt-3 text-xs text-cream/40 hover:text-cream/70 transition-colors block"
          >
            ← {isFr ? 'Retour au site' : 'Back to site'}
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}