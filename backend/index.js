import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import authRouter from './routes/auth.js'
import expenseRouter from './routes/expenses.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/expenses', expenseRouter)

mongoose.connect(process.env.MONGODB_URI).then(() => {
  app.listen(process.env.PORT || 4000)
})
