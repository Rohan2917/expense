import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import authRouter from './routes/auth.js'
import expenseRouter from './routes/expenses.js'

const app = express()
const allowedOrigins = ['https://expensex-q6f2.onrender.com', 'http://localhost:3000','https://expense-cyan.vercel.app']
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

app.use(express.json())
app.get('/', (req, res) => {
  res.send('🎉 ExpenseX Backend is running');
});
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
