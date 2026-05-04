import { useState } from 'react'
import PostTextPanel from './PostTextPanel'

const TYPE_COLORS = {
  reels: 'from-pink-500 to-rose-500',
  stories: 'from-purple-500 to-violet-500',
  carousel: 'from-indigo-500 to-blue-500',
  talking_head: 'from-fuchsia-500 to-pink-500',
}

const TYPE_BG = {
  reels: 'bg-pink-50 border-pink-200',
  stories: 'bg-purple-50 border-purple-200',
  carousel: 'bg-indigo-50 border-indigo-200',
  talking_head: 'bg-fuchsia-50 border-fuchsia-200',
}

const TYPE_BADGE = {
  reels: 'bg-pink-100 text-pink-700',
  stories: 'bg-purple-100 text-purple-700',
  carousel: 'bg-indigo-100 text-indigo-700',
  talking_head: 'bg-fuchsia-100 text-fuchsia-700',
}

export default function IdeaCard({ idea, index, formData }) {
  const [expanded, setExpanded] = useState(false)
  const [showPostText, setShowPostText] = useState(false)
  const [copied, setCopied] = useState(false)

  const gradientClass = TYPE_COLORS[idea.typeKey] || 'from-pink-500 to-purple-500'
  const bgClass = TYPE_BG[idea.typeKey] || 'bg-pink-50 border-pink-200'
  const badgeClass = TYPE_BADGE[idea.typeKey] || 'bg-pink-100 text-pink-700'

  const fullScenarioText = [
    `🎬 ${idea.title}`,
    `Тип: ${idea.type}`,
    ``,
    `🎣 ХУК (1–2 сек):`,
    idea.scenario.hook,
    ``,
    `📖 ОСНОВНАЯ ЧАСТЬ:`,
    idea.scenario.main,
    ``,
    `📣 ПРИЗЫВ К ДЕЙСТВИЮ:`,
    idea.scenario.cta,
    ``,
    `⏱ Хронометраж: ${idea.duration}`,
    `💡 ${idea.seriesHint}`,
  ].join('\n')

  const handleCopy = () => {
    navigator.clipboard.writeText(fullScenarioText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div
      className="rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden animate-slide-up"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
    >
      {/* Top gradient stripe */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${gradientClass}`} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              {index + 1}
            </span>
            <h3 className="text-base font-semibold text-gray-900 leading-tight">{idea.title}</h3>
          </div>
          <span className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${badgeClass}`}>
            {idea.type}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-3 leading-relaxed">{idea.description}</p>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            ⏱ {idea.duration}
          </span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full truncate max-w-[260px]">
            💡 {idea.seriesHint}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => { setExpanded(!expanded); if (showPostText) setShowPostText(false) }}
            className={`flex-1 text-sm font-medium py-2.5 px-3 rounded-xl transition-all duration-200 ${
              expanded
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : `bg-gradient-to-r ${gradientClass} text-white hover:opacity-90 shadow-sm`
            }`}
          >
            {expanded ? '▲ Сценарий' : '▼ Сценарий'}
          </button>

          {/* Write post text button */}
          <button
            onClick={() => { setShowPostText(!showPostText); if (expanded) setExpanded(false) }}
            className={`flex-1 text-sm font-medium py-2.5 px-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
              showPostText
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-white border-2 border-pink-400 text-pink-600 hover:bg-pink-50'
            }`}
          >
            <span>📝</span>
            <span>{showPostText ? 'Скрыть тексты' : 'Написать текст'}</span>
          </button>
        </div>

        {/* Expanded scenario */}
        {expanded && (
          <div className={`mt-4 rounded-xl border p-4 space-y-4 ${bgClass} animate-fade-in`}>

            {/* Hook */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">🎣</span>
                <span className="text-xs font-bold uppercase tracking-wide text-pink-600">
                  Хук (1–2 сек)
                </span>
              </div>
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line bg-white rounded-lg p-3 border border-pink-100">
                {idea.scenario.hook}
              </p>
            </div>

            {/* Main */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">📖</span>
                <span className="text-xs font-bold uppercase tracking-wide text-purple-600">
                  Основная часть
                </span>
              </div>
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line bg-white rounded-lg p-3 border border-purple-100">
                {idea.scenario.main}
              </p>
            </div>

            {/* CTA */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">📣</span>
                <span className="text-xs font-bold uppercase tracking-wide text-indigo-600">
                  Призыв к действию
                </span>
              </div>
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line bg-white rounded-lg p-3 border border-indigo-100">
                {idea.scenario.cta}
              </p>
            </div>

            {/* Copy scenario button */}
            <button
              onClick={handleCopy}
              className="w-full text-sm font-medium py-2.5 px-4 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {copied
                ? <><span>✅</span><span>Скопировано!</span></>
                : <><span>📋</span><span>Скопировать сценарий</span></>
              }
            </button>
          </div>
        )}

        {/* Post text panel */}
        {showPostText && (
          <PostTextPanel
            idea={idea}
            formData={formData}
            onClose={() => setShowPostText(false)}
          />
        )}
      </div>
    </div>
  )
}
