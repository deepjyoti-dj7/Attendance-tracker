import { useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { toggleTheme, setUsername } from '../../store/slices/uiSlice'
import { exportAllData } from '../../utils/storage'
import { setRecords } from '../../store/slices/attendanceSlice'
import { setHolidays } from '../../store/slices/holidaysSlice'
import toast from 'react-hot-toast'
import styles from './Header.module.css'

export default function Header() {
  const dispatch = useDispatch()
  const username = useSelector(s => s.ui.username)
  const theme = useSelector(s => s.ui.theme)
  const state = useSelector(s => s)
  const importRef = useRef()

  function handleExport() {
    exportAllData(state)
    toast.success('Data exported!')
  }

  function handleImport(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const d = JSON.parse(ev.target.result)
        if (d.attendance) dispatch(setRecords(d.attendance))
        if (d.holidays)   dispatch(setHolidays(d.holidays))
        if (d.username)   dispatch(setUsername(d.username))
        toast.success('Data imported!')
      } catch {
        toast.error('Invalid backup file')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const initial = username ? username.charAt(0).toUpperCase() : '?'

  return (
    <motion.header
      className={styles.header}
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className={styles.inner}>
        {/* Logo */}
        <div className={styles.logo}>
          <span className={styles.logoMark}>WFO</span>
          <span className={styles.logoText}> Tracker</span>
        </div>

        {/* Target pill */}
        <div className={styles.targetPill}>
          <span className={styles.targetIcon}>🎯</span>
          <span>Target: 60%</span>
        </div>

        {/* User pill */}
        <div className={styles.userPill}>
          <div className={styles.avatar}>{initial}</div>
          <span className={styles.username}>{username || 'Set Name'}</span>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {/* Theme toggle */}
          <motion.button
            className={`${styles.iconBtn}`}
            onClick={() => dispatch(toggleTheme())}
            whileTap={{ scale: 0.9 }}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </motion.button>

          {/* Export */}
          <motion.button
            className={styles.iconBtn}
            onClick={handleExport}
            whileTap={{ scale: 0.9 }}
            title="Export data"
          >
            📤
          </motion.button>

          {/* Import */}
          <motion.label
            className={styles.iconBtn}
            whileTap={{ scale: 0.9 }}
            title="Import data"
            style={{ cursor: 'pointer' }}
          >
            📥
            <input
              type="file"
              accept=".json"
              hidden
              onChange={handleImport}
              ref={importRef}
            />
          </motion.label>

          {/* Settings */}
          <motion.button
            className={styles.iconBtn}
            onClick={() => {
              const n = prompt('Update your name:', username)
              if (n?.trim()) dispatch(setUsername(n.trim()))
            }}
            whileTap={{ scale: 0.9 }}
            title="Change name"
          >
            ⚙️
          </motion.button>
        </div>
      </div>
    </motion.header>
  )
}
