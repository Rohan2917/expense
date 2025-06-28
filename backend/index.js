import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import { connectDatabase } from './config/database.js'
import authRoutes from './routes/authRoutes.js'
import expenseRoutes from './routes/expenseRoutes.js'

const app = express()
const allowedOrigins = ['https://expensex-q6f2.onrender.com', 'http://localhost:3000', 'https://expense-cyan.vercel.app']
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true)
      else callback(new Error('Not allowed by CORS'))
    },
    credentials: true
  })
)
app.use(express.json())
app.get('/', (req, res) => res.send('Expense Tracker Backend Running'))
app.use('/api/auth', authRoutes)
app.use('/api/expenses', expenseRoutes)

const startServer = async () => {
  await connectDatabase()
  const PORT = process.env.PORT || 4000
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
}
startServer()
