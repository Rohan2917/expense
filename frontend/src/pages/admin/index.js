import { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setAdminFilter } from '../../store/slices/filterSlice'
import { Box, Select, MenuItem, Container, Card, CardContent, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { createApiInstance } from '../../utils/api'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import Loader from '../../components/Loader'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { categories } from '../../utils/constants'

dayjs.extend(utc)
dayjs.extend(timezone)
const TZ = 'Asia/Kolkata'
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function AdminExpensePage() {
  const { token } = useSelector(s => s.auth)
  const filter = useSelector(s => s.filters.admin)
  const dispatch = useDispatch()
  const router = useRouter()
  const [rows, setRows] = useState([])
  const [dayTotal, setDayTotal] = useState(0)
  const [monthTotal, setMonthTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [dlg, setDlg] = useState({ open: false, item: null })

  const params = () => {
    const p = { year: filter.year, month: filter.month }
    if (filter.day) p.day = filter.day
    if (filter.category && filter.category !== 'All') p.category = filter.category
    return p
  }

  const fetchData = async () => {
    setLoading(true)
    const res = await createApiInstance(token).get('/expenses/admin', { params: params() })
    setRows(res.data.expenses)
    setDayTotal(res.data.dayTotal)
    setMonthTotal(res.data.monthTotal)
    setLoading(false)
  }

  useEffect(() => {
    token ? fetchData() : router.replace('/login')
  }, [token, filter])

  const gridRows = useMemo(
    () =>
      rows.map(r => {
        const t = dayjs(r.timestamp).add(5, 'hour').add(30, 'minute')
        return {
          id: r._id,
          title: r.title,
          date: t.format('DD MMM'),
          time: t.format('h:mm A'),
          amount: `₹${r.amount.toLocaleString('en-IN')}`,
          category: r.category,
          src: r
        }
      }),
    [rows]
  )

  const cols = [
    { field: 'title', flex: 1, headerName: 'Title', minWidth: 120 },
    { field: 'date', flex: 0.7, headerName: 'Date', minWidth: 100 },
    { field: 'time', flex: 0.7, headerName: 'Time', minWidth: 100 },
    { field: 'amount', flex: 0.8, headerName: 'Amount', minWidth: 120 },
    { field: 'category', flex: 0.8, headerName: 'Category', minWidth: 120 },
    {
      field: 'actions',
      flex: 0.6,
      headerName: 'Actions',
      minWidth: 110,
      sortable: false,
      renderCell: p => (
        <>
          <IconButton size='small' color='primary' onClick={() => setDlg({ open: true, item: { ...p.row.src } })}>
            <EditIcon fontSize='small' />
          </IconButton>
          <IconButton size='small' color='error' onClick={() => erase(p.row.id)}>
            <DeleteIcon fontSize='small' />
          </IconButton>
        </>
      )
    }
  ]

  const erase = async id => {
    setLoading(true)
    await createApiInstance(token).delete(`/expenses/${id}`)
    await fetchData()
  }

  const eraseMonth = async () => {
    setLoading(true)
    await createApiInstance(token).delete('/expenses/delete-month', { params: { year: filter.year, month: filter.month } })
    await fetchData()
  }

  const save = async () => {
    const it = dlg.item
    setLoading(true)
    await createApiInstance(token).put(`/expenses/${it._id}`, { ...it, amount: Number(it.amount) })
    setDlg({ open: false, item: null })
    await fetchData()
  }

  return (
    <Layout>
      <Loader open={loading} />
      <Container maxWidth='xl'>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
          <Select size='small' value={filter.year} onChange={e => dispatch(setAdminFilter({ year: e.target.value }))}>
            {Array.from({ length: 20 }, (_, i) => dayjs().year() - 10 + i).map(y => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
          <Select size='small' value={filter.month} onChange={e => dispatch(setAdminFilter({ month: e.target.value }))}>
            {months.map((m, i) => (
              <MenuItem key={m} value={i + 1}>
                {m}
              </MenuItem>
            ))}
          </Select>
          <Select size='small' value={filter.day} onChange={e => dispatch(setAdminFilter({ day: e.target.value }))}>
            <MenuItem value=''>All Days</MenuItem>
            {Array.from({ length: dayjs(`${filter.year}-${filter.month}-01`).daysInMonth() }, (_, i) => i + 1).map(d => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </Select>
          <Select size='small' value={filter.category} onChange={e => dispatch(setAdminFilter({ category: e.target.value }))}>
            <MenuItem value='All'>All</MenuItem>
            {Object.keys(categories).map(c => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
          <Button variant='contained' color='error' onClick={eraseMonth}>
            Delete Month
          </Button>
        </Box>
        {/* <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent>
              <Typography align='center'>Day Total ₹{dayTotal.toLocaleString('en-IN')}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent>
              <Typography align='center'>Month Total ₹{monthTotal.toLocaleString('en-IN')}</Typography>
            </CardContent>
          </Card>
        </Box> */}
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid rows={gridRows} columns={cols} disableRowSelectionOnClick slots={{ toolbar: GridToolbar }} />
        </Box>
      </Container>
      <Dialog open={dlg.open} onClose={() => setDlg({ open: false, item: null })} fullWidth maxWidth='sm'>
        {dlg.item && (
          <>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField label='Title' value={dlg.item.title} onChange={e => setDlg(d => ({ ...d, item: { ...d.item, title: e.target.value } }))} />
              <TextField label='Amount' type='number' value={dlg.item.amount} onChange={e => setDlg(d => ({ ...d, item: { ...d.item, amount: e.target.value } }))} />
              <TextField label='Description' value={dlg.item.description || ''} onChange={e => setDlg(d => ({ ...d, item: { ...d.item, description: e.target.value } }))} />
              <Select value={dlg.item.category} onChange={e => setDlg(d => ({ ...d, item: { ...d.item, category: e.target.value } }))}>
                {Object.keys(categories).map(c => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
              <TextField type='datetime-local' value={dayjs(dlg.item.timestamp).tz(TZ).format('YYYY-MM-DDTHH:mm')} onChange={e => setDlg(d => ({ ...d, item: { ...d.item, timestamp: dayjs.tz(e.target.value, TZ).format() } }))} InputLabelProps={{ shrink: true }} />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDlg({ open: false, item: null })}>Cancel</Button>
              <Button variant='contained' onClick={save}>
                Save
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Layout>
  )
}
