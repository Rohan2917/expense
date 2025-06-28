import Expense from '../models/ExpenseModel.js'

export const getExpenses = async (req, res) => {
  try {
    const { from, to, year, month } = req.query
    const query = { user: req.user.id }
    if (from && to) {
      query.timestamp = { $gte: new Date(from), $lte: new Date(to) }
    } else if (year && month) {
      const start = new Date(Date.UTC(+year, +month - 1, 1))
      const end = new Date(Date.UTC(+year, +month, 0, 23, 59, 59, 999))
      query.timestamp = { $gte: start, $lte: end }
    } else {
      const now = new Date()
      const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
      const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999))
      query.timestamp = { $gte: start, $lte: end }
    }
    const expenses = await Expense.find(query).sort({ timestamp: -1 })
    res.json(expenses)
  } catch {
    res.status(500).json({ message: 'Server error fetching expenses' })
  }
}


export const getExpensesAdmin = async (req, res) => {
  const { from, to, year, month, page = 0, pageSize = 10 } = req.query;
  const limit = +pageSize;
  const skip = +page * limit;
  const query = { user: req.user.id };

  let startDate, endDate;

  if (from && to) {
    startDate = new Date(from);
    endDate = new Date(to);
  } else if (year && month) {
    startDate = new Date(year, month - 1, 1);
    endDate = new Date(year, month, 1);
  } else {
    // Default: current month in UTC
    const now = new Date();
    startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  }

  query.timestamp = { $gte: startDate, $lt: endDate };
console.log("x= ", query.timestamp)
  const [expenses, totalCount, totalAgg] = await Promise.all([
    Expense.find(query).sort({ timestamp: -1 }).skip(skip).limit(limit),
    Expense.countDocuments(query),
    Expense.aggregate([
      { $match: query },
      { $addFields: { amountNum: { $toDouble: '$amount' } } },
      { $group: { _id: null, total: { $sum: '$amountNum' } } }
    ])
  ]);

  res.json({
    expenses,
    totalCount,
    monthlyTotal: totalAgg[0]?.total ?? 0
  });
};


export const createExpense = async (req, res) => {
  const expense = await Expense.create({ ...req.body, user: req.user.id })
  res.status(201).json(expense)
}

export const updateExpense = async (req, res) => {
  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  )
  if (!expense) return res.status(404).json({ error: 'Expense not found' })
  res.json(expense)
}

export const deleteExpense = async (req, res) => {
  const expense = await Expense.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id
  })
  if (!expense) return res.status(404).json({ error: 'Expense not found' })
  res.json({ message: 'Expense deleted' })
}

export const deleteMonthlyExpenses = async (req, res) => {
  const { year, month } = req.query
  if (!year || !month)
    return res.status(400).json({ error: 'Year and month required' })
  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 1)
  await Expense.deleteMany({
    user: req.user.id,
    timestamp: { $gte: start, $lt: end }
  })
  res.json({ message: 'Expenses deleted for specified month' })
}
