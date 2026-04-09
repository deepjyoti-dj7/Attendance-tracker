import { configureStore } from '@reduxjs/toolkit'
import attendanceReducer from './slices/attendanceSlice'
import holidaysReducer from './slices/holidaysSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    attendance: attendanceReducer,
    holidays: holidaysReducer,
    ui: uiReducer,
  },
})
