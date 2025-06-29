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
      const { data } = await createApiInstance().post('/auth/register', { username: u, password: p })
      d(setAuthentication(data))
      enqueueSnackbar('Account created', { variant: 'success' })
      r.push('/expenses')
    } catch {
      enqueueSnackbar('User exists', { variant: 'error' })
    }
    setL(false)
  }

  return (
    <Container maxWidth='sm' sx={{ mt: 10 }}>
      <Loader open={l} />
      <Card>
        <CardContent>
          <Typography variant='h4' align='center'>
            Sign Up
          </Typography>
          <Box component='form' onSubmit={go} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField label='Username' value={u} onChange={e => setU(e.target.value)} required />
            <TextField label='Password' type='password' value={p} onChange={e => setP(e.target.value)} required />
            <Button variant='contained' type='submit'>
              Create
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}
