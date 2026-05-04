export default function Navigation({ currentPage, onNavigate }) {
  const tabs = [
    { id: 'home', label: 'Генератор', emoji: '✨' },
    { id: 'templates', label: 'Шаблоны', emoji: '📚' },
    { id: 'calendar', label: 'Календарь', emoji: '📅' },
    { id: 'history', label: 'История', emoji: '🕐' },
  ]

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-1 py-2">
          {tabs.map(tab => {
            const active = currentPage === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm shadow-pink-200'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            )
          })}

          {/* Brand label */}
          <div className="ml-auto flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <span>🌿</span>
            <span className="hidden sm:inline">Family Constellation</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
