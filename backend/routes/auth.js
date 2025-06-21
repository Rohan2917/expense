import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
const router = express.Router()
const tokenOf = id => jwt.sign({ id }, process.env.JWT_SECRET)
router.post('/signup', async (req, res) => {
  const { username, password } = req.body
  const exists = await User.findOne({ username })
  if (exists) return res.sendStatus(409)
  const user = await User.create({ username, password: await bcrypt.hash(password, 10) })
  res.json({ token: tokenOf(user._id), username })
})
router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })
  if (!user) return res.sendStatus(401)
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.sendStatus(401)
  res.json({ token: tokenOf(user._id), username })
})
router.post('/reset-password', async (req, res) => {
  const { username, newPassword } = req.body
  const user = await User.findOne({ username })
  if (!user) return res.sendStatus(404)
  user.password = await bcrypt.hash(newPassword, 10)
  await user.save()
  res.sendStatus(204)
})
export default router
