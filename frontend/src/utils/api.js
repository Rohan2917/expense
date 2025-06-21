import axios from 'axios'
const api = token =>
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
export default api
