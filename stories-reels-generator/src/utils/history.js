const STORAGE_KEY = 'babushka_history'

export function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveToHistory(entry) {
  try {
    const history = getHistory()
    // Avoid exact duplicates (same idea title + same generated caption)
    const isDuplicate = history.some(
      h => h.idea?.title === entry.idea?.title &&
           h.generated?.caption === entry.generated?.caption
    )
    if (isDuplicate) return
    const updated = [entry, ...history].slice(0, 100) // keep last 100
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // localStorage unavailable — fail silently
  }
}

export function deleteFromHistory(id) {
  try {
    const updated = getHistory().filter(h => h.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {}
}

export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
}

export function searchHistory(query, filters = {}) {
  const history = getHistory()
  const q = query.trim().toLowerCase()

  return history.filter(entry => {
    // Text search
    if (q) {
      const haystack = [
        entry.idea?.title,
        entry.idea?.description,
        entry.generated?.caption,
        entry.formData?.niche,
        entry.formData?.theme,
      ].join(' ').toLowerCase()
      if (!haystack.includes(q)) return false
    }

    // Type filter
    if (filters.typeKey && filters.typeKey !== 'all') {
      if (entry.idea?.typeKey !== filters.typeKey) return false
    }

    // Date filter
    if (filters.dateRange && filters.dateRange !== 'all') {
      const created = new Date(entry.createdAt)
      const now = new Date()
      if (filters.dateRange === 'today') {
        if (created.toDateString() !== now.toDateString()) return false
      } else if (filters.dateRange === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        if (created < weekAgo) return false
      }
    }

    return true
  })
}

export function formatRelativeDate(isoString) {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now - date
  const diffMin = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return 'только что'
  if (diffMin < 60) return `${diffMin} мин назад`
  if (diffHours < 24) return `${diffHours} ч назад`
  if (diffDays === 1) return 'вчера'
  if (diffDays < 7) return `${diffDays} дн назад`
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}
