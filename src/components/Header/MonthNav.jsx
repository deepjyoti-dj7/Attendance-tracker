import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { setMonth, setYear } from '../../store/slices/uiSlice'
import { useMonthStats } from '../../hooks/useMonthStats'
import { MONTHS_SHORT } from '../../utils/dateHelpers'
import styles from './MonthNav.module.css'

const MONTHS = MONTHS_SHORT

function TabIndicator({ year, month }) {
  const s = useMonthStats(year, month)
  if (!s.wfo && !s.wfh && !s.leave) return null
  return (
    <span
      className={styles.dot}
      style={{ background: s.onTrack ? '#22c55e' : '#ef4444' }}
    />
  )
}

export default function MonthNav() {
  const dispatch = useDispatch()
  const { year, month } = useSelector(s => s.ui)

  const now = new Date()

  function goToday() {
    dispatch(setYear(now.getFullYear()))
    dispatch(setMonth(now.getMonth() + 1))
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        {/* Year control */}
        <div className={styles.yearCtrl}>
          <button
            className={styles.yearBtn}
            onClick={() => dispatch(setYear(year - 1))}
            aria-label="Previous year"
          >‹</button>
          <span className={styles.yearVal}>{year}</span>
          <button
            className={styles.yearBtn}
            onClick={() => dispatch(setYear(year + 1))}
            aria-label="Next year"
          >›</button>
        </div>

        <button className={styles.todayBtn} onClick={goToday}>Today</button>

        {/* Month tabs */}
        <div className={styles.tabs} role="tablist">
          {MONTHS.map((name, i) => {
            const m = i + 1
            const active = m === month
            return (
              <button
                key={m}
                role="tab"
                aria-selected={active}
                className={`${styles.tab} ${active ? styles.tabActive : ''}`}
                onClick={() => dispatch(setMonth(m))}
              >
                {name}
                <TabIndicator year={year} month={m} />
                {active && (
                  <motion.span
                    className={styles.tabUnderline}
                    layoutId="tab-underline"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
