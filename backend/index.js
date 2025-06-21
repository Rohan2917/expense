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

const PORT = process.env.PORT || 4000

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true, // ensure TLS
  serverSelectionTimeoutMS: 10000, // fail fast if cannot connect
})
.then(() => {
  console.log('✅ MongoDB connected successfully')
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
  })
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message)
})
