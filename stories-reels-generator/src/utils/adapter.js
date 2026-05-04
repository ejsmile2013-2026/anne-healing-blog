// Extracts meaningful values from formData to fill template placeholders.

function extractAudience(audience) {
  if (!audience) return 'женщина 40+'
  const lower = audience.toLowerCase()
  if (lower.includes('женщин')) {
    const match = lower.match(/женщин[а-я]*\s*(\d+[–\-—]\d+\+?|\d+\+?)/)
    if (match) return `женщина ${match[1]}`
    return 'женщина 40+'
  }
  return audience.split(/[,;]/)[0].trim().slice(0, 30) || 'твоя аудитория'
}

function extractAudienceGenitive(audience) {
  if (!audience) return 'женщин после 40, которые ищут исцеления'
  const lower = audience.toLowerCase()
  if (lower.includes('женщин')) return 'женщин после 40 в поиске изменений'
  return audience.split(/[,;]/)[0].trim().slice(0, 30) || 'твоей аудитории'
}

function extractProduct(niche) {
  if (!niche) return 'поверхностные тренинги без работы с системой'
  const lower = niche.toLowerCase()
  if (lower.includes('расстановк') || lower.includes('хеллингер') || lower.includes('систем')) {
    return 'коучей и курсы, которые работают только с симптомами'
  }
  if (lower.includes('психолог') || lower.includes('терапи')) return 'разговорную терапию без системного взгляда'
  if (lower.includes('отношени')) return 'тренинги по отношениям без работы с корнем'
  return 'поверхностные методы без работы с системой'
}

function extractTopic(theme, niche) {
  if (theme && theme.trim()) return theme.trim().toLowerCase()
  if (!niche) return 'семейную систему'
  const lower = niche.toLowerCase()
  if (lower.includes('расстановк')) return 'семейные расстановки'
  if (lower.includes('мат') || lower.includes('мам')) return 'отношения с матерью'
  if (lower.includes('отец') || lower.includes('пап')) return 'отношения с отцом'
  if (lower.includes('деньг') || lower.includes('финанс')) return 'деньги и система'
  if (lower.includes('тревог') || lower.includes('страх')) return 'тревогу и её корни'
  if (lower.includes('отношени') || lower.includes('партнёр')) return 'партнёрские паттерны'
  if (lower.includes('дети') || lower.includes('ребён')) return 'детей и систему'
  const words = niche.split(/[,;\s]+/).filter(w => w.length > 4)
  return words[0]?.toLowerCase() || 'семейную систему'
}

function extractSymptom(theme, niche) {
  const combined = ((theme || '') + ' ' + (niche || '')).toLowerCase()
  if (combined.includes('тревог') || combined.includes('страх')) return 'тревогу без видимой причины'
  if (combined.includes('деньг') || combined.includes('финанс')) return 'деньги, которые не задерживаются'
  if (combined.includes('мат') || combined.includes('мам')) return 'тяжесть в отношениях с мамой'
  if (combined.includes('отец') || combined.includes('пап')) return 'холодность или дистанцию с отцом'
  if (combined.includes('отношени') || combined.includes('партнёр')) return 'повторяющийся паттерн в отношениях'
  if (combined.includes('дети')) return 'тревогу или поведение ребёнка без причины'
  if (combined.includes('тело') || combined.includes('боль')) return 'хроническую боль или усталость'
  if (theme && theme.trim()) return theme.trim().toLowerCase()
  return 'ощущение «чужой жизни» и хроническую усталость'
}

function extractItem(niche, theme) {
  // For constellation niche, "предмет" makes less sense literally.
  // Return something metaphorical or practical.
  const lower = ((theme || '') + ' ' + (niche || '')).toLowerCase()
  if (lower.includes('расстановк')) return 'запись на расстановочную сессию'
  if (lower.includes('деньг')) return 'осознание своей системной лояльности'
  if (lower.includes('тревог')) return 'понимание, откуда идёт эта тревога'
  if (lower.includes('отношени')) return 'понимание своего партнёрского паттерна'
  return 'ключ к пониманию своей системы'
}

function extractResult(theme, niche) {
  const combined = ((theme || '') + ' ' + (niche || '')).toLowerCase()
  if (combined.includes('деньг') || combined.includes('финанс')) return 'отношение к деньгам и достатку'
  if (combined.includes('тревог') || combined.includes('страх')) return 'уровень тревоги и покой'
  if (combined.includes('отношени') || combined.includes('партнёр')) return 'качество отношений'
  if (combined.includes('мат') || combined.includes('мам')) return 'отношения с мамой'
  if (combined.includes('отец') || combined.includes('пап')) return 'отношения с отцом'
  if (combined.includes('дети')) return 'поведение и состояние ребёнка'
  if (theme && theme.trim()) return theme.trim().toLowerCase()
  return 'свободу от системных паттернов'
}

