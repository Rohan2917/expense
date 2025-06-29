import jwt from 'jsonwebtoken'
export default (req, _res, next) => {
  const token = (req.headers.authorization || '').split(' ')[1]
  if (!token) return next(new Error('unauth'))
  req.user = jwt.verify(token, process.env.JWT_SECRET)
  next()
}
