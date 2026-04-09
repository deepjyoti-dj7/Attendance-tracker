import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { useMonthStats } from '../../hooks/useMonthStats'
import { MONTHS_FULL } from '../../utils/dateHelpers'
import styles from './StatsGrid.module.css'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: i => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.38, ease: [0.4, 0, 0.2, 1] }
  })
}

export default function StatsGrid() {
  const { year, month } = useSelector(s => s.ui)
  const s = useMonthStats(year, month)
  const pct = s.pct !== null ? Math.round(s.pct) : null
  const pw = pct !== null ? Math.min(100, s.pct) : 0
  const good = pct !== null && s.onTrack
  const bad  = pct !== null && !s.onTrack

  return (
    <div className={styles.grid}>
      {/* Card 1 — WFO % */}
      <motion.div
        className={`${styles.card} ${styles.mainCard}`}
        custom={0} variants={cardVariants} initial="hidden" animate="show"
      >
        <div className={styles.label}>
          WFO Percentage — {MONTHS_FULL[month - 1]} {year}
        </div>
        <div className={`${styles.pctValue} ${good ? styles.good : bad ? styles.bad : styles.neutral}`}>
          {pct !== null ? `${pct}%` : '—'}
        </div>

        {/* Progress bar */}
        <div className={styles.progWrap}>
          <div className={styles.track}>
            <motion.div
              className={`${styles.fill} ${bad ? styles.fillBad : styles.fillGood}`}
              initial={{ width: 0 }}
              animate={{ width: `${pw}%` }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
            />
          </div>
          <div className={styles.targetLine}>
            <span className={styles.targetLabel}>60%</span>
          </div>
        </div>

        <div className={styles.subRow}>
          <span className={styles.sub}>
            Effective working days: <strong>{s.effective}</strong>
          </span>
          {pct === null && <span className={styles.subMuted}>No data yet</span>}
          {good  && <span className={`${styles.sub} ${styles.subGood}`}>✓ On track!</span>}
          {bad && s.needed > 0 && (
            <span className={`${styles.sub} ${styles.subBad}`}>
              ⚠ Need {s.needed} more WFO day{s.needed !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </motion.div>

      {/* Card 2 — Days Breakdown */}
      <motion.div className={styles.card} custom={1} variants={cardVariants} initial="hidden" animate="show">
        <div className={styles.label}>Days Breakdown</div>
        <div className={`${styles.bigNum} ${styles.neutral}`}>{s.effective}</div>
        <div className={styles.miniList}>
          <MiniRow color="#e2e8f0" label="Total Weekdays" value={s.totalWeekdays} />
          <MiniRow color="var(--holiday)" label="Public Holidays" value={s.pubHols + s.userHols} />
          <MiniRow color="var(--leave)" label="Leaves Taken" value={s.leave} />
          <MiniRow color="var(--text-muted)" label="Unmarked" value={s.unmarked} />
        </div>
      </motion.div>

      {/* Card 3 — Attendance Count */}
      <motion.div className={styles.card} custom={2} variants={cardVariants} initial="hidden" animate="show">
        <div className={styles.label}>Attendance Count</div>
        <div className={styles.miniList} style={{ marginTop: 14 }}>
          <MiniRow color="var(--wfo)"   label="WFO"   value={`${s.wfo} days`}   />
          <MiniRow color="var(--wfh)"   label="WFH"   value={`${s.wfh} days`}   />
          <MiniRow color="var(--leave)" label="Leave" value={`${s.leave} days`} />
          <MiniRow color="var(--holiday)" label="Holiday" value={`${s.pubHols + s.userHols}`} />
        </div>
      </motion.div>

      {/* Card 4 — Status */}
      <motion.div className={styles.card} custom={3} variants={cardVariants} initial="hidden" animate="show">
        <div className={styles.label}>Status</div>
        <div className={styles.statusCenter}>
          <motion.div
            className={styles.statusEmoji}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            {pct === null ? '📋' : good ? '✅' : '⚠️'}
          </motion.div>
          <div
            className={styles.statusLabel}
            style={{ color: pct === null ? 'var(--text-muted)' : good ? 'var(--wfo)' : 'var(--danger)' }}
          >
            {pct === null ? 'No data yet' : good ? 'Meeting target!' : 'Below target'}
          </div>
          {s.unmarked > 0 && (
            <div className={styles.statusSub}>
              {s.unmarked} day{s.unmarked !== 1 ? 's' : ''} to mark
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

function MiniRow({ color, label, value }) {
  return (
    <div className={styles.miniRow}>
      <span className={styles.miniDot} style={{ background: color }} />
      <span className={styles.miniLabel}>{label}</span>
      <span className={styles.miniValue}>{value}</span>
    </div>
  )
}
