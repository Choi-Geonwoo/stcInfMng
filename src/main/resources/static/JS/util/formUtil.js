/* ===============================
 * Form Compare Common Utility
 * =============================== */

/**
 * 깊은 비교 핵심
 */
export function isEqual(a, b, options = {}) {
  const {
    trimString = true,
    ignoreCase = false,
    allowNullUndefinedEqual = true
  } = options

  if (allowNullUndefinedEqual && a == null && b == null) return true
  if (a === b) return true

  if (Number.isNaN(a) && Number.isNaN(b)) return true

  if (a instanceof Date && b instanceof Date)
    return a.getTime() === b.getTime()

  if (typeof a === 'string' && typeof b === 'string') {
    let s1 = trimString ? a.trim() : a
    let s2 = trimString ? b.trim() : b
    if (ignoreCase) {
      s1 = s1.toLowerCase()
      s2 = s2.toLowerCase()
    }
    return s1 === s2
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((v, i) => isEqual(v, b[i], options))
  }

  if (isObject(a) && isObject(b)) {
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    if (keysA.length !== keysB.length) return false
    return keysA.every(k => isEqual(a[k], b[k], options))
  }

  return false
}

/**
 * form element -> object
 */
export function getFormObject(formEl) {
  const data = {}
  formEl.querySelectorAll('[name]').forEach(el => {
    data[el.name] = el.value
  })
  return data
}

/**
 * 폼 전용 비교
 */
export function isSameForm(origin, current) {
  return isEqual(origin, current, {
    trimString: true,
    allowNullUndefinedEqual: true
  })
}

function isObject(v) {
  return v !== null && typeof v === 'object'
}
