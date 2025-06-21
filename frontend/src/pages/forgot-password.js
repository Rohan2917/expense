import { useState } from 'react'
import { Container, Card, CardContent, TextField, Button, Typography, Box } from '@mui/material'
import api from '../utils/api'
import { useRouter } from 'next/router'
export default function ForgotPassword() {
  const [u, setU] = useState('')
  const [n, setN] = useState('')
  const [rmsg, setR] = useState('')
  const r = useRouter()
  const go = async e => {
    e.preventDefault()
    try {
      await api().post('/auth/reset-password', { username: u, newPassword: n })
      setR('Password reset')
      setTimeout(() => r.push('/login'), 1500)
    } catch {
      setR('User not found')
    }
  }
  return (
    <Container maxWidth='sm' sx={{ mt: 10 }}>
      <Card>
        <CardContent>
          <Typography variant='h4' align='center'>
            Reset Password
          </Typography>
          <Box component='form' onSubmit={go} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField label='Username' value={u} onChange={e => setU(e.target.value)} required />
            <TextField label='New Password' type='password' value={n} onChange={e => setN(e.target.value)} required />
            {rmsg && <Typography color='primary'>{rmsg}</Typography>}
            <Button variant='contained' type='submit'>
              Reset
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}
