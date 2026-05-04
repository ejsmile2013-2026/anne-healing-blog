import { useState, useRef, useEffect } from 'react'
import {
  getCalendar, addEntry, updateEntry, deleteEntry, moveEntry, clearMonth,
} from '../utils/calendarStorage'
import { autoFillMonth } from '../utils/calendarAutoFill'
import { exportCSV, exportPDF } from '../utils/calendarExport'

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_CONFIG = {
  reels:        { label: '🎬 Рилс',            dot: 'bg-pink-500',   badge: 'bg-pink-100 text-pink-700',    border: 'border-pink-200',  ring: 'ring-pink-300' },
  stories:      { label: '📱 Сторис',           dot: 'bg-sky-400',    badge: 'bg-sky-100 text-sky-700',      border: 'border-sky-200',   ring: 'ring-sky-300' },
  carousel:     { label: '🎠 Карусель',         dot: 'bg-green-500',  badge: 'bg-green-100 text-green-700',  border: 'border-green-200', ring: 'ring-green-300' },
  talking_head: { label: '🗣️ Говорящая голова', dot: 'bg-amber-400',  badge: 'bg-amber-100 text-amber-700',  border: 'border-amber-200', ring: 'ring-amber-300' },
}

const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь']
const DOWS   = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']
const BEST_DAYS = new Set([1, 2, 3, 4]) // Tue Wed Thu Fri (Mon=0)

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildGrid(year, month) {
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7
  const days     = new Date(year, month + 1, 0).getDate()
  const prevLast = new Date(year, month, 0).getDate()
  const cells    = []

  for (let i = firstDow - 1; i >= 0; i--)
    cells.push({ date: null, day: prevLast - i, inMonth: false })

  for (let d = 1; d <= days; d++)
    cells.push({
      date: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      day: d, inMonth: true,
    })

  while (cells.length % 7 !== 0)
    cells.push({ date: null, day: cells.length - firstDow - days + 1, inMonth: false })

  return cells
}

