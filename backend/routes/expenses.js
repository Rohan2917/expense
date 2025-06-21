import express from 'express'
import Expense from '../models/Expense.js'
import auth from '../middleware/auth.js'
const router = express.Router()
router.use(auth)
router.post('/', async (req, res) => {
  const { title, amount, description, timestamp } = req.body
  const expense = await Expense.create({ userId: req.userId, title, amount, description, timestamp: timestamp || Date.now() })
  res.json(expense)
})
router.get('/', async (req, res) => {
  const expenses = await Expense.find({ userId: req.userId }).sort({ timestamp: -1 })
  res.json(expenses)
})
router.delete('/month/:year/:month', async (req, res) => {
  const y = parseInt(req.params.year)
  const m = parseInt(req.params.month)
  const start = new Date(y, m - 1, 1)
  const end = new Date(y, m, 1)
  await Expense.deleteMany({ userId: req.userId, timestamp: { $gte: start, $lt: end } })
  res.sendStatus(204)
})
router.delete('/year/:year', async (req, res) => {
  const y = parseInt(req.params.year)
  const start = new Date(y, 0, 1)
  const end = new Date(y + 1, 0, 1)
  await Expense.deleteMany({ userId: req.userId, timestamp: { $gte: start, $lt: end } })
  res.sendStatus(204)
})
router.put('/:id', async (req, res) => {
  const { title, amount, description, timestamp } = req.body
  const expense = await Expense.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { title, amount, description, timestamp }, { new: true })
  res.json(expense)
})
router.delete('/:id', async (req, res) => {
  await Expense.deleteOne({ _id: req.params.id, userId: req.userId })
  res.sendStatus(204)
})
export default router