function extractState(niche, theme) {
  const combined = ((theme || '') + ' ' + (niche || '')).toLowerCase()
  if (combined.includes('тревог')) return 'в состоянии хронической тревоги'
  if (combined.includes('деньг')) return 'в ситуации, где деньги не задерживаются'
  if (combined.includes('отношени')) return 'в повторяющемся паттерне отношений'
  if (combined.includes('мат') || combined.includes('мам')) return 'в конфликте с мамой годами'
  return 'в ощущении «не своей жизни»'
}

function extractAction(niche, theme) {
  const combined = ((theme || '') + ' ' + (niche || '')).toLowerCase()
  if (combined.includes('расстановк')) return 'исследовать свою семейную систему'
  if (combined.includes('деньг')) return 'найти системный корень финансового паттерна'
  if (combined.includes('тревог')) return 'вернуть чужую тревогу туда, откуда она пришла'
  if (combined.includes('отношени')) return 'увидеть паттерн отношений через систему'
  return 'увидеть свою семейную систему с любовью'
}

function extractRitual(niche, theme) {
  const combined = ((theme || '') + ' ' + (niche || '')).toLowerCase()
  if (combined.includes('расстановк')) return 'расстановочную работу'
  if (combined.includes('телес')) return 'телесную практику осознанности'
  if (combined.includes('медитац')) return 'медитацию с образом рода'
  return 'практику принятия своей системы'
}

function extractQuestion(theme, niche) {
  const combined = ((theme || '') + ' ' + (niche || '')).toLowerCase()
  if (combined.includes('деньг')) return 'деньги уходят, а не остаются — это случайность?'
  if (combined.includes('тревог')) return 'тревога фоновая, без причины — откуда она?'
  if (combined.includes('отношени')) return 'повторяется та же история в отношениях?'
  if (combined.includes('мат') || combined.includes('мам')) return 'напряжение с мамой не уходит годами?'
  return 'ощущение «чужой жизни» — откуда оно?'
}

function extractMyth(theme, niche) {
  const combined = ((theme || '') + ' ' + (niche || '')).toLowerCase()
  if (combined.includes('расстановк')) return 'расстановки — это мистика или эзотерика'
  if (combined.includes('деньг')) return 'финансовые проблемы — только вопрос характера'
  if (combined.includes('тревог')) return 'тревога — это просто характер, надо терпеть'
  if (combined.includes('отношени')) return 'паттерны в отношениях можно изменить силой воли'
  return 'семейная история не влияет на взрослую жизнь'
}

export function buildAdaptationMap(formData) {
  const { niche = '', audience = '', theme = '' } = formData
  return {
    АУДИТОРИЯ: extractAudience(audience),
    КТО:       extractAudienceGenitive(audience),
    ПРОДУКТ:   extractProduct(niche),
    ТЕМА:      extractTopic(theme, niche),
    ВРЕМЯ:     '4–6 недель',
    ЧИСЛО:     '83',
    РЕЗУЛЬТАТ: extractResult(theme, niche),
    СОСТОЯНИЕ: extractState(niche, theme),
    ПРЕДМЕТ:   extractItem(niche, theme),
    СИМПТОМ:   extractSymptom(theme, niche),
    ЦЕНА:      '15 000 рублей',
    ДЕЙСТВИЕ:  extractAction(niche, theme),
    РИТУАЛ:    extractRitual(niche, theme),
    ВОПРОС:    extractQuestion(theme, niche),
    МИФ:       extractMyth(theme, niche),
    ОБЪЯСНЕНИЕ: 'система несёт паттерны поколениями — пока их не увидят',
    ОЩУЩЕНИЕ:  'было ощущение лёгкости и внутреннего порядка',
    СИТУАЦИЯ:  'чувствовать тревогу без причины или повторять одни и те же сценарии',
    КРАТКО:    'это след системной динамики, а не личной слабости',
    ПРИЗНАК:   'повторяющийся сценарий, который не зависит от ваших усилий',
    CTA:       'Сохрани, чтобы вернуться. Запись на сессию — в шапке профиля.',
  }
}

export function adaptText(text, formData) {
  const map = buildAdaptationMap(formData)
  let result = text
  for (const [key, val] of Object.entries(map)) {
    result = result.replaceAll(`[${key}]`, val)
  }
  return result
}

export function adaptTemplate(template, formData) {
  if (typeof template === 'string') {
    return adaptText(template, formData)
  }
  if (Array.isArray(template)) {
    return template.map(item => adaptTemplate(item, formData))
  }
  if (typeof template === 'object' && template !== null) {
    return Object.fromEntries(
      Object.entries(template).map(([k, v]) => [k, adaptTemplate(v, formData)])
    )
  }
  return template
}
