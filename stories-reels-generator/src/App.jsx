import { useState, useRef } from 'react'
import Header from './components/Header'
import Navigation from './components/Navigation'
import GeneratorForm from './components/GeneratorForm'
import IdeaCard from './components/IdeaCard'
import TemplatesPage from './pages/TemplatesPage'
import HistoryPage from './pages/HistoryPage'
import CalendarPage from './pages/CalendarPage'
import { generateIdeas, DEFAULT_FORM } from './utils/generator'

function TipBanner() {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4">
      <div className="flex gap-3">
        <span className="text-xl flex-shrink-0">💡</span>
        <div className="text-sm text-amber-800">
          <span className="font-semibold">Совет по логике «Бабушки»:</span>{' '}
          Один рилс = один чёткий смысл. Не переключай тему внутри видео.
          Каждая идея легко превращается в серию из 3–7 частей.
        </div>
      </div>
    </div>
  )
}

function ResultsHeader({ count, onReset }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          <span className="gradient-text">Готово!</span> {count} идей сгенерировано
        </h2>
        <p className="text-sm text-gray-400 mt-0.5">
          Нажми «Раскрыть сценарий» на любой карточке
        </p>
      </div>
      <button
        onClick={onReset}
        className="text-sm font-medium text-pink-600 hover:text-pink-700 flex items-center gap-1.5 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Ещё раз
      </button>
    </div>
  )
}

function HomePage({ formData, onChange, ideas, isLoading, hasGenerated, onSubmit, onReset, resultsRef, onNavigate }) {
  return (
    <>
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">

        {/* Form card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-sm">
                🪄
              </span>
              Настройки генерации
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 ml-9">
              Предзаполнено для ниши расстановок — просто нажмите «Сгенерировать»
            </p>
          </div>
          <div className="p-6">
            <GeneratorForm
              formData={formData}
              onChange={onChange}
              onSubmit={onSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-12 animate-fade-in">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 animate-spin-slow" />
                <div className="absolute inset-1 rounded-full bg-white flex items-center justify-center text-2xl">
                  🌿
                </div>
              </div>
              <div>
                <p className="text-gray-800 font-semibold">Система раскрывается…</p>
                <p className="text-gray-400 text-sm mt-1">Создаём сценарии о расстановках с глубиной</p>
              </div>
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-pink-400 animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {hasGenerated && ideas.length > 0 && !isLoading && (
          <div ref={resultsRef} className="animate-fade-in space-y-5">
            <ResultsHeader count={ideas.length} onReset={onReset} />

            <TipBanner />

            <div className="space-y-4">
              {ideas.map((idea, idx) => (
                <IdeaCard key={idea.id} idea={idea} index={idx} formData={formData} />
              ))}
            </div>

            {/* Footer CTA block */}
            <div className="rounded-2xl bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-700 p-5 text-white text-center mt-6">
              <p className="text-lg font-bold mb-1">Хочешь ещё 5 свежих идей?</p>
              <p className="text-white/70 text-sm mb-4">
                Измени тему или ключевое слово — и нажми снова
              </p>
              <div className="flex gap-2 justify-center flex-wrap">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="bg-white text-purple-700 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-pink-50 transition-colors"
                >
                  ↑ Изменить тему
                </button>
                <button
                  onClick={() => onNavigate('history')}
                  className="bg-white/20 border border-white/30 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-white/30 transition-colors"
                >
                  🕐 История
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty state hint */}
        {!hasGenerated && !isLoading && (
          <div className="text-center py-6">
            <div className="inline-block bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 max-w-sm">
              <div className="text-4xl mb-3">🌿</div>
              <p className="text-gray-600 text-sm font-medium">
                Заполни форму выше и нажми «Сгенерировать» —
              </p>
              <p className="text-gray-400 text-sm mt-1">
                получишь 5 готовых сценариев о расстановках за 30 секунд
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center text-xs text-gray-400 pb-8 pt-4">
        Family Constellation · Генератор контента 40+ · {new Date().getFullYear()}
      </footer>
    </>
  )
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [formData, setFormData] = useState(DEFAULT_FORM)
  const [ideas, setIdeas] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)
  const resultsRef = useRef(null)

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setIdeas([])

    setTimeout(() => {
      const generated = generateIdeas(formData)
      setIdeas(generated)
      setIsLoading(false)
      setHasGenerated(true)

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }, 900)
  }

  const handleReset = () => {
    setIdeas([])
    setHasGenerated(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavigate = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header — only on home */}
      {currentPage === 'home' && <Header />}

      {/* Global nav */}
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Page content */}
      {currentPage === 'home' ? (
        <HomePage
          formData={formData}
          onChange={handleChange}
          ideas={ideas}
          isLoading={isLoading}
          hasGenerated={hasGenerated}
          onSubmit={handleSubmit}
          onReset={handleReset}
          resultsRef={resultsRef}
          onNavigate={handleNavigate}
        />
      ) : currentPage === 'templates' ? (
        <TemplatesPage formData={formData} />
      ) : currentPage === 'calendar' ? (
        <CalendarPage />
      ) : (
        <HistoryPage />
      )}
    </div>
  )
}
