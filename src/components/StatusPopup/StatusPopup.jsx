import { useSelector, useDispatch } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import { closePopup } from '../../store/slices/uiSlice'
import { setDayStatus } from '../../store/slices/attendanceSlice'
import { formatDateLabel } from '../../utils/dateHelpers'
import toast from 'react-hot-toast'
import { useEffect, useRef } from 'react'
import styles from './StatusPopup.module.css'

const OPTIONS = [
  { status: 'WFO',     emoji: '🏢', label: 'Work from Office', color: '#dcfce7', textColor: '#059669' },
  { status: 'WFH',     emoji: '🏠', label: 'Work from Home',   color: '#dbeafe', textColor: '#2563eb' },
  { status: 'LEAVE',   emoji: '🌴', label: 'On Leave',          color: '#fffbeb', textColor: '#d97706' },
  { status: 'HOLIDAY', emoji: '🎉', label: 'Holiday',           color: '#f5f3ff', textColor: '#7c3aed' },
]

export default function StatusPopup() {
  const dispatch = useDispatch()
  const popup = useSelector(s => s.ui.popup)
  const attendance = useSelector(s => s.attendance.records)
  const holidays = useSelector(s => s.holidays.list)
  const ref = useRef()

  const current = popup.dateKey ? attendance[popup.dateKey] : null
  const pubHol  = popup.dateKey ? holidays[popup.dateKey] : null

  // Close on outside click
  useEffect(() => {
    if (!popup.open) return
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        dispatch(closePopup())
      }
    }
    // Small delay so the click that opened it doesn't immediately close it
    const tid = setTimeout(() => document.addEventListener('click', handler), 50)
    return () => {
      clearTimeout(tid)
      document.removeEventListener('click', handler)
    }
  }, [popup.open, dispatch])

  // Escape key
  useEffect(() => {
    function handler(e) {
      if (e.key === 'Escape') dispatch(closePopup())
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [dispatch])

  function handleSet(status) {
    dispatch(setDayStatus({ dateKey: popup.dateKey, status }))
    dispatch(closePopup())
    toast.success(`Marked as ${status}`)
  }

  function handleClear() {
    dispatch(setDayStatus({ dateKey: popup.dateKey, status: null }))
    dispatch(closePopup())
    toast('Cleared', { icon: '🗑' })
  }

  return (
    <AnimatePresence>
      {popup.open && (
        <motion.div
          ref={ref}
          className={styles.popup}
          style={{ left: popup.x, top: popup.y }}
          initial={{ opacity: 0, scale: 0.88, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: -8 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <div className={styles.dateLabel}>
            {popup.dateKey && formatDateLabel(popup.dateKey)}
          </div>

          {pubHol && (
            <div className={styles.phNote}>
              🎉 Public holiday: {pubHol}
            </div>
          )}

          {OPTIONS.map(opt => (
            <motion.button
              key={opt.status}
              className={`${styles.optBtn} ${current === opt.status ? styles.active : ''}`}
              onClick={() => handleSet(opt.status)}
              whileHover={{ x: 3 }}
              transition={{ type: 'spring', stiffness: 600, damping: 30 }}
            >
              <span
                className={styles.optIco}
                style={{ background: opt.color, color: opt.textColor }}
              >{opt.emoji}</span>
              {opt.label}
              {current === opt.status && <span className={styles.checkmark}>✓</span>}
            </motion.button>
          ))}

          <hr className={styles.sep} />

          <motion.button
            className={`${styles.optBtn} ${styles.clearBtn}`}
            onClick={handleClear}
            whileHover={{ x: 3 }}
            transition={{ type: 'spring', stiffness: 600, damping: 30 }}
          >
            <span className={styles.optIco} style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>✕</span>
            Clear / Unmark
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
