import Expense from '../models/ExpenseModel.js';

export const getExpenses = async (req, res) => {
  const { from, to, category } = req.query;
  const q = { user: req.user.id };
 if (from && to) q.timestamp = { $gte: new Date(from), $lte: new Date(to) };
  if (category && category !== 'All') q.category = category;
  res.json(await Expense.find(q).sort({ timestamp: -1 }));
};



export const getExpensesAdmin = async (req, res) => {
  const { year, month, day, category } = req.query;
  const y = +year;
  const m = +month - 1;
  const queryBase = { user: req.user.id };

  if (category && category !== 'All') queryBase.category = category;

 const startOfMonth = new Date(y, m, 1); // Local: start of month
const endOfMonth = new Date(y, m + 1, 1); // Local: start of next month

const startOfDay = day ? new Date(y, m, +day) : null; // Local: start of day
const endOfDay = day ? new Date(y, m, +day, 23, 59, 59, 999) : null; // Local: end of day


  let dayTotal = 0;
  if (day) {
    const dayResult = await Expense.aggregate([
      { $match: { ...queryBase, timestamp: { $gte: startOfDay, $lte: endOfDay } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    dayTotal = dayResult[0]?.total || 0;
   
  }

  const monthResult = await Expense.aggregate([
    { $match: { ...queryBase, timestamp: { $gte: startOfMonth, $lt: endOfMonth } } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  const monthTotal = monthResult[0]?.total || 0;

  const expenseQuery = day 
    ? { ...queryBase, timestamp: { $gte: startOfDay, $lte: endOfDay } } 
    : { ...queryBase, timestamp: { $gte: startOfMonth, $lt: endOfMonth } };

  const expenses = await Expense.find(expenseQuery).sort({ timestamp: -1 });

  res.json({ dayTotal, monthTotal, expenses });
};

export const createExpense = async (req, res) => {
  res.status(201).json(await Expense.create({ ...req.body, user: req.user.id }));
};

export const updateExpense = async (req, res) => {
  res.json(await Expense.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  ));
};

export const deleteExpense = async (req, res) => {
  res.json(await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id }));
};

export const deleteMonth = async (req, res) => {
  const { year, month } = req.query;
  const y = +year, m = +month - 1;
  await Expense.deleteMany({
    user: req.user.id,
    timestamp: { 
      $gte: new Date(Date.UTC(y, m, 1)), 
      $lt: new Date(Date.UTC(y, m + 1, 1)) 
    }
  });
  res.json({ ok: true });
};