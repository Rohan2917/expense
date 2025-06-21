import { createSlice } from '@reduxjs/toolkit'
const stored = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('auth') || '{}') : {}
const slice = createSlice({
  name: 'auth',
  initialState: { token: stored.token || null, username: stored.username || '' },
  reducers: {
    setAuth: (s, a) => {
      s.token = a.payload.token
      s.username = a.payload.username
      localStorage.setItem('auth', JSON.stringify(a.payload))
    },
    clearAuth: s => {
      s.token = null
      s.username = ''
      localStorage.removeItem('auth')
    }
  }
})
export const { setAuth, clearAuth } = slice.actions
export default slice.reducer
