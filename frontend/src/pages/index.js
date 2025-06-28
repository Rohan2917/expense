import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  const { token, role } = useSelector(s => s.auth)
  useEffect(() => {
    if (token) router.replace(role === 'admin' ? '/admin' : '/expenses')
    else router.replace('/login')
  }, [token, role])
  return null
}
