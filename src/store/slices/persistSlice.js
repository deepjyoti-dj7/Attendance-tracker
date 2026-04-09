import { setRecords } from './attendanceSlice'
import { setHolidays } from './holidaysSlice'
import { setTheme, setUsername } from './uiSlice'
import { loadFromStorage } from '../../utils/storage'

// Thunk to load all persisted state
export const loadState = () => dispatch => {
  const attendance = loadFromStorage('wfo_attendance', {})
  const holidays = loadFromStorage('wfo_holidays', null)
  const theme = loadFromStorage('wfo_theme', 'light')
  const username = loadFromStorage('wfo_username', '')

  dispatch(setRecords(attendance))
  if (holidays) dispatch(setHolidays(holidays))
  dispatch(setTheme(theme))
  dispatch(setUsername(username))
}
