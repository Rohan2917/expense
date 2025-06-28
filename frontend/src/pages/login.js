import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setAuthentication } from '../store/slices/authSlice'
import { Container, Card, CardContent, TextField, Button, Typography, Box } from '@mui/material'
import { createApiInstance } from '../utils/api'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import Loader from '../components/Loader'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  const handleLogin = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await createApiInstance().post('/auth/login', { username, password })
      dispatch(setAuthentication(data))
      enqueueSnackbar('Login successful', { variant: 'success' })
      router.push(data.user.role === 'admin' ? '/admin' : '/expenses')
    } catch {
      enqueueSnackbar('Invalid credentials', { variant: 'error' })
    }
    setLoading(false)
  }

  return (
    <Container maxWidth='sm'>
      <Loader open={loading} />
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant='h3' sx={{ background: 'linear-gradient(45deg, #1976d2, #4caf50)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold', mb: 1 }}>
          Expense Tracker
        </Typography>
        <Typography variant='h5'>Login to Your Account</Typography>
      </Box>
      <Card elevation={3}>
        <CardContent>
          <Box component='form' onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label='Username' value={username} onChange={e => setUsername(e.target.value)} required fullWidth />
            <TextField label='Password' type='password' value={password} onChange={e => setPassword(e.target.value)} required fullWidth />
            <Button type='submit' variant='contained' size='large' fullWidth>
              Login
            </Button>
            <Button onClick={() => router.push('/signup')}>Create Account</Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}
