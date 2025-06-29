import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import { connectDatabase } from './config/database.js'
import authRoutes from './routes/authRoutes.js'
import expenseRoutes from './routes/expenseRoutes.js'

const app = express()
app.use(cors({ origin: '*', credentials: true }))
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/expenses', expenseRoutes)
connectDatabase().then(() => app.listen(process.env.PORT || 4000))
