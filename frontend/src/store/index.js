import { configureStore } from '@reduxjs/toolkit'
import auth from './slices/authSlice'
import expenses from './slices/expenseSlice'
export default configureStore({ reducer: { auth, expenses } })
