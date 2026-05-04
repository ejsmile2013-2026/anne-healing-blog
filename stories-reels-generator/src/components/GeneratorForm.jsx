const TONES = [
  { value: 'friendly', label: '🤗 Дружеский' },
  { value: 'expert', label: '🧠 Экспертный' },
  { value: 'provocative', label: '⚡ Провокационный' },
  { value: 'inspirational', label: '✨ Вдохновляющий' },
  { value: 'humorous', label: '😄 Юмористический' },
]

const CONTENT_TYPES = [
  { value: 'reels', label: '🎬 Рилс', desc: 'Для роста' },
  { value: 'carousel', label: '🎠 Карусель', desc: 'Для сохранений' },
  { value: 'stories', label: '📱 Сторис', desc: 'Продолжение рилса' },
  { value: 'talking_head', label: '🗣️ Говорящая голова', desc: 'Для доверия' },
]

export default function GeneratorForm({ formData, onChange, onSubmit, isLoading }) {
  const handleCheckbox = (val) => {
    const current = formData.contentTypes
    const updated = current.includes(val)
      ? current.filter(v => v !== val)
      : [...current, val]
    if (updated.length > 0) onChange('contentTypes', updated)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">

      {/* Ниша */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Ниша <span className="text-pink-500">*</span>
        </label>
        <textarea
          value={formData.niche}
          onChange={e => onChange('niche', e.target.value)}
          rows={3}
          required
          placeholder="Например: натуральные домашние рецепты, здоровье, кожа, сон…"
          className="w-full text-sm rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all resize-none"
        />
      </div>

      {/* Целевая аудитория */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Целевая аудитория
        </label>
        <input
          type="text"
          value={formData.audience}
          onChange={e => onChange('audience', e.target.value)}
          placeholder="Например: женщины 35–65+, уставшие от сложных схем…"
          className="w-full text-sm rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
        />
      </div>

      {/* Тема / ключевое слово */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Тема или ключевое слово
        </label>
        <input
          type="text"
          value={formData.theme}
          onChange={e => onChange('theme', e.target.value)}
          placeholder="Например: сон, пищеварение, кожа, энергия, суставы…"
          className="w-full text-sm rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
        />
      </div>

      {/* Тон */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Тон подачи</label>
        <select
          value={formData.tone}
          onChange={e => onChange('tone', e.target.value)}
          className="w-full text-sm rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all appearance-none cursor-pointer"
        >
          {TONES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Тип контента */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Тип контента
        </label>
        <div className="grid grid-cols-2 gap-2">
          {CONTENT_TYPES.map(ct => {
            const checked = formData.contentTypes.includes(ct.value)
            return (
              <button
                key={ct.value}
                type="button"
                onClick={() => handleCheckbox(ct.value)}
                className={`relative flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-xl border-2 text-left transition-all duration-200 ${
                  checked
                    ? 'border-pink-400 bg-pink-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-pink-200 hover:bg-pink-50/50'
                }`}
              >
                {checked && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
                <span className="text-sm font-medium text-gray-800">{ct.label}</span>
                <span className="text-xs text-gray-400">{ct.desc}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-6 rounded-2xl text-white font-bold text-base bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 hover:from-pink-600 hover:via-fuchsia-600 hover:to-purple-700 shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {isLoading ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Генерируем идеи…</span>
          </>
        ) : (
          <>
            <span>✨</span>
            <span>Сгенерировать идеи</span>
          </>
        )}
      </button>
    </form>
  )
}
