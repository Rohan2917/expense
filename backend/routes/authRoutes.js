import express from 'express'
import { loginUser, registerUser, resetPassword } from '../controllers/authController.js'
const r = express.Router()
r.post('/register', registerUser)
r.post('/login', loginUser)
r.post('/reset-password', resetPassword)
export default r
