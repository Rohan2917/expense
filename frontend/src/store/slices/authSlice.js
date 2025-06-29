import { createSlice } from '@reduxjs/toolkit'
const s = createSlice({
  name: 'auth',
  initialState: { token: null, username: null, role: null },
  reducers: {
    setAuthentication: (st, a) => {
      st.token = a.payload.token
      st.username = a.payload.user.username
      st.role = a.payload.user.role
    },
    clearAuthentication: st => {
      st.token = null
      st.username = null
      st.role = null
    }
  }
})
export const { setAuthentication, clearAuthentication } = s.actions
export default s.reducer
