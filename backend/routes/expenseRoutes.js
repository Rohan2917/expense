import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import {
  getExpenses,
  getExpensesAdmin,
  createExpense,
  updateExpense,
  deleteExpense,
  deleteMonthlyExpenses
} from '../controllers/expenseController.js'

const router = express.Router()
router.use(authMiddleware)
router.get('/admin', getExpensesAdmin)
router.get('/', getExpenses)
router.post('/', createExpense)
router.put('/:id', updateExpense)
router.delete('/delete-month', deleteMonthlyExpenses)
router.delete('/:id', deleteExpense)

export default router
