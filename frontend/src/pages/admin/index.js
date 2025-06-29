import { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setAdminFilter } from '../../store/slices/filterSlice'
import { Box, Select, MenuItem, Typography, Container, Card, CardContent, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import Layout from '../../components/Layout'
import { createApiInstance } from '../../utils/api'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import Loader from '../../components/Loader'
import { categories } from '../../utils/constants'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

export default () => {
  const { token } = useSelector(s => s.auth)
  const f = useSelector(s => s.filters.admin)
  const dispatch = useDispatch()
  const router = useRouter()
  const [rows, setRows] = useState([])
  const [dayTotal, setDayTotal] = useState(0)
  const [monthTotal, setMonthTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [dlg, setDlg] = useState({ open: false, item: null })

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const fetchExpenses = async () => {
    setLoading(true)
    try {
      const res = await createApiInstance(token).get('/expenses/admin', { params: f })
      setRows(res.data.expenses)
      setDayTotal(res.data.dayTotal || 0)
      setMonthTotal(res.data.monthTotal || 0)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchExpenses()
    else router.replace('/login')
  }, [token, f])

  const gridRows = useMemo(
    () =>
      rows.map(x => ({
        id: x._id,
        title: x.title,
        date: dayjs(x.timestamp).format('DD MMM'),
        time: dayjs(x.timestamp).format('h:mm A'),
        amount: `₹${x.amount.toLocaleString('en-IN')}`,
        category: x.category,
        src: x
      })),
    [rows]
  )

  const cols = [
    { field: 'title', headerName: 'Title', flex: 1, minWidth: 120 },
    { field: 'date', headerName: 'Date', flex: 0.6, minWidth: 100 },
    { field: 'time', headerName: 'Time', flex: 0.6, minWidth: 100 },
    { field: 'amount', headerName: 'Amount', flex: 0.8, minWidth: 120 },
    { field: 'category', headerName: 'Category', flex: 0.8, minWidth: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.6,
      minWidth: 110,
      sortable: false,
      renderCell: params => (
        <>
          <IconButton color='primary' size='small' onClick={() => setDlg({ open: true, item: { ...params.row.src } })}>
            <EditIcon fontSize='small' />
          </IconButton>
          <IconButton color='error' size='small' onClick={() => erase(params.row.id)}>
            <DeleteIcon fontSize='small' />
          </IconButton>
        </>
      )
    }
  ]

  const erase = async id => {
    setLoading(true)
    await createApiInstance(token).delete(`/expenses/${id}`)
    await fetchExpenses()
  }

  const eraseMonth = async () => {
    setLoading(true)
    await createApiInstance(token).delete('/expenses/delete-month', {
      params: { year: f.year, month: f.month }
    })
    await fetchExpenses()
  }

  const save = async () => {
    const item = dlg.item
    setLoading(true)
    await createApiInstance(token).put(`/expenses/${item._id}`, {
      title: item.title,
      amount: Number(item.amount),
      description: item.description,
      category: item.category,
      timestamp: item.timestamp
    })
    setDlg({ open: false, item: null })
    await fetchExpenses()
  }

  return (
    <Layout>
      <Loader open={loading} />
      <Container maxWidth='xl'>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
          <Select size='small' value={f.year} onChange={e => dispatch(setAdminFilter({ year: e.target.value }))}>
            {Array.from({ length: 20 }, (_, i) => dayjs().year() - 10 + i).map(y => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
          <Select size='small' value={f.month} onChange={e => dispatch(setAdminFilter({ month: e.target.value }))}>
            {months.map((m, i) => (
              <MenuItem key={m} value={i + 1}>
                {m}
              </MenuItem>
            ))}
          </Select>
          <Select size='small' value={f.day} onChange={e => dispatch(setAdminFilter({ day: e.target.value }))}>
            {Array.from({ length: dayjs(`${f.year}-${f.month}-01`).daysInMonth() }, (_, i) => i + 1).map(n => (
              <MenuItem key={n} value={n}>
                {n}
              </MenuItem>
            ))}
          </Select>
          <Select size='small' value={f.category} onChange={e => dispatch(setAdminFilter({ category: e.target.value }))}>
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

        {/* <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography align='center'>Day Total: ₹{dayTotal.toLocaleString('en-IN')}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ mb: 3, background: 'primary.main', color: '#fff' }}>
          <CardContent>
            <Typography align='center'>Month Total: ₹{monthTotal.toLocaleString('en-IN')}</Typography>
          </CardContent>
        </Card> */}

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
              <TextField type='datetime-local' value={dayjs(dlg.item.timestamp).format('YYYY-MM-DDTHH:mm')} onChange={e => setDlg(d => ({ ...d, item: { ...d.item, timestamp: new Date(e.target.value).toISOString() } }))} InputLabelProps={{ shrink: true }} />
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
