// ─── Persona-level caption builders ─────────────────────────────────────────
// Each tone has its own writing voice, not just different openers.

function buildCaption(idea, tone) {
  const title = idea.title
  const hook  = idea.scenario?.hook?.split('\n')[0] || title
  const main  = idea.scenario?.main || idea.description || ''

  // Extract 1–2 narrative sentences (non-bullet)
  const prose = main
    .split('\n')
    .filter(l => l.trim() && !l.startsWith('→') && !l.startsWith('•') && l.length > 25)
    .slice(0, 2)
    .join(' ')

  // Extract up to 3 bullets
  const bullets = main
    .split('\n')
    .filter(l => l.trim().startsWith('→') || l.trim().startsWith('•'))
    .slice(0, 3)
    .join('\n')

  switch (tone) {

    case 'expert': {
      const openers = [
        `В системной работе я снова и снова вижу одну закономерность: ${title.toLowerCase()} — это не просто личная история.`,
        `Метод Хеллингера показывает: ${hook.toLowerCase()}`,
        `Один из ключевых принципов расстановочной практики: ${title.toLowerCase()}.`,
        `Системный взгляд на ${title.toLowerCase()} меняет всё.`,
      ]
      const opener = openers[Math.floor(Math.random() * openers.length)]
      let caption = `${opener}\n\n${prose}`
      if (bullets) caption += `\n\n${bullets}`
      caption += `\n\nЭто не теория — это то, что видно в живой расстановочной работе. Подробнее — в Telegram, ссылка в профиле.`
      return caption
    }

    case 'provocative': {
      const openers = [
        `Скажу неудобную правду: ${hook.toLowerCase()}`,
        `Большинство ищет ответ не там. ${hook}`,
        `Пора говорить об этом прямо: ${title.toLowerCase()} — это не слабость и не судьба.`,
        `Вы тратите годы на работу с симптомами. А корень — здесь: ${title.toLowerCase()}.`,
      ]
      const opener = openers[Math.floor(Math.random() * openers.length)]
      let caption = `${opener}\n\n${prose}`
      if (bullets) caption += `\n\n${bullets}`
      caption += `\n\nСогласна? Или нет? Напиши в комментарии — разберём честно.`
      return caption
    }

    case 'inspirational': {
      const openers = [
        `Ты способна на большее, чем диктует твоя система. ${hook}`,
        `Каждый шаг к пониманию своей системы — это шаг к свободе.\n\n${hook}`,
        `Исцеление — это не забыть. Это увидеть и принять. ${title}.`,
        `За каждым повторяющимся паттерном стоит возможность изменения.`,
      ]
      const opener = openers[Math.floor(Math.random() * openers.length)]
      let caption = `${opener}\n\n${prose}`
      if (bullets) caption += `\n\n${bullets}`
      caption += `\n\nТы уже делаешь первый шаг — читая это. Сохрани, чтобы вернуться. 💫`
      return caption
    }

    case 'humorous': {
      const openers = [
        `Три поколения той же истории. Мы заметили. Наконец-то говорим об этом открыто.\n\n${hook}`,
        `Пока коучи продают марафоны, система молча делает своё дело.\n\nВот что происходит на самом деле:`,
        `Честно — я и сама удивляюсь, насколько система всё уже решила за нас.\n\n${hook}`,
        `Спойлер: это не про силу воли.\n\n${hook}`,
      ]
      const opener = openers[Math.floor(Math.random() * openers.length)]
      let caption = `${opener}\n\n${prose}`
      if (bullets) caption += `\n\n${bullets}`
      caption += `\n\nСохрани — вдруг пригодится объяснять коллегам, почему ты снова «в процессе работы с собой» 😄`
      return caption
    }

    // friendly (default)
    default: {
      const openers = [
        `Хочу поделиться тем, что открывается в расстановочной работе снова и снова.\n\n${hook}`,
        `Слушай, я давно хотела об этом рассказать — и вот наконец.\n\n${hook}`,
        `Это то, что хочется передать каждой, кто чувствует: что-то идёт не так.\n\n${hook}`,
        `${hook}\n\nДавай разберём это вместе — просто и без сложных терминов.`,
      ]
      const opener = openers[Math.floor(Math.random() * openers.length)]
      let caption = `${opener}\n\n${prose}`
      if (bullets) caption += `\n\n${bullets}`
      caption += `\n\nОткликнулось? Напиши в комментарии — что именно 💜`
      return caption
    }
  }
}

// ─── First-line hooks (3 variants, distinctly different styles) ───────────────

