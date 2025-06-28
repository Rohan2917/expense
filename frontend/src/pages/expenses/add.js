import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createNewExpense } from '../../store/slices/expenseSlice'
import { Container, TextField, Button, Typography, Box, MenuItem, Select } from '@mui/material'
import Layout from '../../components/Layout'
import { useRouter } from 'next/router'
import { categories } from '../../utils/constants'
import { useSnackbar } from 'notistack'
import Loader from '../../components/Loader'

export default function AddExpensePage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [datetime, setDatetime] = useState('')
  const [category, setCategory] = useState('Other')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    if (!title || !amount) return
    setLoading(true)
    await dispatch(createNewExpense({ title, amount: Number(amount), description, timestamp: datetime || new Date().toISOString(), category })).unwrap()
    enqueueSnackbar('Expense added', { variant: 'success' })
    setLoading(false)
    router.push('/expenses')
  }

  return (
    <Layout>
      <Loader open={loading} />
      <Container maxWidth='sm'>
        <Typography variant='h4' align='center' sx={{ mb: 3 }}>
          Add New Expense
        </Typography>
        <Box component='form' onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label='Title' value={title} onChange={e => setTitle(e.target.value)} required fullWidth />
          <TextField label='Amount' type='number' value={amount} onChange={e => setAmount(e.target.value)} required fullWidth />
          <Select value={category} onChange={e => setCategory(e.target.value)} fullWidth>
            {Object.keys(categories).map(c => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
          <TextField label='Description' value={description} onChange={e => setDescription(e.target.value)} multiline rows={3} fullWidth />
          <TextField label='Date & Time' type='datetime-local' value={datetime} onChange={e => setDatetime(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
          <Button type='submit' variant='contained' size='large' fullWidth>
            Save Expense
          </Button>
          <Button variant='outlined' onClick={() => router.push('/expenses')} fullWidth>
            Cancel
          </Button>
        </Box>
      </Container>
    </Layout>
  )
}
