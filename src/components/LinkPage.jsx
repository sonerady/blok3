import { useEffect, useState } from 'react'
import './LinkPage.css'
const API = 'https://blok-3-server-production.up.railway.app/api/blok3'
const safe = value => { try { return ['http:', 'https:'].includes(new URL(value).protocol) } catch { return false } }
export default function LinkPage() {
  const [links, setLinks] = useState([])
  const [status, setStatus] = useState('loading')
  const [retry, setRetry] = useState(0)
  useEffect(() => {
    document.title = 'BLOK3 — Tüm linkler'
    const controller = new AbortController()
    fetch(`${API}/links?category=bio`, { signal: controller.signal })
      .then(async res => { if (!res.ok) throw new Error(); const data = await res.json(); if (!Array.isArray(data)) throw new Error(); setLinks(data.filter(l => l.is_active && safe(l.url)));setStatus('ready') })
      .catch(e => { if (e.name !== 'AbortError') setStatus('error') })
    return () => controller.abort()
  }, [retry])
  return <main className="bio-page"><div className="bio-shell">
    <header><a href="/" className="bio-wordmark" aria-label="BLOK3 ana sayfa">BLOK<span>3</span></a><span className="bio-official">RESMÎ BAĞLANTILAR</span><h1>Aynı ses.<br/>Her yerde.</h1><p>Müzik, sahne ve bir sonraki buluşma.<br/>Aradığın her şey burada.</p></header>
    <div className="bio-list" aria-live="polite">
      {status === 'loading' && <p className="bio-message">Bağlantılar yükleniyor…</p>}
      {status === 'error' && <div className="bio-message"><p>Bağlantılar şu an yüklenemedi.</p><button onClick={() => { setStatus('loading'); setRetry(x => x + 1) }}>Tekrar dene</button></div>}
      {status === 'ready' && !links.length && <a className="bio-link" href="/"><div><strong>BLOK3 dünyasına gir</strong><span>Müzik, konserler ve daha fazlası</span></div><Arrow /></a>}
      {links.map((link, index) => <a key={link.id} className="bio-link" href={link.url} target="_blank" rel="noopener noreferrer" style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}><span className="bio-number">{String(index + 1).padStart(2, '0')}</span><div><strong>{link.label}</strong>{link.subtitle && <span>{link.subtitle}</span>}</div><Arrow /></a>)}
    </div><footer><span>BLOK3</span><a href="/">Resmî siteyi keşfet ↗</a></footer>
  </div></main>
}
function Arrow() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg> }
