import mongoose from 'mongoose'
const schema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  description: String,
  category: {
    type: String,
    enum: ['Food', 'Travel', 'Shopping', 'Investment', 'Other'],
    default: 'Other'
  },
  timestamp: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})
export default mongoose.model('Expense', schema)
