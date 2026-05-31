import { createAdminSupabaseClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/database.types'

type VendorApplication = Database['public']['Tables']['vendor_applications']['Row']

export default async function AdminVendorApplicationsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isFr = locale === 'fr'

  const adminClient = await createAdminSupabaseClient()
  const { data } = await adminClient
    .from('vendor_applications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)
  const applications = (data ?? []) as VendorApplication[]

  const statusColors: Record<string, string> = {
    new: 'bg-yellow-100 text-yellow-700',
    reviewing: 'bg-blue-100 text-blue-700',
    approved: 'bg-green-100 text-green-700',
    declined: 'bg-red-100 text-red-700',
    waitlisted: 'bg-purple-100 text-purple-700',
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-serif text-forest mb-6">
        {isFr ? 'Candidatures vendeurs' : 'Vendor applications'}
      </h1>

      {applications.length === 0 ? (
        <div className="card p-8 text-center text-brown/60">
          {isFr ? 'Aucune candidature reçue.' : 'No applications received yet.'}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {applications.map((app) => (
            <div key={app.id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="font-semibold text-forest">{app.business_name}</h2>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[app.status] ?? 'bg-gray-100 text-gray-700'}`}>
                      {app.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-brown/70">
                    <div>
                      <p className="text-xs font-medium text-charcoal/60">{isFr ? 'Contact' : 'Contact'}</p>
                      <p>{app.contact_name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-charcoal/60">Email</p>
                      <p>{app.email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-charcoal/60">{isFr ? 'Produits' : 'Products'}</p>
                      <p>{app.product_type}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-charcoal/60">{isFr ? 'Date souhaitée' : 'Preferred date'}</p>
                      <p>{String(app.preferred_date)}</p>
                    </div>
                  </div>
                  {app.instagram && (
                    <p className="text-xs text-brown/50 mt-1">Instagram: {app.instagram}</p>
                  )}
                  {app.message && (
                    <p className="text-sm text-charcoal/70 mt-2 italic">
                      {app.message.substring(0, 150)}{app.message.length > 150 ? '…' : ''}
                    </p>
                  )}
                </div>
                <p className="text-xs text-brown/40 whitespace-nowrap">
                  {new Date(app.created_at).toLocaleDateString(isFr ? 'fr-CA' : 'en-CA')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
