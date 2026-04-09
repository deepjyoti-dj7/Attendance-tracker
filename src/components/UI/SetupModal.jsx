import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { setUsername } from '../../store/slices/uiSlice'
import styles from './SetupModal.module.css'

export default function SetupModal() {
  const dispatch = useDispatch()
  const [name, setName] = useState('')

  function handleSubmit() {
    const trimmed = name.trim()
    if (!trimmed) return
    dispatch(setUsername(trimmed))
  }

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 24 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      >
        <div className={styles.emoji}>👋</div>
        <h1 className={styles.title}>Welcome to WFO Tracker</h1>
        <p className={styles.subtitle}>
          Track your monthly Work-from-Office attendance and hit the <strong>60% target</strong> every month.
        </p>
        <input
          className={`input ${styles.input}`}
          type="text"
          placeholder="Enter your name to get started…"
          value={name}
          autoFocus
          maxLength={40}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
        <motion.button
          className={`btn btn-brand ${styles.cta}`}
          onClick={handleSubmit}
          disabled={!name.trim()}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Get Started →
        </motion.button>

        <div className={styles.feats}>
          {[
            '📅 Monthly WFO % tracking',
            '🎯 60% target with alerts',
            '🎌 Public holiday auto-exclusion',
            '🌙 Light & dark mode',
            '💾 Export & restore data',
          ].map(f => (
            <div key={f} className={styles.feat}>{f}</div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
