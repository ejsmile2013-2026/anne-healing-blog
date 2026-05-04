import { useState } from 'react'
import TemplateCard from '../components/TemplateCard'
import { CATEGORIES, getTemplatesByCategory } from '../data/templates'

const CATEGORY_GRADIENTS = {
  hooks:     'from-amber-500 to-orange-500',
  reels:     'from-pink-500 to-rose-500',
  stories:   'from-purple-500 to-violet-500',
  carousels: 'from-indigo-500 to-blue-500',
}

const CATEGORY_BG = {
  hooks:     'bg-amber-50 border-amber-200 text-amber-700',
  reels:     'bg-pink-50 border-pink-200 text-pink-700',
  stories:   'bg-purple-50 border-purple-200 text-purple-700',
  carousels: 'bg-indigo-50 border-indigo-200 text-indigo-700',
}

function ProfileBanner({ formData, isDefault }) {
  return (
    <div className={`rounded-2xl border p-4 flex gap-3 items-start ${
      isDefault
        ? 'bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200'
        : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
    }`}>
      <span className="text-2xl flex-shrink-0">{isDefault ? '🌿' : '✅'}</span>
      <div className="min-w-0">
        <p className={`text-sm font-semibold ${isDefault ? 'text-pink-800' : 'text-green-800'}`}>
          {isDefault
            ? 'Используется профиль «Family Constellation 40+»'
            : 'Кнопка «Адаптировать» использует твой профиль'}
        </p>
        <p className="text-xs text-gray-500 mt-0.5 truncate">
          Ниша: {formData.niche?.slice(0, 60) || '—'}{formData.niche?.length > 60 ? '…' : ''}
        </p>
        {!isDefault && (
          <p className="text-xs text-gray-400 mt-0.5">
            Чтобы изменить — отредактируй форму на вкладке «Генератор»
          </p>
        )}
      </div>
    </div>
  )
}

export default function TemplatesPage({ formData }) {
  const [activeCategory, setActiveCategory] = useState('hooks')
  const [searchQuery, setSearchQuery] = useState('')

  const templates = getTemplatesByCategory(activeCategory)

  const filtered = searchQuery.trim()
    ? templates.filter(t => {
        const q = searchQuery.toLowerCase()
        return (
          t.title?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.preview?.toLowerCase().includes(q) ||
          t.tags?.some(tag => tag.toLowerCase().includes(q))
        )
      })
    : templates

  const isDefaultProfile = formData.niche?.includes('расстановк') || formData.niche?.includes('Хеллингер') || formData.niche?.includes('constellation')

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
          Библиотека шаблонов
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Готовые структуры для любого типа контента — нажми «Адаптировать» и получи текст под свою нишу
        </p>
      </div>

      {/* Profile banner */}
      <ProfileBanner formData={formData} isDefault={isDefaultProfile} />

      {/* Category tabs */}
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
        <div className="flex gap-2 min-w-max">
          {CATEGORIES.map(cat => {
            const active = activeCategory === cat.id
            const gradient = CATEGORY_GRADIENTS[cat.id]
            return (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setSearchQuery('') }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  active
                    ? `bg-gradient-to-r ${gradient} text-white shadow-sm`
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Category description */}
      {CATEGORIES.find(c => c.id === activeCategory) && (
        <div className={`rounded-xl border px-4 py-3 text-sm ${CATEGORY_BG[activeCategory]}`}>
          <span className="font-semibold">
            {CATEGORIES.find(c => c.id === activeCategory)?.emoji}{' '}
            {CATEGORIES.find(c => c.id === activeCategory)?.label}:
          </span>{' '}
          {CATEGORIES.find(c => c.id === activeCategory)?.description}
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
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={`Поиск по шаблонам «${CATEGORIES.find(c => c.id === activeCategory)?.label}»…`}
          className="w-full text-sm rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Results count */}
      {searchQuery && (
        <p className="text-sm text-gray-500">
          Найдено: <span className="font-semibold text-gray-800">{filtered.length}</span>{' '}
          {filtered.length === 1 ? 'шаблон' : filtered.length < 5 ? 'шаблона' : 'шаблонов'}
        </p>
      )}

      {/* Template cards */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((tpl, idx) => (
            <TemplateCard
              key={tpl.id}
              template={tpl}
              category={activeCategory}
              formData={formData}
              index={idx}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-600 font-medium">Ничего не найдено</p>
          <p className="text-gray-400 text-sm mt-1">Попробуй другое слово</p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-3 text-sm text-pink-600 hover:text-pink-700 font-medium"
          >
            Сбросить поиск
          </button>
        </div>
      )}

      {/* Bottom hint */}
      <div className="rounded-2xl bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-700 p-5 text-white">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🪄</span>
          <div>
            <p className="font-bold text-base">Как использовать шаблоны</p>
            <ul className="mt-2 space-y-1 text-white/80 text-sm">
              <li>1. Нажми «Адаптировать под нишу» — плейсхолдеры заполнятся твоими данными</li>
              <li>2. Скопируй готовый текст кнопкой 📋</li>
              <li>3. Вставь в сценарий, телефон или Telegram</li>
              <li>4. Хочешь изменить нишу — обнови профиль на вкладке «Генератор»</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
