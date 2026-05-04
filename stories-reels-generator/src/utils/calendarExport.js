const TYPE_NAMES = {
  reels: 'Рилс',
  stories: 'Сторис',
  carousel: 'Карусель',
  talking_head: 'Говорящая голова',
}

const TYPE_COLORS = {
  reels: '#ec4899',
  stories: '#38bdf8',
  carousel: '#22c55e',
  talking_head: '#f59e0b',
}

const DOW_RU = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

function fmt(dateStr) {
  const [y, m, d] = dateStr.split('-')
  return `${d}.${m}.${y}`
}

function dowRu(dateStr) {
  return DOW_RU[new Date(dateStr + 'T00:00:00').getDay()]
}

// ─── CSV ──────────────────────────────────────────────────────────────────────

export function exportCSV(calendar, year, month) {
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}`
  const rows = [['Дата', 'День', 'Тип контента', 'Заголовок', 'Описание', 'Опубликовано']]

  const entries = []
  for (const [date, es] of Object.entries(calendar)) {
    if (!date.startsWith(prefix)) continue
    for (const e of es) entries.push({ date, ...e })
  }
  entries.sort((a, b) => a.date.localeCompare(b.date))

  for (const e of entries) {
    rows.push([
      fmt(e.date),
      dowRu(e.date),
      TYPE_NAMES[e.type] || e.type,
      e.title || '',
      e.description || '',
      e.published ? 'Да' : 'Нет',
    ])
  }

  const csv = '﻿' + rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `calendar-${year}-${String(month + 1).padStart(2, '0')}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(a.href)
}

// ─── PDF ──────────────────────────────────────────────────────────────────────

export function exportPDF(calendar, year, month, monthName) {
  const days = new Date(year, month + 1, 0).getDate()
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7

  const cells = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= days; d++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ day: d, date, entries: calendar[date] || [] })
  }
  while (cells.length % 7 !== 0) cells.push(null)

  const rows = []
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7))

  const cellsHtml = rows.map(row =>
    `<tr>${row.map(cell => {
      if (!cell) return '<td class="empty"></td>'
      const pills = cell.entries.map(e => {
        const color = TYPE_COLORS[e.type] || '#a855f7'
        const pub = e.published ? '<span style="color:#16a34a">✓ </span>' : ''
        return `<div class="pill" style="border-left:3px solid ${color}">${pub}${cell.entries.length > 0 ? (e.title || TYPE_NAMES[e.type]) : ''}</div>`
      }).join('')
      return `<td><div class="dn">${cell.day}</div>${pills}</td>`
    }).join('')}</tr>`
  ).join('')

  const html = `<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8">
<title>Контент-календарь: ${monthName} ${year}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Arial,sans-serif;padding:16px;color:#1f2937;font-size:12px}
h1{text-align:center;font-size:20px;font-weight:800;color:#7c3aed;margin-bottom:10px}
.legend{display:flex;gap:14px;justify-content:center;margin-bottom:12px;flex-wrap:wrap}
.li{display:flex;align-items:center;gap:5px;font-size:10px;color:#6b7280}
.ld{width:9px;height:9px;border-radius:50%}
table{width:100%;border-collapse:collapse;table-layout:fixed}
th{background:#f5f3ff;color:#7c3aed;padding:6px 2px;text-align:center;border:1px solid #e5e7eb;font-size:10px}
td{border:1px solid #e5e7eb;padding:4px;vertical-align:top;height:90px}
td.empty{background:#f9fafb}
.dn{font-weight:700;font-size:13px;color:#374151;margin-bottom:3px}
.pill{font-size:9px;padding:2px 5px;margin-bottom:2px;background:#f9fafb;border-radius:3px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;color:#374151}
@media print{@page{margin:8mm}body{padding:0}}
</style></head><body>
<h1>Контент-календарь: ${monthName} ${year}</h1>
<div class="legend">
<div class="li"><div class="ld" style="background:#ec4899"></div>Рилс</div>
<div class="li"><div class="ld" style="background:#38bdf8"></div>Сторис</div>
<div class="li"><div class="ld" style="background:#22c55e"></div>Карусель</div>
<div class="li"><div class="ld" style="background:#f59e0b"></div>Говорящая голова</div>
</div>
<table><thead><tr><th>Пн</th><th>Вт</th><th>Ср</th><th>Чт</th><th>Пт</th><th>Сб</th><th>Вс</th></tr></thead>
<tbody>${cellsHtml}</tbody></table>
</body></html>`

  const w = window.open('', '_blank', 'width=1100,height=800')
  if (!w) { alert('Разреши всплывающие окна для экспорта PDF'); return }
  w.document.write(html)
  w.document.close()
  w.addEventListener('load', () => setTimeout(() => w.print(), 400))
}
