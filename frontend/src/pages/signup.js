import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setAuthentication } from '../store/slices/authSlice'
import { Container, Card, CardContent, TextField, Button, Typography, Box } from '@mui/material'
import { createApiInstance } from '../utils/api'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import Loader from '../components/Loader'

export default function Signup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  const handleSignup = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await createApiInstance().post('/auth/register', { username, password })
      dispatch(setAuthentication(data))
      enqueueSnackbar('Account created', { variant: 'success' })
      router.push('/expenses')
    } catch {
      enqueueSnackbar('User already exists', { variant: 'error' })
    }
    setLoading(false)
  }

  return (
    <Container maxWidth='sm' sx={{ mt: 10 }}>
      <Loader open={loading} />
      <Card>
        <CardContent>
          <Typography variant='h4' align='center'>
            Sign Up
          </Typography>
          <Box component='form' onSubmit={handleSignup} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField label='Username' value={username} onChange={e => setUsername(e.target.value)} required />
            <TextField label='Password' type='password' value={password} onChange={e => setPassword(e.target.value)} required />
            <Button variant='contained' type='submit'>
              Create
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}
