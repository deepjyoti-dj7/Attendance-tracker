import { useSelector } from 'react-redux'
import { monthStats } from '../utils/statsCalc'

export function useMonthStats(year, month) {
  const attendance = useSelector(s => s.attendance.records)
  const holidays = useSelector(s => s.holidays.list)
  return monthStats(year, month, attendance, holidays)
}
