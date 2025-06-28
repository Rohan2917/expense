import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: null, username: null, role: null },
  reducers: {
    setAuthentication: (state, action) => {
      state.token = action.payload.token
      state.username = action.payload.user.username
      state.role = action.payload.user.role
    },
    clearAuthentication: state => {
      state.token = null
      state.username = null
      state.role = null
    }
  }
})

export const { setAuthentication, clearAuthentication } = authSlice.actions
export default authSlice.reducer
