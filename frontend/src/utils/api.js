import axios from 'axios'
export const createApiInstance = token =>
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
