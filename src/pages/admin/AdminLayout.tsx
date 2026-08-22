import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { AdminButton } from '../../components/admin/ui'

const NAV = [
  { to: '/admin', label: 'Tableau de bord', end: true },
  { to: '/admin/demandes', label: 'Demandes', end: false },
  { to: '/admin/nouvelles', label: 'Nouvelles', end: false },
  { to: '/admin/portefeuille', label: 'Portefeuille', end: false },
]

export default function AdminLayout() {
  const { email, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-bg text-white flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-64 lg:flex-shrink-0 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col">
        <div className="px-6 py-6 flex items-center gap-3">
          <img src="/Assets/logo/Logo-seul.png" alt="" className="h-8 w-8 object-contain" />
          <div>
            <p className="font-display font-bold text-sm leading-none">Administration</p>
            <p className="font-body text-[0.7rem] text-secondary mt-1">Engineering Studio</p>
          </div>
        </div>

        {/*
         * `flex-wrap` (not `overflow-x-auto`) below `lg`: on a narrow phone
         * four tabs don't fit one row, and a scrollable row hid "Portefeuille"
         * off-screen with no hint more tabs existed. Wrapping to a second row
         * keeps every tab visible and reachable without discovery friction.
         */}
        <nav className="px-3 flex flex-row flex-wrap lg:flex-col lg:flex-nowrap gap-1">
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-xl px-4 py-2.5 font-body text-sm whitespace-nowrap transition-colors ${
                  isActive ? 'bg-white text-black' : 'text-secondary hover:text-white hover:bg-white/5'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto px-6 py-6 hidden lg:block">
          <a href="/" className="font-body text-xs text-secondary hover:text-white transition-colors">← Voir le site</a>
          <p className="font-body text-xs text-secondary mt-4 truncate" title={email ?? ''}>{email}</p>
          <button onClick={handleSignOut} className="font-body text-xs text-white/80 hover:text-white mt-2 underline underline-offset-2">
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0">
        <div className="lg:hidden flex items-center justify-between px-6 py-3 border-b border-white/10">
          <span className="font-body text-xs text-secondary truncate">{email}</span>
          <AdminButton variant="ghost" onClick={handleSignOut} className="!py-1.5 !px-4 text-xs">Déconnexion</AdminButton>
        </div>

        <div className="px-6 lg:px-10 py-8 lg:py-12 max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
