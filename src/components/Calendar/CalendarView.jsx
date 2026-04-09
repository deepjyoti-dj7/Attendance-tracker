import { useSelector, useDispatch } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import { openPopup } from '../../store/slices/uiSlice'
import {
  dateKey, daysInMonth, isWeekend, isToday, isFuture,
  firstCellOffset, MONTHS_FULL, DOW_LABELS
} from '../../utils/dateHelpers'
import styles from './CalendarView.module.css'

const STATUS_META = {
  WFO:     { cls: styles.wfo,     badge: 'WFO' },
  WFH:     { cls: styles.wfh,     badge: 'WFH' },
  LEAVE:   { cls: styles.leave,   badge: 'Leave' },
  HOLIDAY: { cls: styles.holiday, badge: 'Holiday' },
}

export default function CalendarView() {
  const dispatch = useDispatch()
  const { year, month } = useSelector(s => s.ui)
  const attendance = useSelector(s => s.attendance.records)
  const holidays   = useSelector(s => s.holidays.list)

  const dim    = daysInMonth(year, month)
  const offset = firstCellOffset(year, month)

  function handleDayClick(key, el) {
    const rect = el.getBoundingClientRect()
    const popupW = 214
    const popupH = 240 // approx popup height

    // position: fixed → coordinates are viewport-relative, do NOT add scrollX/Y
    let x = rect.left
    let y = rect.bottom + 6

    // If popup would overflow right edge, shift left
    if (x + popupW > window.innerWidth - 12) {
      x = window.innerWidth - popupW - 12
    }

    // If popup would overflow bottom, open upward instead
    if (y + popupH > window.innerHeight - 12) {
      y = rect.top - popupH - 6
    }

    dispatch(openPopup({ dateKey: key, x: Math.max(8, x), y: Math.max(8, y) }))
  }

  return (
    <div className={`card card-pad ${styles.wrapper}`}>
      {/* Header */}
      <div className={styles.calHead}>
        <h2 className={styles.calTitle}>{MONTHS_FULL[month - 1]} {year}</h2>
        <div className={styles.legend}>
          {[
            { color: 'var(--wfo)',     label: 'WFO' },
            { color: 'var(--wfh)',     label: 'WFH' },
            { color: 'var(--leave)',   label: 'Leave' },
            { color: 'var(--holiday)', label: 'Holiday' },
            { color: 'var(--weekend)', label: 'Weekend' },
          ].map(l => (
            <div key={l.label} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: l.color }} />
              <span>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {/* Day-of-week headers */}
        {DOW_LABELS.map((d, i) => (
          <div key={d} className={`${styles.dowHdr} ${i >= 5 ? styles.wkndHdr : ''}`}>{d}</div>
        ))}

        {/* Empty offset cells */}
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`e-${i}`} className={styles.empty} />
        ))}

        {/* Day cells */}
        {Array.from({ length: dim }, (_, i) => i + 1).map(d => {
          const key     = dateKey(year, month, d)
          const weekend = isWeekend(year, month, d)
          const today   = isToday(year, month, d)
          const future  = isFuture(year, month, d)
          const pubHol  = holidays[key]
          const usr     = attendance[key]

          let statusCls = ''
          let badge = ''

          if (!weekend) {
            if (usr && STATUS_META[usr]) {
              statusCls = STATUS_META[usr].cls
              badge = STATUS_META[usr].badge
            } else if (pubHol && !usr) {
              statusCls = styles.ph
              badge = pubHol.length > 10 ? pubHol.slice(0, 9) + '…' : pubHol
            } else {
              statusCls = styles.unmarked
            }
          }

          return (
            <motion.div
              key={key}
              className={[
                styles.cell,
                weekend ? styles.weekend : styles.clickable,
                statusCls,
                today   ? styles.today   : '',
                future  ? styles.future  : '',
              ].join(' ')}
              title={pubHol || ''}
              onClick={weekend ? undefined : e => handleDayClick(key, e.currentTarget)}
              whileHover={!weekend ? { scale: 1.09, zIndex: 2 } : {}}
              whileTap={!weekend ? { scale: 0.95 } : {}}
              transition={{ type: 'spring', stiffness: 600, damping: 30 }}
            >
              <span className={styles.dayNum}>{d}</span>
              {badge && <span className={styles.dayBadge}>{badge}</span>}
              {today && <span className={styles.todayRing} />}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
