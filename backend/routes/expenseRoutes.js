import express from 'express'
import auth from '../middleware/authMiddleware.js'
import { getExpenses, getExpensesAdmin, createExpense, updateExpense, deleteExpense, deleteMonth} from '../controllers/expenseController.js'
const r = express.Router()
r.use(auth)
r.get('/admin', getExpensesAdmin)
r.delete('/delete-month', deleteMonth)
r.get('/', getExpenses)
r.post('/', createExpense)
r.put('/:id', updateExpense)
r.delete('/:id', deleteExpense)
export default r
