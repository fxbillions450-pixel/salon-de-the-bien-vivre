import { createAdminSupabaseClient } from '@/lib/supabase/server'

export default async function AdminInquiriesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isFr = locale === 'fr'

  const adminClient = await createAdminSupabaseClient()
  const [
    { data: privateEvents },
    { data: contactMessages },
  ] = await Promise.all([
    adminClient.from('private_event_inquiries').select('*').order('created_at', { ascending: false }).limit(25),
    adminClient.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(25),
  ])

  const statusColors: Record<string, string> = {
    new: 'bg-yellow-100 text-yellow-700',
    contacted: 'bg-blue-100 text-blue-700',
    quoted: 'bg-purple-100 text-purple-700',
    confirmed: 'bg-green-100 text-green-700',
    declined: 'bg-red-100 text-red-700',
    read: 'bg-gray-100 text-gray-700',
    replied: 'bg-green-100 text-green-700',
    archived: 'bg-gray-50 text-gray-500',
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-serif text-forest mb-8">
        {isFr ? 'Demandes & Messages' : 'Inquiries & Messages'}
      </h1>

      {/* Private event inquiries */}
      <section className="mb-10">
        <h2 className="text-xl font-serif text-forest mb-4">
          {isFr ? 'Demandes d\'événements privés' : 'Private event inquiries'}
        </h2>
        {!privateEvents || privateEvents.length === 0 ? (
          <div className="card p-6 text-center text-brown/60">
            {isFr ? 'Aucune demande.' : 'No inquiries yet.'}
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-cream/50 border-b border-sage/20">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-charcoal">{isFr ? 'Nom' : 'Name'}</th>
                  <th className="text-left px-4 py-3 font-medium text-charcoal">{isFr ? 'Événement' : 'Event'}</th>
                  <th className="text-left px-4 py-3 font-medium text-charcoal">{isFr ? 'Date souhaitée' : 'Preferred date'}</th>
                  <th className="text-left px-4 py-3 font-medium text-charcoal">{isFr ? 'Invités' : 'Guests'}</th>
                  <th className="text-left px-4 py-3 font-medium text-charcoal">{isFr ? 'Statut' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage/10">
                {privateEvents.map((pe) => (
                  <tr key={pe.id} className="hover:bg-cream/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-charcoal">{pe.name}</p>
                      <p className="text-xs text-brown/60">{pe.email}</p>
                    </td>
                    <td className="px-4 py-3 text-charcoal">{pe.event_type}</td>
                    <td className="px-4 py-3 text-brown/70">{pe.preferred_date}</td>
                    <td className="px-4 py-3 text-charcoal text-center">{pe.guest_count}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[pe.status] || 'bg-gray-100 text-gray-700'}`}>
                        {pe.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Contact messages */}
      <section>
        <h2 className="text-xl font-serif text-forest mb-4">
          {isFr ? 'Messages de contact' : 'Contact messages'}
        </h2>
        {!contactMessages || contactMessages.length === 0 ? (
          <div className="card p-6 text-center text-brown/60">
            {isFr ? 'Aucun message.' : 'No messages yet.'}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {contactMessages.map((msg) => (
              <div key={msg.id} className="card p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-medium text-charcoal">{msg.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[msg.status] || 'bg-gray-100 text-gray-700'}`}>
                        {msg.status}
                      </span>
                      <span className="text-xs text-brown/50">{msg.category}</span>
                    </div>
                    <p className="text-sm text-brown/70 mb-1">{msg.email}</p>
                    <p className="text-sm text-charcoal/80">{msg.message.substring(0, 200)}{msg.message.length > 200 ? '…' : ''}</p>
                  </div>
                  <p className="text-xs text-brown/40 whitespace-nowrap">
                    {new Date(msg.created_at).toLocaleDateString(isFr ? 'fr-CA' : 'en-CA')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
