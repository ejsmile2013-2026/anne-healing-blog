import { saveCalendar } from './calendarStorage'

const POOLS = {
  reels: [
    { title: 'Почему вы живёте по маминому сценарию', description: 'Три признака материнской программы' },
    { title: 'Тревога — это не ваша тревога', description: 'Как распознать системную тревогу предков' },
    { title: 'Деньги и семейная система', description: 'Где искать корень финансового паттерна' },
    { title: 'Что тело рассказывает о вашей системе', description: 'Связь симптомов с семейной динамикой' },
    { title: 'Почему вы выбираете одного и того же', description: 'Системные корни партнёрских паттернов' },
    { title: 'После 40: время наконец жить своей жизнью', description: 'Системный взгляд на кризис среднего возраста' },
    { title: 'Как отношения с отцом формируют судьбу', description: 'Отцовская линия в жизни женщины' },
    { title: 'Системные корни сложности с отказом', description: 'Почему «нет» так трудно дается' },
    { title: 'Каждый имеет право на своё место', description: 'Первый закон системы — принадлежность' },
    { title: 'Хроническая усталость: что если это не ваше', description: 'Непрожитая энергия рода в теле' },
  ],
  stories: [
    { title: 'Вопрос-опрос: узнаёшь этот паттерн?', description: 'Вовлечение через вопрос подписчикам' },
    { title: 'Закулисье: как проходит расстановка', description: 'Тизер перед публикацией рилса' },
    { title: 'История трансформации клиента', description: '5 слайдов: было → точка перелома → стало' },
    { title: 'Мой рабочий день расстановщика', description: 'Закулисье работы' },
    { title: 'Ответы на вопросы подписчиков', description: 'Диалог с аудиторией' },
    { title: 'Тизер нового рилса', description: 'Интрига → намёк → ссылка на пост' },
  ],
  carousel: [
    { title: '5 признаков системной тревоги', description: 'Формат-диагностика с высоким % сохранений' },
    { title: 'Три закона семейной системы', description: 'Принадлежность, порядок, баланс' },
    { title: 'Мифы о расстановках vs правда', description: '«Это мистика» и другие заблуждения' },
    { title: 'Что несёт каждый ребёнок в семье', description: 'Список для сохранения' },
    { title: 'Пошаговый гид: как подготовиться к сессии', description: 'Инструкция для новичков' },
    { title: 'Работает / Не работает при работе с системой', description: 'Сравнительный формат' },
  ],
  talking_head: [
    { title: 'Семейная расстановка: что это и кому нужно', description: 'Объяснение метода за 60 секунд' },
    { title: 'Исцеление начинается с принятия', description: 'Ключевой принцип расстановочной работы' },
    { title: 'Сила и боль женской линии рода', description: 'Ресурсы и травмы по материнской линии' },
    { title: 'Когда дети несут то, что не завершили родители', description: 'Системная динамика в семье' },
    { title: 'Страшно идти на расстановку? Честный ответ', description: 'Разбор главного страха' },
    { title: 'Принятие vs прощение: в чём разница', description: 'Важный принцип в простых словах' },
  ],
}

// Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6
const SCHEDULE = [
  { dow: 0, type: 'reels' },
  { dow: 1, type: 'stories' },
  { dow: 2, type: 'carousel' },
  { dow: 3, type: 'reels' },
  { dow: 4, type: 'talking_head' },
  { dow: 5, type: 'stories', optional: true },
]

function dow(dateStr) {
  return (new Date(dateStr + 'T00:00:00').getDay() + 6) % 7
}

function pickItem(type, used) {
  const pool = POOLS[type] || POOLS.reels
  const free = pool.map((_, i) => i).filter(i => !(used[type] || []).includes(i))
  const indices = free.length > 0 ? free : pool.map((_, i) => i)
  const idx = indices[Math.floor(Math.random() * indices.length)]
  used[type] = [...(used[type] || []).filter(i => free.length > 0 ? true : false), idx]
  if (free.length === 0) used[type] = [idx]
  return pool[idx]
}

export function autoFillMonth(currentCal, year, month) {
  const days = new Date(year, month + 1, 0).getDate()
  const result = { ...currentCal }
  const used = {}

  for (let d = 1; d <= days; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    if (result[dateStr]?.length > 0) continue

    const slot = SCHEDULE.find(s => s.dow === dow(dateStr))
    if (!slot) continue
    if (slot.optional && Math.random() > 0.4) continue

    const item = pickItem(slot.type, used)
    result[dateStr] = [{
      id: `auto-${dateStr}-${Date.now()}`,
      date: dateStr,
      type: slot.type,
      title: item.title,
      description: item.description,
      published: false,
      auto: true,
    }]
  }

  saveCalendar(result)
  return result
}
