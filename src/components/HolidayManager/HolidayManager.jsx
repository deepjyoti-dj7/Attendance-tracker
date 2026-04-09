import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { addHoliday, removeHoliday } from '../../store/slices/holidaysSlice'
import { MONTHS_SHORT } from '../../utils/dateHelpers'
import toast from 'react-hot-toast'
import styles from './HolidayManager.module.css'

export default function HolidayManager() {
  const dispatch = useDispatch()
  const holidays = useSelector(s => s.holidays.list)
  const { year } = useSelector(s => s.ui)

  const [date, setDate] = useState('')
  const [name, setName] = useState('')

  function handleAdd() {
    if (!date || !name.trim()) {
      toast.error('Please enter both a date and a name')
      return
    }
    dispatch(addHoliday({ dateKey: date, name: name.trim() }))
    toast.success('Holiday added')
    setDate(''); setName('')
  }

  function handleDelete(key) {
    dispatch(removeHoliday(key))
    toast('Holiday removed', { icon: '🗑' })
  }

  const sorted = Object.entries(holidays).sort(([a], [b]) => a.localeCompare(b))

  return (
    <div className={styles.wrapper}>
      <h2 className="section-title">🎌 Manage Public Holidays</h2>

      <div className={`card card-pad ${styles.card}`}>
        {/* List */}
        <div className={styles.listWrap}>
          <AnimatePresence mode="popLayout">
            {sorted.length === 0 && (
              <div className={styles.empty}>No holidays added yet</div>
            )}
            {sorted.map(([key, holName]) => {
              const [y, m, d] = key.split('-')
              return (
                <motion.div
                  key={key}
                  className={styles.row}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16, height: 0, marginBottom: 0 }}
                  layout
                >
                  <span className={styles.rowDate}>
                    {parseInt(d)} {MONTHS_SHORT[parseInt(m) - 1]} {y}
                  </span>
                  <span className={styles.rowName}>{holName}</span>
                  <motion.button
                    className={styles.delBtn}
                    onClick={() => handleDelete(key)}
                    whileTap={{ scale: 0.85 }}
                    title="Remove holiday"
                  >×</motion.button>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Add form */}
        <div className={styles.addForm}>
          <input
            type="date"
            className={`input ${styles.dateInput}`}
            value={date}
            onChange={e => setDate(e.target.value)}
          />
          <input
            type="text"
            className={`input ${styles.nameInput}`}
            placeholder="Holiday name…"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            maxLength={60}
          />
          <motion.button
            className={`btn btn-brand ${styles.addBtn}`}
            onClick={handleAdd}
            whileTap={{ scale: 0.96 }}
          >
            + Add Holiday
          </motion.button>
        </div>
      </div>
    </div>
  )
}
