import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setAuthentication } from '../store/slices/authSlice'
import { Container, Card, CardContent, TextField, Button, Typography, Box } from '@mui/material'
import { createApiInstance } from '../utils/api'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import Loader from '../components/Loader'

export default () => {
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const [l, setL] = useState(false)
  const d = useDispatch()
  const r = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  const go = async e => {
    e.preventDefault()
    setL(true)
    try {
      const { data } = await createApiInstance().post('/auth/login', { username: u, password: p })
      d(setAuthentication(data))
      enqueueSnackbar('Login successful', { variant: 'success' })
      r.push(data.user.role === 'admin' ? '/admin' : '/expenses')
    } catch {
      enqueueSnackbar('Invalid credentials', { variant: 'error' })
    }
    setL(false)
  }

  return (
    <Container maxWidth='sm'>
      <Loader open={l} />
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant='h3' sx={{ background: 'linear-gradient(45deg,#1976d2,#4caf50)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>
          Expense Tracker
        </Typography>
        <Typography variant='h5'>Login</Typography>
      </Box>
      <Card elevation={3}>
        <CardContent>
          <Box component='form' onSubmit={go} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label='Username' value={u} onChange={e => setU(e.target.value)} required fullWidth />
            <TextField label='Password' type='password' value={p} onChange={e => setP(e.target.value)} required fullWidth />
            <Button type='submit' variant='contained' size='large' fullWidth>
              Login
            </Button>
            <Button onClick={() => r.push('/signup')}>Sign Up</Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}
