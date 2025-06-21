import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setAuth } from '../store/authSlice'
import { Container, Card, CardContent, TextField, Button, Typography, Box } from '@mui/material'
import api from '../utils/api'
import { useRouter } from 'next/router'

export default function Signup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const dispatch = useDispatch()
  const router = useRouter()

  const handleSignup = async e => {
    e.preventDefault()
    setError('') // Clear previous error

    try {
      const { data } = await api().post('/auth/signup', {
        username,
        password
      })

      dispatch(setAuth(data))
      router.push('/expenses')
    } catch (err) {
      setError('User already exists')
    }
  }

  return (
    <Container maxWidth='sm' sx={{ mt: 10 }}>
      <Card>
        <CardContent>
          <Typography variant='h4' align='center'>
            Sign Up
          </Typography>
          <Box component='form' onSubmit={handleSignup} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField label='Username' value={username} onChange={e => setUsername(e.target.value)} required />
            <TextField label='Password' type='password' value={password} onChange={e => setPassword(e.target.value)} required />
            {error && <Typography color='error'>{error}</Typography>}
            <Button variant='contained' type='submit'>
              Create
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}
