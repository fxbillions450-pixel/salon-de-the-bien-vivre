import { createAdminSupabaseClient } from '@/lib/supabase/server'

export default async function AdminSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isFr = locale === 'fr'

  const adminClient = await createAdminSupabaseClient()
  const { data: settings } = await adminClient
    .from('settings')
    .select('*')
    .order('key', { ascending: true })

  const defaultSettings = [
    { key: 'site.hours', label: isFr ? 'Heures d\'ouverture' : 'Opening hours', type: 'text' },
    { key: 'site.phone', label: isFr ? 'Téléphone' : 'Phone', type: 'text' },
    { key: 'site.email', label: isFr ? 'Courriel contact' : 'Contact email', type: 'email' },
    { key: 'site.instagram', label: 'Instagram URL', type: 'url' },
    { key: 'site.facebook', label: 'Facebook URL', type: 'url' },
    { key: 'site.address_note_fr', label: isFr ? 'Note adresse (FR)' : 'Address note (FR)', type: 'text' },
    { key: 'site.address_note_en', label: isFr ? 'Note adresse (EN)' : 'Address note (EN)', type: 'text' },
    { key: 'reservation.enabled', label: isFr ? 'Réservations activées' : 'Reservations enabled', type: 'boolean' },
    { key: 'newsletter.enabled', label: isFr ? 'Infolettre activée' : 'Newsletter enabled', type: 'boolean' },
  ]

  const settingsMap = new Map(settings?.map(s => [s.key, s.value]) ?? [])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-serif text-forest mb-2">
        {isFr ? 'Paramètres du site' : 'Site settings'}
      </h1>
      <p className="text-brown/60 mb-8">
        {isFr ? 'Configurez les informations affichées sur le site.' : 'Configure the information displayed on the site.'}
      </p>

      <div className="bg-terracotta/10 border border-terracotta/30 rounded-xl p-4 mb-8">
        <p className="text-sm text-brown">
          {isFr
            ? 'Cette interface de paramètres est fonctionnelle une fois la base de données configurée. Les modifications sont sauvegardées via l\'API /api/admin/settings.'
            : 'This settings interface is functional once the database is configured. Changes are saved via the /api/admin/settings API.'}
        </p>
      </div>

      <div className="card p-6 max-w-2xl">
        <form className="flex flex-col gap-4" aria-label={isFr ? 'Formulaire de paramètres' : 'Settings form'}>
          {defaultSettings.map(({ key, label, type }) => {
            const currentValue = settingsMap.get(key)
            return (
              <div key={key} className="flex flex-col gap-1">
                <label htmlFor={`setting-${key}`} className="text-sm font-medium text-charcoal">
                  {label}
                  <span className="text-xs text-brown/40 ml-2">({key})</span>
                </label>
                {type === 'boolean' ? (
                  <select
                    id={`setting-${key}`}
                    name={key}
                    defaultValue={String(currentValue ?? true)}
                    className="w-full px-4 py-2.5 rounded-xl border border-sage/40 bg-cream/30 focus:outline-none focus:ring-2 focus:ring-forest text-charcoal"
                  >
                    <option value="true">{isFr ? 'Activé' : 'Enabled'}</option>
                    <option value="false">{isFr ? 'Désactivé' : 'Disabled'}</option>
                  </select>
                ) : (
                  <input
                    id={`setting-${key}`}
                    name={key}
                    type={type}
                    defaultValue={String(currentValue ?? '')}
                    placeholder={`[${isFr ? 'À définir' : 'To be defined'}]`}
                    className="w-full px-4 py-2.5 rounded-xl border border-sage/40 bg-cream/30 focus:outline-none focus:ring-2 focus:ring-forest text-charcoal"
                  />
                )}
              </div>
            )
          })}
          <div className="pt-2">
            <button type="submit" className="btn-primary">
              {isFr ? 'Enregistrer les paramètres' : 'Save settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
