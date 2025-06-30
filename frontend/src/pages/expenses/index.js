import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { retrieveExpenses } from '../../store/slices/expenseSlice'
import { setExpenseFilter } from '../../store/slices/filterSlice'
import { Container, Typography, Button, Box, Select, MenuItem, Card, CardContent } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { Add } from '@mui/icons-material'
import ExpenseCard from '../../components/ExpenseCard'
import Loader from '../../components/Loader'
import { categories } from '../../utils/constants'

dayjs.extend(utc)
dayjs.extend(timezone)
const TZ = 'Asia/Kolkata'

export default function ExpensePage() {
  const { token } = useSelector(s => s.auth)
  const { items } = useSelector(s => s.expenses)
  const filter = useSelector(s => s.filters.expense)
  const dispatch = useDispatch()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const load = () => {
    setLoading(true)
    dispatch(retrieveExpenses())
      .unwrap()
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    token ? load() : router.replace('/login')
  }, [token, filter])

  const total = items.reduce((s, x) => s + x.amount, 0)
  const iso = (v, end = false) => dayjs.tz(v, TZ)[end ? 'endOf' : 'startOf']('day').toISOString()

  return (
    <Layout>
      <Loader open={loading} />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth='md'>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            <DatePicker label='From' value={filter.from ? dayjs(filter.from) : null} onChange={v => v && dispatch(setExpenseFilter({ from: iso(v) }))} slotProps={{ textField: { size: 'small' } }} />
            <DatePicker label='To' value={filter.to ? dayjs(filter.to) : null} onChange={v => v && dispatch(setExpenseFilter({ to: iso(v, true) }))} slotProps={{ textField: { size: 'small' } }} />
            <Select size='small' value={filter.category} onChange={e => dispatch(setExpenseFilter({ category: e.target.value }))}>
              <MenuItem value='All'>All</MenuItem>
              {Object.keys(categories).map(c => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
            <Button sx={{ ml: 'auto' }} variant='contained' startIcon={<Add />} onClick={() => router.push('/expenses/add')}>
              Add
            </Button>
          </Box>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography align='center'>Total ₹{total.toLocaleString('en-IN')}</Typography>
            </CardContent>
          </Card>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {items
              .slice()
              .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
              .map(i => (
                <ExpenseCard key={i._id} expense={i} color='#00adb5' />
              ))}
            {items.length === 0 && <Typography align='center'>No expenses</Typography>}
          </Box>
        </Container>
      </LocalizationProvider>
    </Layout>
  )
}
