import { createAdminSupabaseClient } from '@/lib/supabase/server'

export default async function AdminAuditLogsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isFr = locale === 'fr'

  const adminClient = await createAdminSupabaseClient()
  const { data: logs } = await adminClient
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  const actionColors: Record<string, string> = {
    CREATE: 'bg-green-100 text-green-700',
    UPDATE: 'bg-blue-100 text-blue-700',
    DELETE: 'bg-red-100 text-red-700',
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-serif text-forest mb-6">
        {isFr ? 'Journaux d\'audit' : 'Audit logs'}
      </h1>

      {!logs || logs.length === 0 ? (
        <div className="card p-8 text-center text-brown/60">
          {isFr ? 'Aucune entrée dans les journaux.' : 'No audit log entries yet.'}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream/50 border-b border-sage/20">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-charcoal">{isFr ? 'Date' : 'Date'}</th>
                <th className="text-left px-4 py-3 font-medium text-charcoal">{isFr ? 'Action' : 'Action'}</th>
                <th className="text-left px-4 py-3 font-medium text-charcoal">{isFr ? 'Table' : 'Table'}</th>
                <th className="text-left px-4 py-3 font-medium text-charcoal">{isFr ? 'ID enregistrement' : 'Record ID'}</th>
                <th className="text-left px-4 py-3 font-medium text-charcoal">{isFr ? 'Utilisateur' : 'User'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage/10">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-cream/30 transition-colors">
                  <td className="px-4 py-3 text-brown/70 text-xs whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString(isFr ? 'fr-CA' : 'en-CA')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${actionColors[log.action] || 'bg-gray-100 text-gray-700'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-charcoal font-mono text-xs">{log.table_name ?? '—'}</td>
                  <td className="px-4 py-3 text-brown/60 font-mono text-xs">
                    {log.record_id ? log.record_id.substring(0, 8) + '…' : '—'}
                  </td>
                  <td className="px-4 py-3 text-brown/60 text-xs">
                    {log.user_id ? log.user_id.substring(0, 8) + '…' : 'System'}
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