function buildFirstLines(idea, tone) {
  const title = idea.title
  const hook  = (idea.scenario?.hook?.split('\n')[0] || idea.description || '').replace(/…$/, '').trim()

  // Style A: direct question
  const questionVariants = {
    friendly:     `Ты когда-нибудь замечала, как ${title.toLowerCase()} — и не понимала почему?`,
    expert:       `Как системная динамика формирует ${title.toLowerCase()}?`,
    provocative:  `Почему ${title.toLowerCase()} — это не твоя вина, а паттерн системы?`,
    inspirational:`Что было бы, если бы ты уже сегодня разобралась с ${title.toLowerCase()}?`,
    humorous:     `Кто ещё узнаёт себя в ситуации «${title.toLowerCase()}»?`,
  }

  // Style B: statement / fact hook
  const factVariants = {
    friendly:     `${hook || title}.`,
    expert:       `Системная работа показывает: ${(hook || title).toLowerCase()}.`,
    provocative:  `${hook || title}. И вот почему это важно.`,
    inspirational:`«${hook || title}» — это начало изменений.`,
    humorous:     `Никто не предупреждал, что всё окажется так связано. ${hook ? 'А именно: ' + hook.toLowerCase() : ''}`,
  }

  // Style C: personal / story opening
  const storyVariants = {
    friendly:     `«Я не знала, что это связано с семьёй» — слышу это на каждой сессии.`,
    expert:       `В практике расстановок я наблюдаю эту закономерность регулярно.`,
    provocative:  `Этот пост некоторых обидит. Но правда важнее.`,
    inspirational:`Это одна из тех вещей, которые хочется знать как можно раньше.`,
    humorous:     `Начну с честного признания: система умнее нас обоих.`,
  }

  const t = tone || 'friendly'
  return [
    questionVariants[t] || questionVariants.friendly,
    factVariants[t]     || factVariants.friendly,
    storyVariants[t]    || storyVariants.friendly,
  ]
}

// ─── CTAs (3 variants per tone × action type) ─────────────────────────────────

function buildCTAs(tone) {
  const sets = {
    friendly: [
      'Сохрани пост — и поделись с той, кому это откликается прямо сейчас 💜',
      'Напиши в комментарии: «+» — и я пришлю подробнее об этой теме.',
      'Подпишись — каждую неделю простой и тёплый контент о системных паттернах.',
    ],
    expert: [
      'Сохрани — эта информация пригодится в работе. Подробнее о методе — в Telegram по ссылке в шапке.',
      'Напиши в комментарии свой запрос — разберём системный контекст вместе.',
      'Подпишись, если ценишь глубокий профессиональный контент о расстановках.',
    ],
    provocative: [
      'Согласна или нет? Напиши в комментарии — обсудим без прикрас.',
      'Сохрани, прочитай ещё раз — и напиши, что открылось.',
      'Поделись с той, кто до сих пор ищет проблему только в себе.',
    ],
    inspirational: [
      'Сохрани этот пост — это твой первый шаг к изменению. ✨',
      'Напиши в комментарии: что из этого ты уже чувствуешь в своей жизни?',
      'Подпишись — каждый пост здесь как шаг к свободе от системных паттернов.',
    ],
    humorous: [
      'Сохрани. Система никуда не денется — а пост можно забыть.',
      'Напиши «узнала себя» в комментарии — если хоть один пункт попал в точку 😄',
      'Подпишись — обещаю: без эзотерики, без осуждения, только живая системная работа.',
    ],
  }
  return sets[tone] || sets.friendly
}

// ─── Hashtag builder ──────────────────────────────────────────────────────────

const UNIVERSAL = [
  '#семейныерасстановки', '#расстановки', '#расстановкипохеллингеру',
  '#системныерасстановки', '#хеллингер', '#семейнаясистема',
  '#родоваятравма', '#исцелениероду', '#психология',
]

const AUDIENCE = [
  '#женщина40', '#после40', '#женскоездоровье',
  '#психологиядляженщин', '#личностныйрост', '#женщиназа40',
  '#самопознание', '#исцеление',
]

