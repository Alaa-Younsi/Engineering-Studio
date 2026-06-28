export interface NavLink {
  label: string
  path: string
}

export const navLinks: NavLink[] = [
  { label: 'À propos', path: '/a-propos' },
  { label: 'Prestations', path: '/prestations' },
  { label: 'Portefeuille', path: '/portefeuille' },
  { label: 'Clients', path: '/clients' },
  { label: 'Nouvelles', path: '/nouvelles' },
  { label: 'Contact', path: '/contact' },
]
