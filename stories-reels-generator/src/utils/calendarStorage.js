const KEY = 'constellation_calendar'

export function getCalendar() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') }
  catch { return {} }
}

export function saveCalendar(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)) } catch {}
}

export function addEntry(cal, date, entry) {
  const next = { ...cal, [date]: [...(cal[date] || []), entry] }
  saveCalendar(next)
  return next
}

export function updateEntry(cal, date, entryId, updates) {
  const next = { ...cal, [date]: (cal[date] || []).map(e => e.id === entryId ? { ...e, ...updates } : e) }
  saveCalendar(next)
  return next
}

export function deleteEntry(cal, date, entryId) {
  const entries = (cal[date] || []).filter(e => e.id !== entryId)
  const next = { ...cal }
  if (entries.length > 0) next[date] = entries
  else delete next[date]
  saveCalendar(next)
  return next
}

export function moveEntry(cal, fromDate, toDate, entryId) {
  if (fromDate === toDate) return cal
  const entry = (cal[fromDate] || []).find(e => e.id === entryId)
  if (!entry) return cal
  const from = (cal[fromDate] || []).filter(e => e.id !== entryId)
  const to = [...(cal[toDate] || []), { ...entry, date: toDate }]
  const next = { ...cal, [fromDate]: from, [toDate]: to }
  if (from.length === 0) delete next[fromDate]
  saveCalendar(next)
  return next
}

export function clearMonth(cal, year, month) {
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}`
  const next = { ...cal }
  for (const k of Object.keys(next)) { if (k.startsWith(prefix)) delete next[k] }
  saveCalendar(next)
  return next
}
