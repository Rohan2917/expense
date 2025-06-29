import { useState } from 'react'
import { Container, Card, CardContent, TextField, Button, Typography, Box } from '@mui/material'
import { createApiInstance } from '../utils/api'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import Loader from '../components/Loader'

export default () => {
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const [l, setL] = useState(false)
  const r = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  const go = async e => {
    e.preventDefault()
    setL(true)
    try {
      await createApiInstance().post('/auth/reset-password', { username: u, newPassword: p })
      enqueueSnackbar('Password reset', { variant: 'success' })
      setTimeout(() => r.push('/login'), 1500)
    } catch {
      enqueueSnackbar('User not found', { variant: 'error' })
    }
    setL(false)
  }

  return (
    <Container maxWidth='sm' sx={{ mt: 10 }}>
      <Loader open={l} />
      <Card>
        <CardContent>
          <Typography variant='h4' align='center'>
            Reset Password
          </Typography>
          <Box component='form' onSubmit={go} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField label='Username' value={u} onChange={e => setU(e.target.value)} required />
            <TextField label='New Password' type='password' value={p} onChange={e => setP(e.target.value)} required />
            <Button variant='contained' type='submit'>
              Reset
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}
