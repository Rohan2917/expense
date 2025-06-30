import { useState } from 'react'
import { useSelector } from 'react-redux'
import { createApiInstance } from '../../utils/api'
import { Container, TextField, Button, Typography, Box, MenuItem, Select } from '@mui/material'
import Layout from '../../components/Layout'
import { useRouter } from 'next/router'
import { categories } from '../../utils/constants'
import { useSnackbar } from 'notistack'
import Loader from '../../components/Loader'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)
const TZ = 'Asia/Kolkata'

export default function AddExpense() {
  const { token } = useSelector(s => s.auth)
  const { enqueueSnackbar } = useSnackbar()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', amount: '', description: '', datetime: '', category: 'Other' })

  const save = async e => {
    e.preventDefault()
    setLoading(true)
    await createApiInstance(token).post('/expenses', { title: form.title, amount: Number(form.amount), description: form.description, category: form.category, timestamp: form.datetime || dayjs().tz(TZ).format() })
    enqueueSnackbar('Expense added', { variant: 'success' })
    setLoading(false)
    router.push('/expenses')
  }

  return (
    <Layout>
      <Loader open={loading} />
      <Container maxWidth='sm'>
        <Typography variant='h4' align='center' sx={{ mb: 3 }}>
          Add Expense
        </Typography>
        <Box component='form' onSubmit={save} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label='Title' value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required fullWidth />
          <TextField label='Amount' type='number' value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required fullWidth />
          <Select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} fullWidth>
            {Object.keys(categories).map(c => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
          <TextField label='Description' value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} multiline rows={3} fullWidth />
          <TextField label='Date & Time' type='datetime-local' value={form.datetime ? dayjs(form.datetime).tz(TZ).format('YYYY-MM-DDTHH:mm') : ''} onChange={e => setForm({ ...form, datetime: dayjs.tz(e.target.value, TZ).format() })} fullWidth InputLabelProps={{ shrink: true }} />
          <Button type='submit' variant='contained' size='large' fullWidth>
            Save
          </Button>
          <Button variant='outlined' onClick={() => router.push('/expenses')} fullWidth>
            Cancel
          </Button>
        </Box>
      </Container>
    </Layout>
  )
}
