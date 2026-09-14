import { StrictMode, useEffect, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './base.css'
const App = lazy(() => import('./App.jsx'))
const LinkPage = lazy(() => import('./components/LinkPage.jsx'))
const ClientDocument = lazy(() => import('./components/ClientDocument.jsx'))

// Her route değişiminde Google Analytics'e page_view gönderir
function AnalyticsTracker() {
  const location = useLocation()

  useEffect(() => {
    if (typeof window.gtag !== 'function') return
    window.gtag('event', 'page_view', {
      page_path: location.pathname + location.search,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [location])

  return null
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AnalyticsTracker />
      <Suspense fallback={<div style={{padding:32,color:"#aaa"}}>Yükleniyor…</div>}><Routes>
        <Route path="/" element={<App />} />
        <Route path="/belge" element={<ClientDocument />} />
      <Route path="/links" element={<LinkPage />} /><Route path="/linkler" element={<LinkPage />} /></Routes></Suspense>
    </BrowserRouter>
  </StrictMode>,
)
