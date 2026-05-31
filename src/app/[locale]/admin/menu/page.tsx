import { createAdminSupabaseClient } from '@/lib/supabase/server'

export default async function AdminMenuPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isFr = locale === 'fr'

  const adminClient = await createAdminSupabaseClient()
  const { data: categories } = await adminClient
    .from('menu_categories')
    .select('*, menu_items(count)')
    .order('sort_order', { ascending: true })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-serif text-forest">Menu</h1>
        <button className="btn-primary text-sm py-2 px-4">
          {isFr ? '+ Ajouter un article' : '+ Add item'}
        </button>
      </div>

      {!categories || categories.length === 0 ? (
        <div className="card p-8 text-center text-brown/60">
          {isFr ? 'Aucune catégorie de menu créée.' : 'No menu categories created yet.'}
          <p className="text-sm mt-2">
            {isFr
              ? 'Exécutez les migrations Supabase pour initialiser le menu.'
              : 'Run Supabase migrations to initialize the menu.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-serif text-lg text-forest">
                  {isFr ? cat.name_fr : cat.name_en}
                </h2>
                <span className={`text-xs px-2 py-1 rounded-full ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {cat.is_active ? (isFr ? 'Actif' : 'Active') : (isFr ? 'Inactif' : 'Inactive')}
                </span>
              </div>
              <p className="text-sm text-brown/60">
                {isFr ? `Ordre : ${cat.sort_order}` : `Order: ${cat.sort_order}`}
              </p>
              <button className="mt-3 text-xs text-forest hover:text-terracotta transition-colors">
                {isFr ? 'Gérer les articles →' : 'Manage items →'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