const TOPIC = {
  mother:        ['#мать', '#мама', '#материнскаялиния', '#отношениясмамой', '#материнскийпаттерн'],
  father:        ['#отец', '#папа', '#отцовскаялиния', '#отношениясотцом'],
  ancestry:      ['#предки', '#родовыепаттерны', '#трансгенерационный', '#наследиерода', '#родоваяпамять'],
  money:         ['#деньгиисистема', '#финансовыепаттерны', '#изобилие', '#достаток', '#денежноемышление'],
  body:          ['#психосоматика', '#телоипсихология', '#травмавтеле', '#телеснаямудрость'],
  relationships: ['#отношения', '#партнёрскиеотношения', '#паттерныотношений', '#любовьисистема'],
  anxiety:       ['#тревога', '#хроническаятревога', '#страх', '#тревожность', '#паника'],
  children:      ['#дети', '#детиисистема', '#родителиидети', '#детскаяпсихология'],
  belonging:     ['#принадлежность', '#местовсистеме', '#системнаядинамика', '#исключение'],
  general:       ['#исцеление', '#трансформация', '#психотерапия', '#коуч', '#самопомощь'],
}

const FORMAT = {
  reels:        ['#рилс', '#reels', '#видео'],
  stories:      ['#сторис', '#stories'],
  carousel:     ['#карусель', '#полезноечтиво'],
  talking_head: ['#говорящаяголова', '#экспертноемнение'],
}

function detectTopic(idea) {
  const t = (idea.title + ' ' + idea.description).toLowerCase()
  if (/мам|мат|материн/.test(t))           return 'mother'
  if (/отец|папа|отцов/.test(t))            return 'father'
  if (/предк|род|трансгенер|наследи/.test(t)) return 'ancestry'
  if (/деньг|финанс|достат|изобили/.test(t)) return 'money'
  if (/тело|психосомат|боль|болезн/.test(t)) return 'body'
  if (/партнёр|муж|отношени|любов/.test(t))  return 'relationships'
  if (/тревог|страх|паник/.test(t))          return 'anxiety'
  if (/дет|ребён|подрост/.test(t))           return 'children'
  if (/принадлеж|место|одиноч/.test(t))      return 'belonging'
  return 'general'
}

function buildHashtags(idea) {
  const topic  = detectTopic(idea)
  const pool   = TOPIC[topic] || TOPIC.general
  const format = FORMAT[idea.typeKey] || []

  const univ = shuffle([...UNIVERSAL]).slice(0, 5)
  const aud  = shuffle([...AUDIENCE]).slice(0, 3)
  const top  = shuffle([...pool]).slice(0, 5)
  const fmt  = format.slice(0, 2)

  return [...new Set([...univ, ...aud, ...top, ...fmt])].slice(0, 15)
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// ─── Stories announce ─────────────────────────────────────────────────────────

function buildStoriesAnnounce(idea, tone) {
  const title = idea.title

  const variants = {
    friendly: [
      `✨ В ленте новый пост: «${title}»\n\nРасскажу просто и с заботой.\nСохрани, если хочешь вернуться 💜`,
      `Подруга, у меня для тебя кое-что важное 👆\n\n«${title}»\nЭто одно из тех, что реально меняет взгляд.`,
    ],
    expert: [
      `📌 Новый пост в ленте:\n\n«${title}»\n\nРазбор без лишних слов, с опорой на практику. Читай 👆`,
      `Сегодня в ленте: «${title}»\n\nМетодологический разбор — коротко и по делу. Сохрани.`,
    ],
    provocative: [
      `🔥 Скажу прямо — новый пост:\n\n«${title}»\n\nИди читай. Это важно. 👆`,
      `Никто не говорит об этом — а я говорю.\n\n«${title}» — читай в ленте 👆`,
    ],
    inspirational: [
      `✨ Новый пост — для тех, кто хочет жить своей жизнью:\n\n«${title}» 💫\n\nЧитай в ленте 👆`,
      `Шаг к свободе от системных паттернов:\n\n«${title}»\n\nВесь пост в ленте — сохрани 💜`,
    ],
    humorous: [
      `🔮 Система снова говорит с нами через контент:\n\n«${title}»\n\nЧай в руку — и читай в ленте 👆`,
      `Три поколения того же паттерна. Мы заметили.\n\n«${title}» — в ленте 👆`,
    ],
  }

  const pool = variants[tone] || variants.friendly
  return pool[Math.floor(Math.random() * pool.length)]
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function generatePostText(idea, formData) {
  const tone = formData?.tone || 'friendly'

  const caption        = buildCaption(idea, tone)
  const firstLines     = buildFirstLines(idea, tone)
  const ctas           = buildCTAs(tone)
  const hashtags       = buildHashtags(idea)
  const storiesAnnounce = buildStoriesAnnounce(idea, tone)

  // Trim caption to ~150 words
  const words = caption.split(/\s+/)
  const trimmedCaption = words.length > 155 ? words.slice(0, 150).join(' ') + '…' : caption

  return {
    caption: trimmedCaption,
    firstLines,
    ctas,
    hashtags,
    storiesAnnounce,
  }
}
