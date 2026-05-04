import { useState, useEffect, useCallback } from 'react'
import { searchHistory, deleteFromHistory, clearHistory, formatRelativeDate } from '../utils/history'

const TYPE_LABELS = {
  reels: '🎬 Рилс',
  stories: '📱 Сторис',
  carousel: '🎠 Карусель',
  talking_head: '🗣️ Говорящая голова',
}

const TYPE_BADGE = {
  reels: 'bg-pink-100 text-pink-700',
  stories: 'bg-purple-100 text-purple-700',
  carousel: 'bg-indigo-100 text-indigo-700',
  talking_head: 'bg-fuchsia-100 text-fuchsia-700',
}

const TONE_LABELS = {
  friendly: '🤗 Дружеский',
  expert: '🧠 Экспертный',
  provocative: '⚡ Провокационный',
  inspirational: '✨ Вдохновляющий',
  humorous: '😄 Юмористический',
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handle = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }
  return (
    <button
      onClick={handle}
      className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
        copied ? 'border-green-300 text-green-600 bg-green-50' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
      }`}
    >
      {copied ? '✅' : '📋'}
    </button>
  )
}

function HistoryCard({ entry, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const [copiedAll, setCopiedAll] = useState(false)

  const { idea, formData, generated, createdAt } = entry

  const handleCopyAll = () => {
    const text = [
      `📌 ПОДПИСЬ К ПОСТУ`,
      generated.caption,
      ``,
      `🎣 ВАРИАНТЫ ПЕРВОЙ СТРОКИ`,
      generated.firstLines.map((l, i) => `${i + 1}. ${l}`).join('\n'),
      ``,
      `📣 CTA`,
      generated.ctas.map((c, i) => `${i + 1}. ${c}`).join('\n'),
      ``,
      `#️⃣ ХЕШТЕГИ`,
      generated.hashtags.join(' '),
      ``,
      `📱 СТОРИС-АНОНС`,
      generated.storiesAnnounce,
    ].join('\n')

    navigator.clipboard.writeText(text).then(() => {
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 2000)
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in">
      {/* Card header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 leading-tight truncate">
              {idea.title}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_BADGE[idea.typeKey] || 'bg-gray-100 text-gray-600'}`}>
                {TYPE_LABELS[idea.typeKey] || idea.type}
              </span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {TONE_LABELS[formData?.tone] || formData?.tone}
              </span>
              <span className="text-xs text-gray-400">
                {formatRelativeDate(createdAt)}
              </span>
            </div>
          </div>
          <button
            onClick={() => onDelete(entry.id)}
            className="flex-shrink-0 text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
            title="Удалить"
          >
            ×
          </button>
        </div>

        {/* Caption preview */}
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
          {generated.caption}
        </p>

        {/* Action row */}
        <div className="flex gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-1 text-xs font-semibold py-2 px-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
          >
            {expanded ? '▲ Скрыть' : '▼ Использовать повторно'}
          </button>
          <button
            onClick={handleCopyAll}
            className={`text-xs font-semibold py-2 px-3 rounded-xl transition-all ${
              copiedAll
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90'
            }`}
          >
            {copiedAll ? '✅' : '📋 Всё'}
          </button>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-gray-100 p-4 space-y-3 bg-gray-50 animate-fade-in">

          {/* Caption */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">📌 Подпись</span>
              <CopyButton text={generated.caption} />
            </div>
            <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line bg-white rounded-lg p-2.5 border border-gray-200">
              {generated.caption}
            </p>
          </div>

          {/* First lines */}
          <div>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">🎣 Первые строки</span>
            <div className="space-y-1.5">
              {generated.firstLines.map((line, i) => (
                <div key={i} className="flex items-start gap-2 bg-white rounded-lg p-2.5 border border-gray-200">
                  <span className="flex-shrink-0 text-xs font-bold text-gray-400 w-4">{i + 1}.</span>
                  <p className="flex-1 text-xs text-gray-700 leading-relaxed">{line}</p>
                  <CopyButton text={line} />
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">📣 CTA</span>
            <div className="space-y-1.5">
              {generated.ctas.map((cta, i) => (
                <div key={i} className="flex items-start gap-2 bg-white rounded-lg p-2.5 border border-gray-200">
                  <span className="flex-shrink-0 text-xs font-bold text-gray-400 w-4">{i + 1}.</span>
                  <p className="flex-1 text-xs text-gray-700 leading-relaxed">{cta}</p>
                  <CopyButton text={cta} />
                </div>
              ))}
            </div>
          </div>

          {/* Hashtags */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                #️⃣ Хештеги ({generated.hashtags.length})
              </span>
              <CopyButton text={generated.hashtags.join(' ')} />
            </div>
            <div className="flex flex-wrap gap-1">
              {generated.hashtags.map(tag => (
                <span key={tag} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Stories announce */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">📱 Сторис-анонс</span>
              <CopyButton text={generated.storiesAnnounce} />
            </div>
            <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line bg-white rounded-lg p-2.5 border border-gray-200">
              {generated.storiesAnnounce}
            </p>
          </div>

          {/* Copy all from expanded */}
          <button
            onClick={handleCopyAll}
            className="w-full text-xs font-bold py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            {copiedAll ? <><span>✅</span><span>Скопировано!</span></> : <><span>📋</span><span>Копировать весь пакет</span></>}
          </button>
        </div>
      )}
    </div>
  )
}

export default function HistoryPage() {
  const [items, setItems] = useState([])
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const reload = useCallback(() => {
    const results = searchHistory(query, { typeKey: typeFilter, dateRange: dateFilter })
    setItems(results)
  }, [query, typeFilter, dateFilter])

  useEffect(() => { reload() }, [reload])

  const handleDelete = (id) => {
    deleteFromHistory(id)
    reload()
  }

  const handleClearAll = () => {
    clearHistory()
    setShowClearConfirm(false)
    reload()
  }

  const total = searchHistory('', {}).length

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">История генераций</h1>
          <p className="text-gray-500 text-sm mt-1">
            Все сгенерированные тексты — {total} {total === 1 ? 'запись' : total < 5 ? 'записи' : 'записей'}
          </p>
        </div>
        {total > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="text-xs text-red-400 hover:text-red-600 font-medium border border-red-200 px-3 py-1.5 rounded-xl hover:bg-red-50 transition-all flex-shrink-0"
          >
            🗑 Очистить
          </button>
        )}
      </div>

      {/* Clear confirm */}
      {showClearConfirm && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 flex items-center justify-between gap-3 animate-fade-in">
          <p className="text-sm text-red-700 font-medium">Удалить все {total} записей? Это нельзя отменить.</p>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => setShowClearConfirm(false)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Отмена</button>
            <button onClick={handleClearAll} className="text-xs px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600">Удалить</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Поиск по названию, тексту, нише…"
          className="w-full text-sm rounded-xl border border-gray-200 bg-white pl-10 pr-10 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">✕</button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Type filter */}
        <div className="flex items-center gap-1 flex-wrap">
          {[
            { value: 'all', label: 'Все типы' },
            { value: 'reels', label: '🎬 Рилс' },
            { value: 'carousel', label: '🎠 Карусель' },
            { value: 'stories', label: '📱 Сторис' },
            { value: 'talking_head', label: '🗣️ Гов. голова' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setTypeFilter(opt.value)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                typeFilter === opt.value
                  ? 'bg-pink-500 text-white border-pink-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-pink-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Date filter */}
        <div className="flex items-center gap-1 ml-auto">
          {[
            { value: 'all', label: 'Все даты' },
            { value: 'today', label: 'Сегодня' },
            { value: 'week', label: 'Неделя' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setDateFilter(opt.value)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                dateFilter === opt.value
                  ? 'bg-purple-500 text-white border-purple-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {(query || typeFilter !== 'all' || dateFilter !== 'all') && (
        <p className="text-sm text-gray-500">
          Найдено: <span className="font-semibold text-gray-800">{items.length}</span>{' '}
          {items.length === 1 ? 'запись' : items.length < 5 ? 'записи' : 'записей'}
        </p>
      )}

      {/* List */}
      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map(entry => (
            <HistoryCard key={entry.id} entry={entry} onDelete={handleDelete} />
          ))}
        </div>
      ) : total === 0 ? (
        // Empty state — never generated
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-gray-600 font-semibold text-lg">История пуста</p>
          <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto">
            Перейди на вкладку «Генератор», создай идеи и нажми «Написать текст» на любой карточке.
            Тексты сохранятся автоматически.
          </p>
        </div>
      ) : (
        // No results for current filter
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-600 font-medium">Ничего не найдено</p>
          <button
            onClick={() => { setQuery(''); setTypeFilter('all'); setDateFilter('all') }}
            className="mt-3 text-sm text-pink-600 hover:text-pink-700 font-medium"
          >
            Сбросить фильтры
          </button>
        </div>
      )}
    </div>
  )
}
