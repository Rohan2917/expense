import Expense from '../models/ExpenseModel.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'

dayjs.extend(utc)
dayjs.extend(timezone)

const TZ = 'Asia/Kolkata'

const parseISO = v => (!v || isNaN(Date.parse(v)) ? null : new Date(v))
const stampIST = t => dayjs.tz(t, TZ)
const ymd = (y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`

export const getExpenses = async (req, res) => {
  const { from, to, category } = req.query
  const filter = { user: req.user.id }
  const gte = parseISO(from)
  const lte = parseISO(to)
  if (gte && lte) filter.timestamp = { $gte: gte, $lte: lte }
  if (category && category !== 'All') filter.category = category
  const data = await Expense.find(filter).sort({ timestamp: -1 })
  res.json(data)
}

export const getExpensesAdmin = async (req, res) => {
  const now = dayjs().tz(TZ)
  const y = Number(req.query.year) || now.year()
  const m1 = Number(req.query.month) || now.month() + 1
  const moStart = stampIST(ymd(y, m1, 1)).startOf('day').toDate()
  const moEnd = stampIST(ymd(y, m1, 1)).add(1, 'month').startOf('day').toDate()

  let dayTotal = 0
  const base = { user: req.user.id }
  if (req.query.category && req.query.category !== 'All') base.category = req.query.category

  const monthAgg = await Expense.aggregate([{ $match: { ...base, timestamp: { $gte: moStart, $lt: moEnd } } }, { $group: { _id: null, total: { $sum: '$amount' } } }])
  const monthTotal = monthAgg[0]?.total || 0

  const d = Number(req.query.day)
  let range = { ...base, timestamp: { $gte: moStart, $lt: moEnd } }
  if (Number.isFinite(d) && d > 0) {
    const ds = stampIST(ymd(y, m1, d)).startOf('day').toDate()
    const de = stampIST(ymd(y, m1, d)).endOf('day').toDate()
    range = { ...base, timestamp: { $gte: ds, $lte: de } }
    const dayAgg = await Expense.aggregate([{ $match: range }, { $group: { _id: null, total: { $sum: '$amount' } } }])
    dayTotal = dayAgg[0]?.total || 0
  }

  const expenses = await Expense.find(range).sort({ timestamp: -1 })
  res.json({ dayTotal, monthTotal, expenses })
}

const safeStamp = v => {
  const t = stampIST(v || undefined)
  return t.isValid() ? t.toDate() : new Date()
}

export const createExpense = async (req, res) => {
  const doc = { ...req.body, timestamp: safeStamp(req.body.timestamp), user: req.user.id }
  res.status(201).json(await Expense.create(doc))
}

export const updateExpense = async (req, res) => {
  const patch = { ...req.body }
  if ('timestamp' in patch) patch.timestamp = safeStamp(patch.timestamp)
  const out = await Expense.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, patch, { new: true })
  res.json(out)
}

export const deleteExpense = async (req, res) => {
  const ok = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id })
  res.json(ok)
}

export const deleteMonth = async (req, res) => {
  const now = dayjs().tz(TZ)
  const y = Number(req.query.year) || now.year()
  const m1 = Number(req.query.month) || now.month() + 1
  const s = stampIST(ymd(y, m1, 1)).startOf('day').toDate()
  const e = stampIST(ymd(y, m1, 1)).add(1, 'month').startOf('day').toDate()
  await Expense.deleteMany({ user: req.user.id, timestamp: { $gte: s, $lt: e } })
  res.json({ ok: true })
}
