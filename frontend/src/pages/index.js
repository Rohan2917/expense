import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
export default () => {
  const { token, role } = useSelector(s => s.auth)
  const r = useRouter()
  useEffect(() => {
    if (token) r.replace(role === 'admin' ? '/admin' : '/expenses')
    else r.replace('/login')
  }, [token, role])
  return null
}
