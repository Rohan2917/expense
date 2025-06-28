import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createApiInstance } from '../../utils/api'

export const retrieveExpenses = createAsyncThunk('expenses/retrieveExpenses', async (params, { getState }) => {
  const { token } = getState().auth

  const { data } = await createApiInstance(token).get('/expenses', { params })

  return data
})

export const createNewExpense = createAsyncThunk('expenses/createNewExpense', async (payload, { getState }) => {
  const { token } = getState().auth
  const { data } = await createApiInstance(token).post('/expenses', payload)
  return data
})

export const updateExistingExpense = createAsyncThunk('expenses/updateExistingExpense', async ({ id, ...updates }, { getState }) => {
  const { token } = getState().auth
  const { data } = await createApiInstance(token).put(`/expenses/${id}`, updates)
  return data
})

export const removeExpense = createAsyncThunk('expenses/removeExpense', async (id, { getState }) => {
  const { token } = getState().auth
  await createApiInstance(token).delete(`/expenses/${id}`)
  return id
})

const expenseSlice = createSlice({
  name: 'expenses',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(retrieveExpenses.fulfilled, (state, action) => {
        state.items = action.payload
        state.status = 'succeeded'
      })
      .addCase(createNewExpense.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateExistingExpense.fulfilled, (state, action) => {
        const i = state.items.findIndex(x => x._id === action.payload._id)
        if (i !== -1) state.items[i] = action.payload
      })
      .addCase(removeExpense.fulfilled, (state, action) => {
        state.items = state.items.filter(x => x._id !== action.payload)
      })
  }
})

export default expenseSlice.reducer
