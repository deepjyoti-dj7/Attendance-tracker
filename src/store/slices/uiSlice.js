import { createSlice } from '@reduxjs/toolkit'
import { saveToStorage } from '../../utils/storage'

const now = new Date()

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: 'light',          // 'light' | 'dark'
    username: '',
    page: 'dashboard',       // 'dashboard' | 'calendar' | 'holidays'
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    popup: {
      open: false,
      dateKey: null,
      x: 0,
      y: 0,
    },
  },
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      saveToStorage('wfo_theme', state.theme)
    },
    setTheme(state, action) {
      state.theme = action.payload
    },
    setUsername(state, action) {
      state.username = action.payload
      saveToStorage('wfo_username', action.payload)
    },
    setYear(state, action) {
      state.year = action.payload
    },
    setMonth(state, action) {
      state.month = action.payload
    },
    setPage(state, action) {
      state.page = action.payload
    },
    setYearMonth(state, action) {
      state.year = action.payload.year
      state.month = action.payload.month
    },
    openPopup(state, action) {
      state.popup = { open: true, ...action.payload }
    },
    closePopup(state) {
      state.popup.open = false
    },
  },
})

export const {
  toggleTheme, setTheme,
  setUsername,
  setYear, setMonth, setYearMonth, setPage,
  openPopup, closePopup,
} = uiSlice.actions

export default uiSlice.reducer
