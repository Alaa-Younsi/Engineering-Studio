import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MenuProvider } from './context/MenuContext'
import { TransitionProvider } from './context/TransitionContext'
import { Navbar } from './components/Navbar'
import { MenuOverlay } from './components/MenuOverlay'
import { PageTransition } from './components/PageTransition'
import { IntroSequence } from './components/IntroSequence'
import { ScrollToTop } from './components/ScrollToTop'

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

function AppShell() {
  return (
    <>
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
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <MenuProvider>
        <TransitionProvider>
          <AppShell />
        </TransitionProvider>
      </MenuProvider>
    </BrowserRouter>
  )
}
