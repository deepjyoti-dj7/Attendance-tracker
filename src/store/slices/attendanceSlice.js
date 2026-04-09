import { createSlice } from '@reduxjs/toolkit'
import { saveToStorage, loadFromStorage } from '../../utils/storage'

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    // { "YYYY-MM-DD": "WFO" | "WFH" | "LEAVE" | "HOLIDAY" }
    records: {},
  },
  reducers: {
    setDayStatus(state, action) {
      const { dateKey, status } = action.payload
      if (status === null) {
        delete state.records[dateKey]
      } else {
        state.records[dateKey] = status
      }
      saveToStorage('wfo_attendance', state.records)
    },
    setRecords(state, action) {
      state.records = action.payload
    },
  },
})

export const { setDayStatus, setRecords } = attendanceSlice.actions
export default attendanceSlice.reducer
