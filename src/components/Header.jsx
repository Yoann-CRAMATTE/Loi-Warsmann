import logoUrl from '/Logo_EuropaSoft_Complet_horizontal.png'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <img src={logoUrl} alt="EuropaSoft" className="h-10 object-contain" />
        <div className="text-right">
          <h1 className="text-lg font-bold text-blue-700 leading-tight">
            Loi Warsmann
          </h1>
          <p className="text-xs text-gray-500">Dégrèvement fuite d'eau</p>
        </div>
      </div>
    </header>
  )
}
