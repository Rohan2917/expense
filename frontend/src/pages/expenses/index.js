import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { retrieveExpenses } from '../../store/slices/expenseSlice.js'
import { clearAuthentication } from '../../store/slices/authSlice'
import { Container, Typography, Button, Box, Card, CardContent } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { Add, Logout } from '@mui/icons-material'
import ExpenseCard from '../../components/ExpenseCard'
import Loader from '../../components/Loader'
import { useSnackbar } from 'notistack'

dayjs.extend(utc)

export default function ExpensesPage() {
  const { token } = useSelector(s => s.auth)
  const items = useSelector(s => s.expenses.items)
  const dispatch = useDispatch()
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const [fromDate, setFromDate] = useState(dayjs().utc().startOf('day'))
  const [toDate, setToDate] = useState(dayjs().utc().endOf('day'))
  const [loading, setLoading] = useState(false)

  const loadExpenses = () => {
    setLoading(true)
    dispatch(retrieveExpenses({ from: fromDate.toISOString(), to: toDate.toISOString() }))
      .unwrap()
      .catch(e => enqueueSnackbar(e, { variant: 'error' }))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!token) {
      router.push('/login')
    } else {
      loadExpenses()
    }
  }, [token, fromDate, toDate])

  const totalAmount = items.reduce((s, x) => s + x.amount, 0)

  return (
    <Layout>
      <Loader open={loading} />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth='md'>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Button
              variant='contained'
              color='secondary'
              startIcon={<Logout />}
              onClick={() => {
                dispatch(clearAuthentication())
                router.push('/login')
              }}
            >
              Logout
            </Button>
            <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
              Expense Tracker
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'center' }}>
            <DatePicker label='From Date' value={fromDate} onChange={d => setFromDate(dayjs(d).utc().startOf('day'))} slotProps={{ textField: { size: 'small' } }} />
            <DatePicker label='To Date' value={toDate} onChange={d => setToDate(dayjs(d).utc().endOf('day'))} slotProps={{ textField: { size: 'small' } }} />
            <Button variant='contained' color='primary' startIcon={<Add />} onClick={() => router.push('/expenses/add')} sx={{ ml: 'auto' }}>
              Add Expense
            </Button>
          </Box>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant='h6' align='center'>
                Total Expenses: ₹{totalAmount.toLocaleString('en-IN')}
              </Typography>
            </CardContent>
          </Card>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {items.map(i => (
              <ExpenseCard key={i._id} expense={i} color='#00adb5' />
            ))}
            {items.length === 0 && (
              <Typography variant='h6' align='center' sx={{ mt: 4 }}>
                No expenses found
              </Typography>
            )}
          </Box>
        </Container>
      </LocalizationProvider>
    </Layout>
  )
}
