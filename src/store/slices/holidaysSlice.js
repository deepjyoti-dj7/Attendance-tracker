import { createSlice } from "@reduxjs/toolkit";
import { saveToStorage } from "../../utils/storage";

// Default public holidays from holidays.txt (2026)
const DEFAULT_HOLIDAYS = {
  "2026-01-26": "Republic Day",
  "2026-05-01": "May Day",
  "2026-05-28": "Buddha Purnima",
  "2026-09-14": "Public Holiday",
  "2026-10-02": "Gandhi Jayanti",
  "2026-10-21": "Diwali",
  "2026-11-10": "Guru Nanak Jayanti",
  "2026-12-25": "Christmas Day",
};

const holidaysSlice = createSlice({
  name: "holidays",
  initialState: {
    // { "YYYY-MM-DD": "Holiday Name" }
    list: DEFAULT_HOLIDAYS,
  },
  reducers: {
    addHoliday(state, action) {
      const { dateKey, name } = action.payload;
      state.list[dateKey] = name;
      saveToStorage("wfo_holidays", state.list);
    },
    removeHoliday(state, action) {
      delete state.list[action.payload];
      saveToStorage("wfo_holidays", state.list);
    },
    setHolidays(state, action) {
      state.list = action.payload;
      saveToStorage("wfo_attendance", state.records);
    },
  },
});

export const { addHoliday, removeHoliday, setHolidays } = holidaysSlice.actions;
export default holidaysSlice.reducer;
