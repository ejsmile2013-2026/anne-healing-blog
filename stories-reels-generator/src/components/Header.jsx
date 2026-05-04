export default function Header() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-pink-600 via-fuchsia-600 to-purple-700 text-white">
      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-pink-400/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-40 bg-fuchsia-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 py-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-sm font-medium px-4 py-1.5 rounded-full mb-5">
          <span className="animate-pulse-slow">✨</span>
          <span>Family Constellation · 40+</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-3 tracking-tight">
          Генератор сторис и рилсов
        </h1>

        {/* Subtitle */}
        <p className="text-white/80 text-base sm:text-lg font-medium mb-1">
          Идеи, сценарии и тексты за 30 секунд
        </p>
        <p className="text-white/60 text-sm">
          Контент о семейных расстановках — глубоко, тепло и по делу
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-7">
          {[
            { icon: '🎬', text: '5 идей за раз' },
            { icon: '📋', text: 'Готовые сценарии' },
            { icon: '🌿', text: 'Ниша расстановок' },
            { icon: '🔁', text: 'Серии контента' },
          ].map(item => (
            <div
              key={item.text}
              className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1.5 rounded-full text-sm"
            >
              <span>{item.icon}</span>
              <span className="text-white/90">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}
