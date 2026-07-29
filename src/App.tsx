import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MenuProvider } from './context/MenuContext'
import { TransitionProvider } from './context/TransitionContext'
import { AuthProvider } from './context/AuthContext'
import { Navbar } from './components/Navbar'
import { MenuOverlay } from './components/MenuOverlay'
import { PageTransition } from './components/PageTransition'
import { IntroSequence } from './components/IntroSequence'
import { ScrollToTop } from './components/ScrollToTop'
import { RequireAuth } from './components/admin/RequireAuth'

const Home = lazy(() => import('./pages/Home'))
const APropos = lazy(() => import('./pages/APropos'))
const Prestations = lazy(() => import('./pages/Prestations'))
const MepStudio = lazy(() => import('./pages/MepStudio'))
const TopoStudio = lazy(() => import('./pages/TopoStudio'))
const VrdStudio = lazy(() => import('./pages/VrdStudio'))
const BimStudio = lazy(() => import('./pages/BimStudio'))
const Devis = lazy(() => import('./pages/Devis'))
const Reunion = lazy(() => import('./pages/Reunion'))
const Portefeuille = lazy(() => import('./pages/Portefeuille'))
const Clients = lazy(() => import('./pages/Clients'))
const Nouvelles = lazy(() => import('./pages/Nouvelles'))
const NouvelleArticle = lazy(() => import('./pages/NouvelleArticle'))
const Contact = lazy(() => import('./pages/Contact'))

// Admin (code-split, rendered without the public site chrome)
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminArticles = lazy(() => import('./pages/admin/AdminArticles'))
const AdminArticleEditor = lazy(() => import('./pages/admin/AdminArticleEditor'))
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'))
const AdminProjectEditor = lazy(() => import('./pages/admin/AdminProjectEditor'))
const AdminSubmissions = lazy(() => import('./pages/admin/AdminSubmissions'))

function PublicApp() {
  return (
    <MenuProvider>
      <TransitionProvider>
        <ScrollToTop />
        <IntroSequence />
        <Navbar />
        <MenuOverlay />
        <PageTransition />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/a-propos" element={<APropos />} />
            <Route path="/prestations" element={<Prestations />} />
            <Route path="/prestations/mep" element={<MepStudio />} />
            <Route path="/prestations/topo" element={<TopoStudio />} />
            <Route path="/prestations/vrd" element={<VrdStudio />} />
            <Route path="/prestations/bim" element={<BimStudio />} />
            <Route path="/devis" element={<Devis />} />
            <Route path="/reunion" element={<Reunion />} />
            <Route path="/portefeuille" element={<Portefeuille />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/nouvelles" element={<Nouvelles />} />
            <Route path="/nouvelles/:slug" element={<NouvelleArticle />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      </TransitionProvider>
    </MenuProvider>
  )
}

function AdminApp() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route path="login" element={<AdminLogin />} />
          <Route element={<RequireAuth><AdminLayout /></RequireAuth>}>
            <Route index element={<AdminDashboard />} />
            <Route path="nouvelles" element={<AdminArticles />} />
            <Route path="nouvelles/new" element={<AdminArticleEditor />} />
            <Route path="nouvelles/:id" element={<AdminArticleEditor />} />
            <Route path="portefeuille" element={<AdminProjects />} />
            <Route path="portefeuille/new" element={<AdminProjectEditor />} />
            <Route path="portefeuille/:id" element={<AdminProjectEditor />} />
            <Route path="demandes" element={<AdminSubmissions />} />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<PublicApp />} />
      </Routes>
    </BrowserRouter>
  )
}
