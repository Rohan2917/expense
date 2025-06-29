import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createApiInstance } from '../../utils/api'

export const retrieveExpenses = createAsyncThunk('exp/get', async (_, { getState }) => {
  const { token } = getState().auth
  const p = getState().filters.expense
  const { data } = await createApiInstance(token).get('/expenses', { params: p })
  return data
})

const s = createSlice({
  name: 'expenses',
  initialState: { items: [] },
  reducers: {},
  extraReducers: b => {
    b.addCase(retrieveExpenses.fulfilled, (st, a) => {
      st.items = a.payload
    })
  }
})
export default s.reducer
