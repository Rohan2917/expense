import { useState } from 'react'
import { Container, Card, CardContent, TextField, Button, Typography, Box } from '@mui/material'
import { createApiInstance } from '../utils/api'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import Loader from '../components/Loader'

export default function ForgotPassword() {
  const [username, setUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  const handleReset = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await createApiInstance().post('/auth/reset-password', { username, newPassword })
      enqueueSnackbar('Password reset', { variant: 'success' })
      setTimeout(() => router.push('/login'), 1500)
    } catch {
      enqueueSnackbar('User not found', { variant: 'error' })
    }
    setLoading(false)
  }

  return (
    <Container maxWidth='sm' sx={{ mt: 10 }}>
      <Loader open={loading} />
      <Card>
        <CardContent>
          <Typography variant='h4' align='center'>
            Reset Password
          </Typography>
          <Box component='form' onSubmit={handleReset} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField label='Username' value={username} onChange={e => setUsername(e.target.value)} required />
            <TextField label='New Password' type='password' value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            <Button variant='contained' type='submit'>
              Reset
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}