function genId() {
  return `e-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

function todayStr() {
  const t = new Date()
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}

// ─── DayPanel ─────────────────────────────────────────────────────────────────

function DayPanel({ date, entries, onAdd, onTogglePublished, onDelete, onUpdate, onClose }) {
  const [adding, setAdding]         = useState(false)
  const [form, setForm]             = useState({ type: 'reels', title: '', description: '' })
  const [editingId, setEditingId]   = useState(null)
  const [editTitle, setEditTitle]   = useState('')

  const formatted = new Date(date + 'T00:00:00').toLocaleDateString('ru-RU', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  function handleAdd(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    onAdd(date, form.type, form.title.trim(), form.description.trim())
    setForm({ type: 'reels', title: '', description: '' })
    setAdding(false)
  }

  function startEdit(entry) { setEditingId(entry.id); setEditTitle(entry.title) }

  function saveEdit(id) {
    if (editTitle.trim()) onUpdate(date, id, { title: editTitle.trim() })
    setEditingId(null)
  }

  const publishedCount = entries.filter(e => e.published).length

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden animate-fade-in lg:sticky lg:top-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-b border-gray-100 px-4 py-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Выбран день</p>
          <p className="text-sm font-bold text-gray-900 capitalize mt-0.5">{formatted}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {entries.length} записей
            {publishedCount > 0 && ` · ${publishedCount} опубликовано`}
          </p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 flex-shrink-0 text-lg leading-none">✕</button>
      </div>

      <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
        {/* Empty state */}
        {entries.length === 0 && !adding && (
          <div className="text-center py-6">
            <div className="text-3xl mb-2">📅</div>
            <p className="text-sm text-gray-400">Нет записей на этот день</p>
          </div>
        )}

        {/* Entries */}
        {entries.map(entry => {
          const cfg = TYPE_CONFIG[entry.type] || TYPE_CONFIG.reels
          return (
            <div
              key={entry.id}
              className={`rounded-xl border-2 p-3 transition-all duration-200 ${cfg.border} ${entry.published ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start gap-2.5">
                {/* Published toggle */}
                <button
                  onClick={() => onTogglePublished(date, entry.id)}
                  title={entry.published ? 'Снять отметку' : 'Отметить как опубликовано'}
                  className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    entry.published
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  {entry.published && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <span className={`inline-block text-xs px-1.5 py-0.5 rounded-full font-medium mb-1 ${cfg.badge}`}>
                    {cfg.label}
                  </span>

                  {editingId === entry.id ? (
                    <div className="flex gap-1 mt-1">
                      <input
                        autoFocus
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') saveEdit(entry.id)
                          if (e.key === 'Escape') setEditingId(null)
                        }}
                        className="flex-1 text-sm border border-pink-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                      />
                      <button
                        onClick={() => saveEdit(entry.id)}
                        className="px-2 py-1 bg-pink-500 text-white text-xs rounded-lg hover:bg-pink-600 transition-all"
                      >✓</button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-1 border border-gray-200 text-gray-500 text-xs rounded-lg hover:bg-gray-50 transition-all"
                      >✕</button>
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-gray-800 leading-snug">{entry.title}</p>
                  )}

                  {entry.description && editingId !== entry.id && (
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{entry.description}</p>
                  )}

                  {entry.published && (
                    <p className="text-xs text-green-600 font-medium mt-1">✓ Опубликовано</p>
                  )}
                </div>

                {/* Edit / Delete */}
                <div className="flex-shrink-0 flex gap-0.5">
                  <button
                    onClick={() => startEdit(entry)}
                    title="Редактировать"
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all text-sm"
                  >✏️</button>
                  <button
                    onClick={() => onDelete(date, entry.id)}
                    title="Удалить"
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all text-sm"
                  >🗑️</button>
                </div>
              </div>
            </div>
          )
        })}

        {/* Add form */}
        {adding ? (
          <form onSubmit={handleAdd} className="rounded-xl border-2 border-dashed border-pink-300 bg-pink-50/50 p-3 space-y-2 animate-fade-in">
            <p className="text-xs font-bold text-pink-700">Новая запись</p>
            <select
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              className="w-full text-sm rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            >
              {Object.entries(TYPE_CONFIG).map(([t, cfg]) => (
                <option key={t} value={t}>{cfg.label}</option>
              ))}
            </select>
            <input
              autoFocus
              required
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Заголовок *"
              className="w-full text-sm rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            />
            <input
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Описание (необязательно)"
              className="w-full text-sm rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            />
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all shadow-sm"
              >
                Добавить
              </button>
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="flex-1 py-1.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all"
              >
                Отмена
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-pink-200 text-pink-500 text-sm font-medium hover:bg-pink-50 hover:border-pink-300 transition-all flex items-center justify-center gap-2"
          >
            <span className="text-lg leading-none">+</span>
            <span>Добавить запись</span>
          </button>
        )}
      </div>
    </div>
  )
}

