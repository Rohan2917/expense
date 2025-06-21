import { configureStore } from '@reduxjs/toolkit'
import auth from './authSlice'
import expenses from './expensesSlice'
export default configureStore({ reducer: { auth, expenses } })
