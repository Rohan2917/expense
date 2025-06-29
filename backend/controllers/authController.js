import bcrypt from 'bcryptjs'
import User from '../models/UserModel.js'
import { generateToken } from '../utils/generateToken.js'

export const registerUser = async (req, res) => {
  const { username, password } = req.body
  const user = await User.create({ username, password: await bcrypt.hash(password, 10) })
  const token = generateToken(user._id)
  res.json({ token, user: { id: user._id, username: user.username, role: user.role } })
}

export const loginUser = async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })
  if (!user) return res.status(401).json({ error: 'User not found' })
  if (!(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: 'Invalid password' })
  const token = generateToken(user._id)
  res.json({ token, user: { id: user._id, username: user.username, role: user.role } })
}

export const resetPassword = async (req, res) => {
  const { username, newPassword } = req.body
  const user = await User.findOne({ username })
  if (!user) return res.status(400).json({ error: 'User not found' })
  user.password = await bcrypt.hash(newPassword, 10)
  await user.save()
  res.json({ message: 'Password reset successful' })
}
