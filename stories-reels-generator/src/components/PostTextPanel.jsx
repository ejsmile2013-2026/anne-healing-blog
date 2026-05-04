import { useState, useCallback } from 'react'
import { generatePostText } from '../utils/postGenerator'
import { saveToHistory } from '../utils/history'

// ─── Tone labels ──────────────────────────────────────────────────────────────

const TONE_LABELS = {
  friendly:     '🤗 Дружеский',
  expert:       '🧠 Экспертный',
  provocative:  '⚡ Провокационный',
  inspirational:'✨ Вдохновляющий',
  humorous:     '😄 Юмористический',
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function CopyBtn({ text, small = false }) {
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
      className={`flex-shrink-0 flex items-center gap-1 rounded-lg border font-medium transition-all duration-150 ${
        small ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5'
      } ${copied
        ? 'border-green-300 text-green-600 bg-green-50'
        : 'border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'
      }`}
    >
      <span>{copied ? '✅' : '📋'}</span>
      {!small && <span>{copied ? 'Скопировано' : 'Копировать'}</span>}
    </button>
  )
}

function CharCounter({ text }) {
  const len = text.length
  const color = len > 2000 ? 'text-red-500' : len > 1500 ? 'text-amber-500' : 'text-gray-400'
  return (
    <span className={`text-xs font-medium tabular-nums ${color}`}>
      {len} / 2200
    </span>
  )
}

function Section({ emoji, title, accentClass, action, children }) {
  return (
    <div className={`rounded-xl border overflow-hidden ${accentClass}`}>
      <div className={`flex items-center justify-between gap-2 px-3 py-2 border-b ${accentClass}`}>
        <div className="flex items-center gap-1.5">
          <span>{emoji}</span>
          <span className="text-xs font-bold uppercase tracking-wide opacity-75">{title}</span>
        </div>
        {action}
      </div>
      <div className="bg-white p-3">{children}</div>
    </div>
  )
}

function LineItem({ text }) {
  return (
    <div className="flex items-start gap-2">
      <p className="flex-1 text-sm text-gray-800 leading-relaxed">{text}</p>
      <CopyBtn text={text} small />
    </div>
  )
}

function NumberedList({ items }) {
  return (
    <div className="space-y-2.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 mt-0.5">
            {i + 1}
          </span>
          <p className="flex-1 text-sm text-gray-800 leading-relaxed">{item}</p>
          <CopyBtn text={item} small />
        </div>
      ))}
    </div>
  )
}

// ─── PostTextPanel ────────────────────────────────────────────────────────────

