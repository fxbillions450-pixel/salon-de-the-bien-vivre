import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Database } from '@/lib/supabase/database.types'

type Reservation = Database['public']['Tables']['reservations']['Row'] & {
  experiences: { title_fr: string; title_en: string; start_time: string } | null
}

export default async function AdminReservationsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isFr = locale === 'fr'

  const adminClient = await createAdminSupabaseClient()
  const { data } = await adminClient
    .from('reservations')
    .select('*, experiences(title_fr, title_en, start_time)')
    .order('created_at', { ascending: false })
    .limit(50)
  const reservations = (data ?? []) as Reservation[]

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    refunded: 'bg-blue-100 text-blue-700',
    no_show: 'bg-gray-100 text-gray-700',
  }

  const statusLabels: Record<string, string> = isFr
    ? { pending: 'En attente', confirmed: 'Confirmée', cancelled: 'Annulée', refunded: 'Remboursée', no_show: 'Absent' }
    : { pending: 'Pending', confirmed: 'Confirmed', cancelled: 'Cancelled', refunded: 'Refunded', no_show: 'No show' }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-serif text-forest mb-6">
        {isFr ? 'Réservations' : 'Reservations'}
      </h1>

      {reservations.length === 0 ? (
        <div className="card p-8 text-center text-brown/60">
          {isFr ? 'Aucune réservation pour le moment.' : 'No reservations yet.'}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream/50 border-b border-sage/20">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-charcoal">{isFr ? 'Client' : 'Customer'}</th>
                <th className="text-left px-4 py-3 font-medium text-charcoal">{isFr ? 'Expérience' : 'Experience'}</th>
                <th className="text-left px-4 py-3 font-medium text-charcoal">{isFr ? 'Date' : 'Date'}</th>
                <th className="text-left px-4 py-3 font-medium text-charcoal">{isFr ? 'Places' : 'Spots'}</th>
                <th className="text-left px-4 py-3 font-medium text-charcoal">{isFr ? 'Total' : 'Total'}</th>
                <th className="text-left px-4 py-3 font-medium text-charcoal">{isFr ? 'Statut' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage/10">
              {reservations.map((r) => (
                <tr key={r.id} className="hover:bg-cream/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-charcoal">{r.customer_first_name} {r.customer_last_name}</p>
                    <p className="text-brown/60 text-xs">{r.customer_email}</p>
                  </td>
                  <td className="px-4 py-3 text-charcoal">
                    {r.experiences ? (isFr ? r.experiences.title_fr : r.experiences.title_en) : '—'}
                  </td>
                  <td className="px-4 py-3 text-brown/70">
                    {r.experiences ? formatDate(r.experiences.start_time, isFr ? 'fr-CA' : 'en-CA') : '—'}
                  </td>
                  <td className="px-4 py-3 text-charcoal text-center">{r.quantity}</td>
                  <td className="px-4 py-3 text-charcoal">{formatCurrency(r.amount_cents, isFr ? 'fr-CA' : 'en-CA')}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[r.status] ?? 'bg-gray-100 text-gray-700'}`}>
                      {statusLabels[r.status] ?? r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
