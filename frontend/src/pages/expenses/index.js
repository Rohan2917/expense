import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { retrieveExpenses } from '../../store/slices/expenseSlice'
import { setExpenseFilter } from '../../store/slices/filterSlice'
import { Container, Typography, Button, Box, Select, MenuItem, Card, CardContent } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { Add } from '@mui/icons-material'
import ExpenseCard from '../../components/ExpenseCard'
import Loader from '../../components/Loader'
import { categories } from '../../utils/constants'
dayjs.extend(utc)

export default () => {
  const { token } = useSelector(s => s.auth)
  const { items } = useSelector(s => s.expenses)
  const f = useSelector(s => s.filters.expense)
  const d = useDispatch()
  const r = useRouter()
  const [loadState, setLoadState] = useState(false)

  const load = () => {
    setLoadState(true)
    d(retrieveExpenses())
      .unwrap()
      .finally(() => setLoadState(false))
  }

  useEffect(() => {
    token ? load() : r.replace('/login')
  }, [token, f])

  const total = items.reduce((s, x) => s + x.amount, 0)

  return (
    <Layout>
      <Loader open={loadState} />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth='md'>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            <DatePicker label='From' value={dayjs(f.from)} onChange={v => v && v.isValid() && d(setExpenseFilter({ from: v.utc().startOf('day').toISOString() }))} slotProps={{ textField: { size: 'small' } }} />
            <DatePicker label='To' value={dayjs(f.to)} onChange={v => v && v.isValid() && d(setExpenseFilter({ to: v.utc().endOf('day').toISOString() }))} slotProps={{ textField: { size: 'small' } }} />
            <Select size='small' value={f.category} onChange={e => d(setExpenseFilter({ category: e.target.value }))}>
              <MenuItem value='All'>All</MenuItem>
              {Object.keys(categories).map(c => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
            <Button sx={{ ml: 'auto' }} variant='contained' startIcon={<Add />} onClick={() => r.push('/expenses/add')}>
              Add
            </Button>
          </Box>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography align='center'>Total: ₹{total.toLocaleString('en-IN')}</Typography>
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
