import { useState } from 'react'
import { useSelector } from 'react-redux'
import { createApiInstance } from '../../utils/api'
import { Container, TextField, Button, Typography, Box, MenuItem, Select } from '@mui/material'
import Layout from '../../components/Layout'
import { useRouter } from 'next/router'
import { categories } from '../../utils/constants'
import { useSnackbar } from 'notistack'
import Loader from '../../components/Loader'

export default () => {
  const { token } = useSelector(s => s.auth)
  const { enqueueSnackbar } = useSnackbar()
  const r = useRouter()
  const [l, setL] = useState(false)
  const [f, setF] = useState({ title: '', amount: '', description: '', datetime: '', category: 'Other' })

  const save = async e => {
    e.preventDefault()
    setL(true)
    await createApiInstance(token).post('/expenses', { title: f.title, amount: Number(f.amount), description: f.description, category: f.category, timestamp: f.datetime || new Date().toISOString() })
    enqueueSnackbar('Expense added', { variant: 'success' })
    setL(false)
    r.push('/expenses')
  }

  return (
    <Layout>
      <Loader open={l} />
      <Container maxWidth='sm'>
        <Typography variant='h4' align='center' sx={{ mb: 3 }}>
          Add Expense
        </Typography>
        <Box component='form' onSubmit={save} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label='Title' value={f.title} onChange={e => setF({ ...f, title: e.target.value })} required fullWidth />
          <TextField label='Amount' type='number' value={f.amount} onChange={e => setF({ ...f, amount: e.target.value })} required fullWidth />
          <Select value={f.category} onChange={e => setF({ ...f, category: e.target.value })} fullWidth>
            {Object.keys(categories).map(c => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
          <TextField label='Description' value={f.description} onChange={e => setF({ ...f, description: e.target.value })} multiline rows={3} fullWidth />
          <TextField label='Date & Time' type='datetime-local' value={f.datetime} onChange={e => setF({ ...f, datetime: e.target.value })} fullWidth InputLabelProps={{ shrink: true }} />
          <Button type='submit' variant='contained' size='large' fullWidth>
            Save
          </Button>
          <Button variant='outlined' onClick={() => r.push('/expenses')} fullWidth>
            Cancel
          </Button>
        </Box>
      </Container>
    </Layout>
  )
}
