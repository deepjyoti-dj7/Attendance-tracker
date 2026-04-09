import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { setMonth, setPage } from '../../store/slices/uiSlice'
import { useMonthStats } from '../../hooks/useMonthStats'
import { MONTHS_SHORT, dateKey, daysInMonth } from '../../utils/dateHelpers'
import styles from './YearSidebar.module.css'

function MonthRow({ year, month, currentMonth }) {
  const dispatch = useDispatch()
  const s = useMonthStats(year, month)
  const pct = s.pct !== null ? Math.round(s.pct) : null
  const color = pct === null ? 'var(--border)' : s.onTrack ? 'var(--wfo)' : 'var(--danger)'
  const w = pct !== null ? Math.min(100, s.pct) : 0
  const active = month === currentMonth

  return (
    <motion.div
      className={`${styles.mthRow} ${active ? styles.mthActive : ''}`}
      onClick={() => { dispatch(setMonth(month)); dispatch(setPage('calendar')) }}
      whileHover={{ x: 3 }}
      transition={{ type: 'spring', stiffness: 600, damping: 30 }}
    >
      <span className={styles.mthName}>{MONTHS_SHORT[month - 1]}</span>
      <div className={styles.mthBar}>
        <motion.div
          className={styles.mthFill}
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${w}%` }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        />
        <div className={styles.mthTarget} />
      </div>
      <span className={styles.mthPct} style={{ color: pct === null ? 'var(--text-muted)' : color }}>
        {pct !== null ? `${pct}%` : '—'}
      </span>
      <span className={styles.mthDot} style={{ background: color }} />
    </motion.div>
  )
}

function HolidayList({ year, month, holidays }) {
  const dim = daysInMonth(year, month)
  const items = []
  for (let d = 1; d <= dim; d++) {
    const key = dateKey(year, month, d)
    if (holidays[key]) items.push({ d, name: holidays[key] })
  }

  if (items.length === 0) {
    return <div className={styles.noData}>No public holidays this month 🎉</div>
  }

  return (
    <div className={styles.holList}>
      {items.map(h => (
        <motion.div
          key={h.d}
          className={styles.holItem}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className={styles.holDate}>{h.d} {MONTHS_SHORT[month - 1]}</span>
          <span className={styles.holName}>{h.name}</span>
        </motion.div>
      ))}
    </div>
  )
}

export default function YearSidebar() {
  const { year, month } = useSelector(s => s.ui)
  const holidays = useSelector(s => s.holidays.list)

  return (
    <div className={styles.sidebar}>
      {/* Year overview */}
      <div className={`card card-pad-sm ${styles.card}`}>
        <div className={styles.cardTitle}>📊 Year Overview</div>
        <div className={styles.mthList}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
            <MonthRow key={m} year={year} month={m} currentMonth={month} />
          ))}
        </div>
      </div>

      {/* This month holidays */}
      <div className={`card card-pad-sm ${styles.card}`}>
        <div className={styles.cardTitle}>🗓 Holidays This Month</div>
        <HolidayList year={year} month={month} holidays={holidays} />
      </div>
    </div>
  )
}
