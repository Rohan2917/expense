import { configureStore } from '@reduxjs/toolkit'
import auth from './slices/authSlice'
import filters from './slices/filterSlice'
import expenses from './slices/expenseSlice'
export default configureStore({ reducer: { auth, filters, expenses } })
