export const dynamic = 'force-dynamic'
export const revalidate = 0

import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Database } from '@/lib/supabase/database.types'

type Experience = Database['public']['Tables']['experiences']['Row']

export default async function AdminExperiencesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isFr = locale === 'fr'

  const adminClient = await createAdminSupabaseClient()
  const { data } = await adminClient
    .from('experiences')
    .select('*')
    .order('start_time', { ascending: true })
    .limit(50)
  const experiences = (data ?? []) as Experience[]

  const statusColors: Record<string, string> = {
    draft: 'bg-yellow-100 text-yellow-700',
    published: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-gray-100 text-gray-700',
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-serif text-forest">
          {isFr ? 'Expériences' : 'Experiences'}
        </h1>
        <button className="btn-primary text-sm py-2 px-4">
          {isFr ? '+ Ajouter une expérience' : '+ Add experience'}
        </button>
      </div>

      {experiences.length === 0 ? (
        <div className="card p-8 text-center text-brown/60">
          {isFr ? 'Aucune expérience créée.' : 'No experiences created yet.'}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream/50 border-b border-sage/20">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-charcoal">{isFr ? 'Titre' : 'Title'}</th>
                <th className="text-left px-4 py-3 font-medium text-charcoal">{isFr ? 'Date' : 'Date'}</th>
                <th className="text-left px-4 py-3 font-medium text-charcoal">{isFr ? 'Capacité' : 'Capacity'}</th>
                <th className="text-left px-4 py-3 font-medium text-charcoal">{isFr ? 'Prix' : 'Price'}</th>
                <th className="text-left px-4 py-3 font-medium text-charcoal">{isFr ? 'Statut' : 'Status'}</th>
                <th className="text-left px-4 py-3 font-medium text-charcoal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage/10">
              {experiences.map((exp) => (
                <tr key={exp.id} className="hover:bg-cream/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-charcoal">{isFr ? exp.title_fr : exp.title_en}</p>
                    <p className="text-xs text-brown/60">{exp.category}</p>
                  </td>
                  <td className="px-4 py-3 text-brown/70">
                    {formatDate(exp.start_time, isFr ? 'fr-CA' : 'en-CA')}
                  </td>
                  <td className="px-4 py-3 text-charcoal">
                    {exp.spots_confirmed + exp.spots_reserved}/{exp.capacity}
                  </td>
                  <td className="px-4 py-3 text-charcoal">
                    {formatCurrency(exp.price_cents, isFr ? 'fr-CA' : 'en-CA')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[exp.status] ?? 'bg-gray-100 text-gray-700'}`}>
                      {exp.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-forest hover:text-terracotta transition-colors">
                      {isFr ? 'Modifier' : 'Edit'}
                    </button>
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