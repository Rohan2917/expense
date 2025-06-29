import { createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

const n = dayjs()
const s = createSlice({
  name: 'filters',
  initialState: {
    expense: { from: n.startOf('day').toISOString(), to: n.endOf('day').toISOString(), category: 'All' },
    admin: { year: n.year(), month: n.month() + 1, day: n.date(), category: 'All' }
  },
  reducers: {
    setExpenseFilter: (st, a) => {
      st.expense = { ...st.expense, ...a.payload }
    },
    setAdminFilter: (st, a) => {
      st.admin = { ...st.admin, ...a.payload }
    }
  }
})
export const { setExpenseFilter, setAdminFilter } = s.actions
export default s.reducer
