/**
 * Date utility helpers
 */

export const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
export const MONTHS_FULL  = ['January','February','March','April','May','June','July','August','September','October','November','December']
export const DOW_LABELS   = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

export function dateKey(y, m, d) {
  return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`
}

export function daysInMonth(y, m) {
  return new Date(y, m, 0).getDate()
}

export function dayOfWeek(y, m, d) {
  return new Date(y, m - 1, d).getDay() // 0=Sun, 6=Sat
}

export function isWeekend(y, m, d) {
  const w = dayOfWeek(y, m, d)
  return w === 0 || w === 6
}

export function isToday(y, m, d) {
  const n = new Date()
  return n.getFullYear() === y && n.getMonth() + 1 === m && n.getDate() === d
}

export function isFuture(y, m, d) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(y, m - 1, d) > today
}

/** First cell offset (Monday-based grid, 0=Mon…6=Sun) */
export function firstCellOffset(y, m) {
  const w = new Date(y, m - 1, 1).getDay()
  return w === 0 ? 6 : w - 1
}

export function formatDateLabel(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })
}
