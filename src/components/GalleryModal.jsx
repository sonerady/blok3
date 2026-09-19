import { newestGalleryFirst } from '../utils/galleryOrder.js'
import { useState, useEffect, useRef, useMemo } from 'react'
import './ConcertGallery.css'
const API = 'https://blok-3-server-production.up.railway.app/api/blok3'
const normalizeSearch = value => String(value || '').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i')
// Parent App supplies the visibility boolean and close callback.
// eslint-disable-next-line react/prop-types
export default function GalleryModal({ isOpen, onClose }) {
  const [albums, setAlbums] = useState([]), [album, setAlbum] = useState(null), [items, setItems] = useState([])
  const [type, setType] = useState('image'), [term, setTerm] = useState(''), [city, setCity] = useState(''), [sort, setSort] = useState('newest')
  const [status, setStatus] = useState('loading'), [mediaStatus, setMediaStatus] = useState('loading'), [active, setActive] = useState(null), [retry, setRetry] = useState(0)
  const panel = useRef(null)
  useEffect(() => {
    if (!isOpen) return
    const controller = new AbortController()
    setStatus('loading')
    fetch(`${API}/albums`, { signal: controller.signal }).then(async res => { if (!res.ok) throw new Error();const data=await res.json();if(!Array.isArray(data))throw new Error();setAlbums(data);setStatus('ready') }).catch(e => { if(e.name!=='AbortError')setStatus('error') })
    return () => controller.abort()
  }, [isOpen, retry])
  useEffect(() => {
    if (!isOpen || !album) return
    const controller = new AbortController();setItems([]);setMediaStatus('loading')
    fetch(`${API}/albums/${album.id}/photos`, { signal: controller.signal }).then(async res => { if(!res.ok)throw new Error();const data=await res.json();if(!Array.isArray(data))throw new Error();setItems(data);setMediaStatus('ready') }).catch(e => { if(e.name!=='AbortError')setMediaStatus('error') })
    return () => controller.abort()
  }, [isOpen, album, retry])
  useEffect(() => {
    if (!isOpen) {setAlbum(null);setActive(null);return}
    const previous = document.activeElement, overflow=document.body.style.overflow
    document.body.style.overflow='hidden';panel.current?.focus()
    return () => {document.body.style.overflow=overflow;previous?.focus()}
  }, [isOpen])
  const cities = [...new Set(albums.map(a => a.city || a.name.split(' - ')[0]).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'tr'))
  const shownAlbums = useMemo(() => albums.filter(a => {
    const matchType = type === 'video' ? (a.video_count || 0) > 0 : a.photo_count > 0
    return matchType && (!city || (a.city || a.name.split(' - ')[0]) === city) && normalizeSearch(`${a.name} ${a.subtitle} ${a.city}`).includes(normalizeSearch(term))
  }).sort((a,b) => sort==='az' ? a.name.localeCompare(b.name,'tr') : sort==='order' ? a.sort_order-b.sort_order : sort==='oldest' ? newestGalleryFirst(b,a) : newestGalleryFirst(a,b)), [albums, city, term, type, sort])
  const shownItems = items.filter(i => (i.media_type || 'image') === type && normalizeSearch(i.caption).includes(normalizeSearch(term))).sort((a,b) => sort==='az' ? (a.caption||'').localeCompare(b.caption||'','tr') : sort==='order' ? a.sort_order-b.sort_order : sort==='oldest' ? newestGalleryFirst(b,a) : newestGalleryFirst(a,b))
  const switchType = value => {setType(value);setActive(null)}
  const back = () => {setAlbum(null);setItems([]);setTerm('');setActive(null)}
  const move = step => { const index=shownItems.findIndex(i=>i.id===active?.id);setActive(shownItems[(index+step+shownItems.length)%shownItems.length]) }
  function handleKeys(e) {
    if(e.key==='Escape'){e.stopPropagation();if(active)setActive(null);else if(album)back();else onClose()}
    if(active && e.key==='ArrowRight')move(1)
    if(active && e.key==='ArrowLeft')move(-1)
    if(e.key==='Tab'){
      const root=active ? panel.current.querySelector('.cg-lightbox') : panel.current
      const focusable=[...root.querySelectorAll('button, input, select, a[href], video[controls]')].filter(el=>!el.disabled)
      const first=focusable[0],last=focusable.at(-1)
      if(e.shiftKey && (document.activeElement===first || document.activeElement===root)){e.preventDefault();last?.focus()}
      else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first?.focus()}
    }
  }
  if(!isOpen)return null
  return <div className="cg-overlay" onClick={onClose}><section ref={panel} tabIndex={-1} className="cg-panel" role="dialog" aria-modal="true" aria-label="Konser galerisi" onKeyDown={handleKeys} onClick={e=>e.stopPropagation()}>
    <header className="cg-header"><span>BLOK3 / SAHNEDEN</span><button className="cg-close" onClick={onClose} aria-label="Galeriyi kapat">✕</button></header>
    {album && <button className="cg-back" onClick={back}>← Tüm konserler</button>}
    <div className="cg-intro"><h2>{album ? album.name : <>O gece.<br/><em>O enerji.</em></>}</h2><p>{album ? album.subtitle : 'Sahnenin önünden, kalabalığın içinden.\nTurnenin unutulmaz anları.'}</p></div>
    <div className="cg-toolbar"><div className="cg-tabs" role="group" aria-label="Medya türü"><button aria-pressed={type==='image'} onClick={()=>switchType('image')}>Fotoğraflar</button><button aria-pressed={type==='video'} onClick={()=>switchType('video')}>Videolar</button></div>
      <div className="cg-filters"><label className="cg-search"><span aria-hidden="true">⌕</span><input aria-label="Galeride ara" placeholder={album?'Açıklamada ara…':'Konser, şehir veya mekan ara…'} value={term} onChange={e=>setTerm(e.target.value)}/></label>
      {!album && <select aria-label="Şehir filtresi" value={city} onChange={e=>setCity(e.target.value)}><option value="">Tüm şehirler</option>{cities.map(c=><option key={c}>{c}</option>)}</select>}
      <select aria-label="Sıralama" value={sort} onChange={e=>setSort(e.target.value)}><option value="newest">En yeni tarih</option><option value="oldest">En eski tarih</option><option value="az">A → Z</option><option value="order">Önerilen sıra</option></select></div>
    </div>
    {(album?mediaStatus:status)==='loading' ? <p className="cg-state" role="status">Sahneden anlar yükleniyor…</p> : (album?mediaStatus:status)==='error' ? <div className="cg-state"><p>Galeri yüklenemedi.</p><button onClick={()=>setRetry(x=>x+1)}>Tekrar dene</button></div> : <>
      <div className="cg-count">{album ? shownItems.length : shownAlbums.length} {album?(type==='video'?'video':'fotoğraf'):'konser'}</div>
      {(album?shownItems:shownAlbums).length===0 ? <div className="cg-state"><h3>{type==='video'?'Bu seçimde henüz video yok.':'Eşleşen fotoğraf bulunamadı.'}</h3><p>Başka bir şehir veya arama deneyebilirsin.</p>{(term||city) && <button onClick={()=>{setTerm('');setCity('')}}>Filtreleri temizle</button>}</div> :
      <div className="cg-grid">{album ? shownItems.map((item,index)=><button key={item.id} className="cg-tile" onClick={()=>setActive(item)} aria-label={`${item.media_type==='video'?'Videoyu oynat':'Fotoğrafı aç'} ${item.caption||index+1}`}>
        {item.media_type==='video' ? <>{item.poster_url?<img src={item.poster_url} alt="" loading="lazy"/>:<div className="cg-video-art"><span>BLOK3</span><small>LIVE ON STAGE</small></div>}<span className="cg-play">▶</span></>:<img src={item.src} alt={item.caption||`${album.name} konser fotoğrafı ${index+1}`} loading="lazy"/>}
        {item.caption && <span className="cg-tile-caption">{item.caption}</span>}
      </button>) : shownAlbums.map(a=><button key={a.id} className="cg-tile cg-album" onClick={()=>{setAlbum(a);setTerm('')}}>
        {a.cover?<img src={a.cover} alt="" loading="lazy"/>:<div className="cg-video-art"><span>BLOK3</span></div>}
        <span className="cg-badge">{type==='video'?a.video_count:a.photo_count} {type==='video'?'video':'fotoğraf'}</span><span className="cg-album-label"><small>{a.city||'KONSER'}</small><strong>{a.name}</strong><span>{a.subtitle}</span></span>
      </button>)}</div>}
    </>}
    {active && <div className="cg-lightbox" role="dialog" aria-modal="true" aria-label={active.caption||'Medya önizleme'} onClick={()=>setActive(null)}><button autoFocus className="cg-close" onClick={()=>setActive(null)} aria-label="Önizlemeyi kapat">✕</button>
      {active.media_type==='video'?<video key={active.id} controls autoPlay playsInline preload="none" poster={active.poster_url||undefined} src={active.src} onClick={e=>e.stopPropagation()}/>:<img src={active.src} alt={active.caption||album.name} onClick={e=>e.stopPropagation()}/>}
      <div className="cg-viewer-bar" onClick={e=>e.stopPropagation()}><button onClick={()=>move(-1)} aria-label="Önceki">←</button><span>{active.caption || album.name}<small>{shownItems.findIndex(i=>i.id===active.id)+1} / {shownItems.length}</small></span><button onClick={()=>move(1)} aria-label="Sonraki">→</button></div>
    </div>}
  </section></div>
}
