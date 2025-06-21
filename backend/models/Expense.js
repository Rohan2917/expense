import mongoose from 'mongoose'
const expenseSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  title: String,
  amount: Number,
  description: String,
  timestamp: { type: Date, default: Date.now }
})
export default mongoose.model('Expense', expenseSchema)
