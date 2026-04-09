import { dateKey, daysInMonth, isWeekend } from './dateHelpers'

const TARGET = 60 // WFO % goal

/**
 * Calculate stats for a given month.
 * Rules:
 *   effective = weekdays − publicHolidays − userHolidays − leaves
 *   WFO% = WFO / effective × 100
 *   Leaves and holidays are excluded from the denominator.
 */
export function monthStats(year, month, attendance, holidays) {
  const dim = daysInMonth(year, month)
  let totalWeekdays = 0, pubHols = 0, userHols = 0
  let wfo = 0, wfh = 0, leave = 0, unmarked = 0

  for (let d = 1; d <= dim; d++) {
    if (isWeekend(year, month, d)) continue
    totalWeekdays++
    const key = dateKey(year, month, d)
    const isPub = holidays[key] !== undefined
    const usr = attendance[key]

    // Public holiday not overridden by user → auto-excluded
    if (isPub && !usr) { pubHols++; continue }

    if (usr === 'HOLIDAY') { userHols++; continue }
    if (usr === 'WFO')   wfo++
    else if (usr === 'WFH')   wfh++
    else if (usr === 'LEAVE') leave++
    else unmarked++
  }

  const effective = totalWeekdays - pubHols - userHols - leave
  const pct = effective > 0 ? (wfo / effective) * 100 : null
  const needed = pct !== null ? Math.max(0, Math.ceil((TARGET / 100) * effective) - wfo) : 0
  const onTrack = pct !== null && pct >= TARGET

  return {
    totalWeekdays, pubHols, userHols,
    wfo, wfh, leave, unmarked,
    effective, pct, needed, onTrack,
  }
}

export { TARGET }
