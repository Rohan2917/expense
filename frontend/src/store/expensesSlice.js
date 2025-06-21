import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/api'
export const fetchExpenses = createAsyncThunk('expenses/fetch', async (_, { getState }) => {
  const token = getState().auth.token
  const { data } = await api(token).get('/expenses')
  return data
})
export const addExpense = createAsyncThunk('expenses/add', async (payload, { getState }) => {
  const token = getState().auth.token
  const { data } = await api(token).post('/expenses', payload)
  return data
})
export const updateExpense = createAsyncThunk('expenses/update', async ({ id, ...payload }, { getState }) => {
  const token = getState().auth.token
  const { data } = await api(token).put(`/expenses/${id}`, payload)
  return data
})
export const deleteExpense = createAsyncThunk('expenses/delete', async (id, { getState }) => {
  const token = getState().auth.token
  await api(token).delete(`/expenses/${id}`)
  return id
})
export const deleteMonthExpenses = createAsyncThunk('expenses/deleteMonth', async ({ year, month }, { getState }) => {
  const token = getState().auth.token
  await api(token).delete(`/expenses/month/${year}/${month}`)
  return { year, month }
})
export const deleteYearExpenses = createAsyncThunk('expenses/deleteYear', async ({ year }, { getState }) => {
  const token = getState().auth.token
  await api(token).delete(`/expenses/year/${year}`)
  return year
})
const slice = createSlice({
  name: 'expenses',
  initialState: { items: [] },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.items = action.payload
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const i = state.items.findIndex(x => x._id === action.payload._id)
        if (i >= 0) state.items[i] = action.payload
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.items = state.items.filter(x => x._id !== action.payload)
      })
      .addCase(deleteMonthExpenses.fulfilled, (state, action) => {
        const { year, month } = action.payload
        state.items = state.items.filter(x => {
          const d = new Date(x.timestamp)
          return !(d.getFullYear() === year && d.getMonth() + 1 === month)
        })
      })
      .addCase(deleteYearExpenses.fulfilled, (state, action) => {
        state.items = state.items.filter(x => new Date(x.timestamp).getFullYear() !== action.payload)
      })
  }
})
export default slice.reducer