// ─── CalendarPage ─────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const today  = new Date()
  const tStr   = todayStr()

  const [calendar,       setCalendar]       = useState(getCalendar)
  const [year,           setYear]           = useState(today.getFullYear())
  const [month,          setMonth]          = useState(today.getMonth())
  const [selectedDate,   setSelectedDate]   = useState(null)
  const [dragEntry,      setDragEntry]      = useState(null)
  const [dragOverDate,   setDragOverDate]   = useState(null)
  const [confirmClear,   setConfirmClear]   = useState(false)
  const [fillDone,       setFillDone]       = useState(false)

  const panelRef = useRef(null)

  const grid = buildGrid(year, month)
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`

  const monthCount = Object.entries(calendar)
    .filter(([d]) => d.startsWith(monthPrefix))
    .reduce((s, [, es]) => s + es.length, 0)

  // Scroll panel into view on mobile
  useEffect(() => {
    if (selectedDate && panelRef.current) {
      setTimeout(() => panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 60)
    }
  }, [selectedDate])

  // ── Month navigation ───────────────────────────────────────────────────────

  function prevMonth() {
    setSelectedDate(null)
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }

  function nextMonth() {
    setSelectedDate(null)
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  function goToday() {
    setYear(today.getFullYear())
    setMonth(today.getMonth())
    setSelectedDate(null)
  }

  // ── Calendar mutations ────────────────────────────────────────────────────

  function handleAutoFill() {
    setCalendar(autoFillMonth(calendar, year, month))
    setFillDone(true)
    setTimeout(() => setFillDone(false), 2200)
  }

  function handleClearConfirmed() {
    setCalendar(clearMonth(calendar, year, month))
    setConfirmClear(false)
    setSelectedDate(null)
  }

  function handleAdd(date, type, title, description) {
    setCalendar(addEntry(calendar, date, { id: genId(), date, type, title, description, published: false }))
  }

  function handleTogglePublished(date, id) {
    const entry = (calendar[date] || []).find(e => e.id === id)
    if (entry) setCalendar(updateEntry(calendar, date, id, { published: !entry.published }))
  }

  function handleDelete(date, id) {
    setCalendar(deleteEntry(calendar, date, id))
  }

  function handleUpdate(date, id, updates) {
    setCalendar(updateEntry(calendar, date, id, updates))
  }

  // ── Drag & Drop ────────────────────────────────────────────────────────────

  function handleDragStart(e, entryId, fromDate) {
    setDragEntry({ id: entryId, fromDate })
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e, date) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (date !== dragOverDate) setDragOverDate(date)
  }

  function handleDrop(e, toDate) {
    e.preventDefault()
    if (dragEntry && dragEntry.fromDate !== toDate) {
      const next = moveEntry(calendar, dragEntry.fromDate, toDate, dragEntry.id)
      setCalendar(next)
      if (selectedDate === dragEntry.fromDate) setSelectedDate(toDate)
    }
    setDragEntry(null)
    setDragOverDate(null)
  }

  function handleDragEnd() {
    setDragEntry(null)
    setDragOverDate(null)
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-5xl mx-auto px-3 py-6 space-y-4">

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start gap-3 justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Контент-календарь</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {MONTHS[month]} {year}
            {monthCount > 0 && ` · ${monthCount} ${monthCount === 1 ? 'запись' : monthCount < 5 ? 'записи' : 'записей'}`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleAutoFill}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all duration-200 ${
              fillDone
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 shadow-pink-200'
            }`}
          >
            <span>{fillDone ? '✅' : '✨'}</span>
            <span>{fillDone ? 'Готово!' : 'Заполнить месяц'}</span>
          </button>

          <button
            onClick={() => exportCSV(calendar, year, month)}
            title="Скачать CSV"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <span>📊</span><span className="hidden sm:inline">CSV</span>
          </button>

          <button
            onClick={() => exportPDF(calendar, year, month, MONTHS[month])}
            title="Распечатать / Сохранить как PDF"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <span>🖨️</span><span className="hidden sm:inline">PDF</span>
          </button>

          <button
            onClick={() => setConfirmClear(true)}
            title="Очистить месяц"
            className="flex items-center gap-1 px-3 py-2 rounded-xl border border-red-200 text-red-400 text-sm font-medium hover:bg-red-50 hover:border-red-300 transition-all"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* ── Month navigator ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-gray-100 transition-all" aria-label="Предыдущий месяц">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-base font-bold text-gray-900 min-w-[160px] text-center select-none">
          {MONTHS[month]} {year}
        </span>
        <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-gray-100 transition-all" aria-label="Следующий месяц">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button onClick={goToday} className="text-xs font-semibold text-pink-500 hover:text-pink-600 px-2 py-1 rounded-lg hover:bg-pink-50 transition-all">
          Сегодня
        </button>
      </div>

      {/* ── Legend ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
          <div key={type} className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
            {cfg.label}
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span className="text-amber-400 font-bold">★</span>
          Лучшие дни для публикации
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span className="w-4 h-4 rounded-md border border-dashed border-gray-300 inline-block" />
          Перетащи для переноса
        </div>
      </div>

      {/* ── Grid + Panel ─────────────────────────────────────────────────────── */}
      <div className={`grid gap-4 items-start ${selectedDate ? 'lg:grid-cols-[1fr_300px]' : ''}`}>

        {/* Calendar grid */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" id="cal-print">

          {/* DOW headers */}
          <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/60">
            {DOWS.map((d, i) => (
              <div
                key={d}
                className={`py-2.5 text-center text-xs font-semibold select-none ${
                  BEST_DAYS.has(i) ? 'text-pink-500' : 'text-gray-400'
                }`}
              >
                {d}
                {BEST_DAYS.has(i) && <span className="ml-0.5 text-amber-400">★</span>}
              </div>
            ))}
          </div>

          {/* Day cells — gap-px creates the grid lines */}
          <div className="grid grid-cols-7 gap-px bg-gray-100">
            {grid.map((cell, idx) => {

              if (!cell.inMonth) {
                return (
                  <div
                    key={`out-${idx}`}
                    className="bg-gray-50 min-h-[72px] p-1.5"
                  >
                    <span className="text-xs text-gray-300 select-none">{cell.day}</span>
                  </div>
                )
              }

              const entries   = calendar[cell.date] || []
              const isToday   = cell.date === tStr
              const isSel     = cell.date === selectedDate
              const isDragOver = cell.date === dragOverDate

              return (
                <div
                  key={cell.date}
                  onClick={() => setSelectedDate(isSel ? null : cell.date)}
                  onDragOver={(e) => handleDragOver(e, cell.date)}
                  onDrop={(e) => handleDrop(e, cell.date)}
                  onDragLeave={() => { if (dragOverDate === cell.date) setDragOverDate(null) }}
                  className={`bg-white min-h-[72px] p-1.5 cursor-pointer select-none transition-colors duration-100 ${
                    isSel
                      ? 'bg-pink-50 ring-2 ring-inset ring-pink-400'
                      : isDragOver
                      ? 'bg-purple-50 ring-2 ring-inset ring-purple-300'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Day number */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                    isToday
                      ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white'
                      : 'text-gray-600'
                  }`}>
                    {cell.day}
                  </div>

                  {/* Entry pills */}
                  <div className="space-y-0.5">
                    {entries.slice(0, 3).map(entry => {
                      const cfg = TYPE_CONFIG[entry.type] || TYPE_CONFIG.reels
                      return (
                        <div
                          key={entry.id}
                          draggable
                          onDragStart={(e) => { e.stopPropagation(); handleDragStart(e, entry.id, cell.date) }}
                          onDragEnd={handleDragEnd}
                          onClick={(e) => { e.stopPropagation(); setSelectedDate(cell.date) }}
                          className={`text-xs px-1.5 py-0.5 rounded-md truncate flex items-center gap-1 cursor-grab active:cursor-grabbing transition-opacity ${cfg.badge} ${entry.published ? 'opacity-50' : ''}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                          <span className="truncate leading-none">{entry.published ? '✓ ' : ''}{entry.title}</span>
                        </div>
                      )
                    })}
                    {entries.length > 3 && (
                      <div className="text-xs text-gray-400 pl-0.5">+{entries.length - 3}</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Day panel */}
        {selectedDate && (
          <div ref={panelRef}>
            <DayPanel
              date={selectedDate}
              entries={calendar[selectedDate] || []}
              onAdd={handleAdd}
              onTogglePublished={handleTogglePublished}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              onClose={() => setSelectedDate(null)}
            />
          </div>
        )}
      </div>

      {/* ── Confirm clear ────────────────────────────────────────────────────── */}
      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-3xl mb-3 text-center">🗑️</div>
            <h3 className="text-base font-bold text-gray-900 mb-1 text-center">Очистить месяц?</h3>
            <p className="text-sm text-gray-500 mb-5 text-center">
              Все записи за {MONTHS[month]} {year} будут удалены. Это нельзя отменить.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleClearConfirmed}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all"
              >
                Очистить
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Empty state hint ─────────────────────────────────────────────────── */}
      {monthCount === 0 && !confirmClear && (
        <div className="rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 p-5 text-center">
          <div className="text-3xl mb-2">📅</div>
          <p className="text-sm font-semibold text-gray-700 mb-1">Календарь пуст</p>
          <p className="text-xs text-gray-500 mb-4">Нажми «Заполнить месяц» — и получишь готовый план контента на {MONTHS[month]}</p>
          <button
            onClick={handleAutoFill}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-all"
          >
            <span>✨</span><span>Заполнить автоматически</span>
          </button>
        </div>
      )}
    </div>
  )
}
