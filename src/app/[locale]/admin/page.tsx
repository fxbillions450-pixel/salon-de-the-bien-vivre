import { createAdminSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isFr = locale === 'fr'

  const adminClient = await createAdminSupabaseClient()

  const [
    { count: reservationsCount },
    { count: pendingInquiries },
    { count: pendingVendors },
    { count: newMessages },
  ] = await Promise.all([
    adminClient.from('reservations').select('id', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString()),
    adminClient.from('private_event_inquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    adminClient.from('vendor_applications').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    adminClient.from('contact_messages').select('id', { count: 'exact', head: true }).eq('status', 'new'),
  ])

  const stats = [
    {
      label: isFr ? 'Réservations (7j)' : 'Reservations (7d)',
      value: reservationsCount ?? 0,
      href: `/${locale}/admin/reservations`,
      color: 'bg-forest/10 text-forest',
    },
    {
      label: isFr ? 'Demandes événements' : 'Event inquiries',
      value: pendingInquiries ?? 0,
      href: `/${locale}/admin/inquiries`,
      color: 'bg-terracotta/10 text-terracotta',
    },
    {
      label: isFr ? 'Candidatures vendeurs' : 'Vendor applications',
      value: pendingVendors ?? 0,
      href: `/${locale}/admin/vendor-applications`,
      color: 'bg-sage/20 text-forest',
    },
    {
      label: isFr ? 'Nouveaux messages' : 'New messages',
      value: newMessages ?? 0,
      href: `/${locale}/admin/inquiries`,
      color: 'bg-blush text-brown',
    },
  ]

  return (
    <div className="p-8">
      <h1 className="text-3xl font-serif text-forest mb-2">
        {isFr ? 'Tableau de bord' : 'Dashboard'}
      </h1>
      <p className="text-brown/60 mb-8">
        {isFr ? 'Vue d\'ensemble du salon' : 'Salon overview'}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, href, color }) => (
          <Link key={href} href={href}>
            <div className={`card p-6 hover:shadow-md transition-shadow cursor-pointer ${color}`}>
              <p className="text-3xl font-bold mb-1">{value}</p>
              <p className="text-sm font-medium">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <h2 className="text-xl font-serif text-forest mb-4">
        {isFr ? 'Actions rapides' : 'Quick actions'}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { href: `/${locale}/admin/experiences`, label: isFr ? 'Gérer les expériences' : 'Manage experiences', desc: isFr ? 'Ajouter, modifier, publier' : 'Add, edit, publish' },
          { href: `/${locale}/admin/menu`, label: isFr ? 'Gérer le menu' : 'Manage menu', desc: isFr ? 'Plats, boissons, prix' : 'Dishes, drinks, prices' },
          { href: `/${locale}/admin/reservations`, label: isFr ? 'Voir les réservations' : 'View reservations', desc: isFr ? 'Confirmer, annuler' : 'Confirm, cancel' },
          { href: `/${locale}/admin/settings`, label: isFr ? 'Paramètres du site' : 'Site settings', desc: isFr ? 'Horaires, contact, SEO' : 'Hours, contact, SEO' },
          { href: `/${locale}`, label: isFr ? 'Voir le site public' : 'View public site', desc: isFr ? 'Ouvrir dans un nouvel onglet' : 'Open in new tab' },
        ].map(({ href, label, desc }) => (
          <Link key={href} href={href} className="card p-5 hover:shadow-md transition-shadow">
            <p className="font-semibold text-forest mb-1">{label}</p>
            <p className="text-sm text-brown/60">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
