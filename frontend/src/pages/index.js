import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
export default function Index() {
  const router = useRouter()
  const token = useSelector(s => s.auth.token)
  useEffect(() => {
    router.replace(token ? '/expenses' : '/login')
  }, [token])
  return null
}
