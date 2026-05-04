import { useState } from 'react'
import { adaptText, adaptTemplate } from '../utils/adapter'

const CATEGORY_STYLES = {
  hooks:     { badge: 'bg-amber-100 text-amber-700',   border: 'border-amber-200',   accent: 'from-amber-400 to-orange-400',   icon: '🎣' },
  reels:     { badge: 'bg-pink-100 text-pink-700',     border: 'border-pink-200',    accent: 'from-pink-500 to-rose-500',      icon: '🎬' },
  stories:   { badge: 'bg-purple-100 text-purple-700', border: 'border-purple-200',  accent: 'from-purple-500 to-violet-500',  icon: '📱' },
  carousels: { badge: 'bg-indigo-100 text-indigo-700', border: 'border-indigo-200',  accent: 'from-indigo-500 to-blue-500',    icon: '🎠' },
}

function SegmentBlock({ segment, adapted }) {
  const TYPE_COLORS = {
    hook: 'border-l-pink-400 bg-pink-50',
    main: 'border-l-purple-400 bg-purple-50',
    result: 'border-l-green-400 bg-green-50',
    lesson: 'border-l-amber-400 bg-amber-50',
    cta: 'border-l-indigo-400 bg-indigo-50',
    tip1: 'border-l-rose-400 bg-rose-50',
    tip2: 'border-l-fuchsia-400 bg-fuchsia-50',
    tip3: 'border-l-violet-400 bg-violet-50',
    why: 'border-l-teal-400 bg-teal-50',
    default: 'border-l-gray-300 bg-gray-50',
  }
  const colorClass = TYPE_COLORS[segment.type] || TYPE_COLORS.default
  const text = adapted ? adaptText(segment.text, adapted) : segment.text

  return (
    <div className={`border-l-4 rounded-r-lg px-3 py-2 ${colorClass}`}>
      <div className="flex items-center gap-2 mb-1">
        {segment.time && (
          <span className="text-xs font-mono text-gray-400 bg-white/70 px-1.5 py-0.5 rounded">
            {segment.time}
          </span>
        )}
        {segment.number !== undefined && (
          <span className="text-xs font-mono text-gray-400 bg-white/70 px-1.5 py-0.5 rounded">
            #{segment.number}
          </span>
        )}
        <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">
          {segment.label}
        </span>
      </div>
      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{text}</p>
    </div>
  )
}

export default function TemplateCard({ template, category, formData, index }) {
  const [expanded, setExpanded] = useState(false)
  const [adapted, setAdapted] = useState(false)
  const [copied, setCopied] = useState(false)

  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.hooks

  // For hooks: simple text template
  // For reels/stories/carousels: structured with segments/slides
  const isSimple = category === 'hooks'

  const displayTemplate = adapted ? adaptText(template.template || template.preview, formData) : (template.template || template.preview)
  const displayPreview = adapted ? adaptText(template.preview, formData) : template.preview

  function buildCopyText() {
    if (isSimple) {
      return [
        `🎣 ${template.title}`,
        ``,
        adapted ? adaptText(template.template, formData) : template.template,
        ``,
        template.note ? `💡 ${template.note}` : '',
      ].filter(Boolean).join('\n')
    }

    const segments = template.segments || template.slides || []
    const lines = [
      `${style.icon} ${template.title}`,
      template.duration ? `⏱ ${template.duration}` : '',
      ``,
      template.description,
      ``,
    ]

    for (const seg of segments) {
      const time = seg.time ? `[${seg.time}] ` : (seg.number ? `[#${seg.number}] ` : '')
      const text = adapted ? adaptText(seg.text, formData) : seg.text
      lines.push(`${time}${seg.label}:`)
      lines.push(text)
      lines.push('')
    }

    if (template.tips?.length) {
      lines.push('💡 Советы:')
      template.tips.forEach(t => lines.push(`• ${t}`))
    }

    return lines.filter(l => l !== undefined).join('\n')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(buildCopyText()).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleAdapt = () => {
    setAdapted(true)
    setExpanded(true)
  }

  const segments = template.segments || template.slides || []

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden animate-slide-up"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
    >
      <div className={`h-1 w-full bg-gradient-to-r ${style.accent}`} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br ${style.accent} flex items-center justify-center text-white text-xs font-bold`}>
              {index + 1}
            </span>
            <h3 className="text-sm font-semibold text-gray-900 leading-tight">{template.title}</h3>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {template.duration && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                ⏱ {template.duration}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {template.description && (
          <p className="text-xs text-gray-500 mb-2 leading-relaxed">{template.description}</p>
        )}

        {/* Preview / Template text */}
        <div className={`rounded-xl border px-3 py-2.5 mb-3 ${style.border} bg-gradient-to-r from-white to-gray-50`}>
          <p className="text-sm text-gray-700 leading-relaxed font-medium italic">
            &laquo;{displayPreview}&raquo;
          </p>
        </div>

        {/* Tags */}
        {template.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {template.tags.map(tag => (
              <span key={tag} className={`text-xs px-2 py-0.5 rounded-full ${style.badge}`}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Note (hooks only) */}
        {template.note && !expanded && (
          <p className="text-xs text-gray-400 italic mb-3">💡 {template.note}</p>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          {/* Adapt button — primary */}
          <button
            onClick={adapted ? () => setAdapted(false) : handleAdapt}
            className={`flex-1 text-sm font-semibold py-2 px-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
              adapted
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : `bg-gradient-to-r ${style.accent} text-white hover:opacity-90 shadow-sm`
            }`}
          >
            <span>{adapted ? '✓' : '🪄'}</span>
            <span className="hidden sm:inline">{adapted ? 'Адаптировано' : 'Адаптировать под нишу'}</span>
            <span className="sm:hidden">{adapted ? 'Адаптировано' : 'Адаптировать'}</span>
          </button>

          {/* Expand (for structured templates) */}
          {!isSimple && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm font-medium py-2 px-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
            >
              {expanded ? '▲' : '▼'}
            </button>
          )}

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="text-sm font-medium py-2 px-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-1"
          >
            {copied ? '✅' : '📋'}
          </button>
        </div>

        {/* Expanded content */}
        {(expanded || adapted) && (
          <div className="mt-3 space-y-2 animate-fade-in">
            {/* Hooks: show full adapted text */}
            {isSimple && (
              <div className={`rounded-xl border-2 ${style.border} p-3 bg-gradient-to-br from-white to-gray-50`}>
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                  {displayTemplate}
                </p>
                {template.note && (
                  <p className="text-xs text-gray-400 italic mt-2">💡 {template.note}</p>
                )}
              </div>
            )}

            {/* Structured: show segments/slides */}
            {!isSimple && segments.length > 0 && (
              <div className="space-y-2">
                {segments.map((seg, i) => (
                  <SegmentBlock
                    key={i}
                    segment={seg}
                    adapted={adapted ? formData : null}
                  />
                ))}
              </div>
            )}

            {/* Tips */}
            {!isSimple && template.tips?.length > 0 && (
              <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
                <p className="text-xs font-bold text-amber-700 mb-1.5">💡 Советы по формату</p>
                <ul className="space-y-1">
                  {template.tips.map((tip, i) => (
                    <li key={i} className="text-xs text-amber-800 flex gap-2">
                      <span>•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Copy full */}
            <button
              onClick={handleCopy}
              className="w-full text-sm font-medium py-2 px-4 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              {copied ? <><span>✅</span><span>Скопировано!</span></> : <><span>📋</span><span>Скопировать {adapted ? 'адаптированный' : ''} шаблон</span></>}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
