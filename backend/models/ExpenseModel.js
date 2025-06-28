import mongoose from 'mongoose'

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  description: String,
  category: { type: String, enum: ['Food', 'Travel', 'Shopping', 'Other'], default: 'Other' },
  timestamp: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

export default mongoose.model('Expense', expenseSchema)
