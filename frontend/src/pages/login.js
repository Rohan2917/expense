import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setAuth } from '../store/authSlice'
import { Container, Card, CardContent, TextField, Button, Typography, Box, Link as MuiLink } from '@mui/material'
import api from '../utils/api'
import Link from 'next/link'
import { useRouter } from 'next/router'
export default function Login() {
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const [err, setErr] = useState('')
  const d = useDispatch()
  const r = useRouter()
  const go = async e => {
    e.preventDefault()
    try {
      const { data } = await api().post('/auth/login', { username: u, password: p })
      d(setAuth(data))
      r.push('/expenses')
    } catch {
      setErr('Invalid credentials')
    }
  }
  return (
    <Container maxWidth='sm' sx={{ mt: 10 }}>
      <Card>
        <CardContent>
          <Typography variant='h4' align='center'>
            Login
          </Typography>
          <Box component='form' onSubmit={go} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField label='Username' value={u} onChange={e => setU(e.target.value)} required />
            <TextField label='Password' type='password' value={p} onChange={e => setP(e.target.value)} required />
            {err && <Typography color='error'>{err}</Typography>}
            <Button variant='contained' type='submit'>
              Enter
            </Button>
            <Link href='/forgot-password' passHref legacyBehavior>
              <MuiLink underline='none' sx={{ alignSelf: 'center' }}>
                Forgot Password?
              </MuiLink>
            </Link>
            <Link href='/signup' passHref legacyBehavior>
              <MuiLink underline='none' sx={{ alignSelf: 'center' }}>
                Create Account
              </MuiLink>
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}