export default function PostTextPanel({ idea, formData, onClose }) {
  const generate = useCallback(
    () => generatePostText(idea, formData),
    [idea, formData]
  )

  const [data, setData]         = useState(() => {
    const generated = generate()
    // Save first generation to history
    saveToHistory({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      idea: {
        title:       idea.title,
        type:        idea.type,
        typeKey:     idea.typeKey,
        description: idea.description,
      },
      formData: {
        niche:    formData?.niche    || '',
        audience: formData?.audience || '',
        tone:     formData?.tone     || 'friendly',
        theme:    formData?.theme    || '',
      },
      generated,
    })
    return generated
  })

  const [isRegenerating, setIsRegenerating] = useState(false)
  const [copiedAll, setCopiedAll]           = useState(false)

  function handleRegenerate() {
    setIsRegenerating(true)
    // Small delay for visual feedback
    setTimeout(() => {
      setData(generate())
      setIsRegenerating(false)
    }, 350)
  }

  function handleCopyAll() {
    const text = [
      `📌 ПОДПИСЬ К ПОСТУ`,
      data.caption,
      ``,
      `🎣 ВАРИАНТЫ ПЕРВОЙ СТРОКИ`,
      data.firstLines.map((l, i) => `${i + 1}. ${l}`).join('\n'),
      ``,
      `📣 CTA (ПРИЗЫВ К ДЕЙСТВИЮ)`,
      data.ctas.map((c, i) => `${i + 1}. ${c}`).join('\n'),
      ``,
      `#️⃣ ХЕШТЕГИ`,
      data.hashtags.join(' '),
      ``,
      `📱 ТЕКСТ ДЛЯ СТОРИС-АНОНСА`,
      data.storiesAnnounce,
    ].join('\n')

    navigator.clipboard.writeText(text).then(() => {
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 2500)
    })
  }

  const tone = formData?.tone || 'friendly'

  return (
    <div className="mt-3 space-y-3 animate-fade-in">

      {/* ── Panel header ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-base">📝</span>
          <span className="text-sm font-bold text-gray-900">Тексты для поста</span>
          <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full font-medium">
            {TONE_LABELS[tone] || tone}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            title="Сгенерировать новые варианты"
            className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition-all ${
              isRegenerating
                ? 'border-purple-200 text-purple-400 bg-purple-50 cursor-wait'
                : 'border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            {isRegenerating ? '⏳' : '🔄'} Ещё вариант
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none transition-colors"
            title="Закрыть"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── Caption ────────────────────────────────────────────────────────── */}
      <Section
        emoji="📌"
        title="Подпись к посту"
        accentClass="border-pink-200 bg-pink-50"
        action={
          <div className="flex items-center gap-2">
            <CharCounter text={data.caption} />
            <CopyBtn text={data.caption} small />
          </div>
        }
      >
        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{data.caption}</p>
        <p className="text-xs text-gray-400 mt-2">
          ~{data.caption.split(/\s+/).filter(Boolean).length} слов
        </p>
      </Section>

      {/* ── First lines ────────────────────────────────────────────────────── */}
      <Section
        emoji="🎣"
        title="3 варианта первой строки"
        accentClass="border-amber-200 bg-amber-50"
      >
        <NumberedList items={data.firstLines} />
      </Section>

      {/* ── CTAs ───────────────────────────────────────────────────────────── */}
      <Section
        emoji="📣"
        title="Призыв к действию (CTA)"
        accentClass="border-purple-200 bg-purple-50"
      >
        <NumberedList items={data.ctas} />
      </Section>

      {/* ── Hashtags ───────────────────────────────────────────────────────── */}
      <Section
        emoji="#️⃣"
        title={`Хештеги (${data.hashtags.length})`}
        accentClass="border-indigo-200 bg-indigo-50"
        action={<CopyBtn text={data.hashtags.join(' ')} small />}
      >
        <div className="flex flex-wrap gap-1.5">
          {data.hashtags.map(tag => (
            <span
              key={tag}
              className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium cursor-pointer hover:bg-indigo-200 transition-colors"
              onClick={() => navigator.clipboard.writeText(tag)}
              title="Копировать хештег"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">Нажми на хештег — скопирует один</p>
      </Section>

      {/* ── Stories announce ───────────────────────────────────────────────── */}
      <Section
        emoji="📱"
        title="Текст для сторис-анонса"
        accentClass="border-fuchsia-200 bg-fuchsia-50"
        action={<CopyBtn text={data.storiesAnnounce} small />}
      >
        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{data.storiesAnnounce}</p>
      </Section>

      {/* ── Copy all ───────────────────────────────────────────────────────── */}
      <button
        onClick={handleCopyAll}
        className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
          copiedAll
            ? 'bg-green-500 text-white'
            : 'bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 text-white hover:opacity-90 shadow-md shadow-pink-200'
        }`}
      >
        <span>{copiedAll ? '✅' : '📋'}</span>
        <span>{copiedAll ? 'Всё скопировано!' : 'Копировать всё — подпись + хештеги + CTA'}</span>
      </button>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <p className="text-center text-xs text-gray-400">
        ✓ Автоматически сохранено в{' '}
        <span className="text-pink-500 font-medium">Историю</span>
      </p>
    </div>
  )
}
