// Album subtitles contain the concert date, not the upload date.
export function galleryDate(item) {
  const months = ['ocak','subat','mart','nisan','mayis','haziran','temmuz','agustos','eylul','ekim','kasim','aralik']
  const text = String(item.subtitle || '').toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').trim()
  const match = text.match(/^(\d{1,2})(?:\s*[-–]\s*(\d{1,2}))?\s+([a-z]+)\s+(\d{4})$/)
  if (match) {
    const day = Number(match[2] || match[1]), month = months.indexOf(match[3]), year = Number(match[4])
    const time = Date.UTC(year, month, day), date = new Date(time)
    if (month >= 0 && date.getUTCFullYear() === year && date.getUTCMonth() === month && date.getUTCDate() === day) return time
  }
  return Date.parse(item.created_at) || 0
}
export function newestGalleryFirst(a, b) {
  return galleryDate(b) - galleryDate(a) || (Date.parse(b.created_at) || 0) - (Date.parse(a.created_at) || 0) || (a.sort_order || 0) - (b.sort_order || 0) || String(a.id).localeCompare(String(b.id))
}
