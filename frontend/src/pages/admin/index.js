import { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Box, Button, Card, CardContent, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Pagination, Select, Stack, TextField, Typography, useMediaQuery } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import FlightIcon from '@mui/icons-material/Flight'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import dayjs from 'dayjs'
import Layout from '../../components/Layout'
import { createApiInstance } from '../../utils/api'
import Loader from '../../components/Loader'
import { useSnackbar } from 'notistack'
import '@fontsource/poppins'

const categoryIcons = {
  Food: RestaurantIcon,
  Travel: FlightIcon,
  Shopping: ShoppingCartIcon,
  Other: AttachMoneyIcon
}

export default function AdminDashboardPage() {
  const { token } = useSelector(s => s.auth)
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [day, setDay] = useState(now.getDate())
  const [initialized, setInitialized] = useState(false)
  const [items, setItems] = useState([])
  const [monthlyTotal, setMonthlyTotal] = useState(0)
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [editOpen, setEditOpen] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const isMobile = useMediaQuery('(max-width:600px)')

  const fetchData = async () => {
    if (!year || !month || !day) return
    setLoading(true)
    const from = new Date(year, month - 1, day)
    const to = new Date(from)
    to.setDate(to.getDate() + 1)
    const qs = new URLSearchParams({ from: from.toISOString(), to: to.toISOString() })
    const { data } = await createApiInstance(token).get(`/expenses/admin?${qs}`)
    setItems(data.expenses || [])
    console.log('tt= ', data)
    setMonthlyTotal(data.monthlyTotal ?? 0)
    setLoading(false)
  }

  useEffect(() => {
    if (token) fetchData()
  }, [token, year, month, day])

  useEffect(() => {
    const maxDay = dayjs(`${year}-${month}-01`).daysInMonth()
    if (day > maxDay) setDay(maxDay)
    else if (initialized) setDay(1)
    else setInitialized(true)
  }, [year, month])

  const months = useMemo(() => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], [])
  const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth()
  const rows = items.map(x => ({
    ...x,
    id: x._id || '-', // Required by DataGrid
    title: x.title || '-',
    description: x.description || '-',
    category: x.category || '-',
    date: x.timestamp ? dayjs(x.timestamp).format('DD MMM') : '-',
    time: x.timestamp ? dayjs(x.timestamp).format('h:mm A') : '-',
    amount: x.amount != null ? `₹${Number(x.amount).toLocaleString('en-IN')}` : '-'
  }))

  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      minWidth: 120,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 0.5,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'time',
      headerName: 'Time',
      flex: 0.5,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'amount',
      headerName: 'Amount (₹)',
      flex: 0.8,
      minWidth: 120,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1.2,
      minWidth: 160,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 0.8,
      minWidth: 140,
      headerAlign: 'center',
      align: 'center',
      renderCell: p => {
        const IconCmp = categoryIcons[p.row.category] || HelpOutlineIcon
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, width: '100%', height: '100%' }}>
            <IconCmp fontSize='small' />
            <Typography variant='body2' sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
              {p.row.category}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.6,
      minWidth: 110,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: p => (
        <Stack direction='row' spacing={0.5} sx={{ justifyContent: 'center', width: '100%' }}>
          <IconButton
            size='small'
            color='primary'
            onClick={() => {
              setSelectedExpense(items.find(x => x._id === p.row.id))
              setEditOpen(true)
            }}
          >
            <EditIcon fontSize='small' />
          </IconButton>
          <IconButton
            size='small'
            color='error'
            onClick={async () => {
              await createApiInstance(token).delete(`/expenses/${p.row.id}`)
              enqueueSnackbar('Expense deleted', { variant: 'info' })
              fetchData()
            }}
          >
            <DeleteIcon fontSize='small' />
          </IconButton>
        </Stack>
      )
    }
  ]

  const handleSave = async e => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const payload = {
      title: fd.get('title'),
      amount: Number(fd.get('amount')),
      description: fd.get('description'),
      timestamp: new Date(fd.get('datetime')).toISOString(),
      category: fd.get('category')
    }
    await createApiInstance(token).put(`/expenses/${selectedExpense._id}`, payload)
    enqueueSnackbar('Expense updated', { variant: 'success' })
    setEditOpen(false)
    fetchData()
  }

  const deleteMonthHandler = async () => {
    await createApiInstance(token).delete('/expenses/delete-month', { params: { year, month } })
    enqueueSnackbar('Month deleted', { variant: 'info' })
    setConfirmationOpen(false)
    fetchData()
  }

  return (
    <Layout>
      <Loader open={loading} />
      <Container sx={{ py: 3, fontFamily: '"Poppins", sans-serif' }} maxWidth='xl'>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 700, color: 'primary.main' }}>
            Admin Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Select value={year} onChange={e => setYear(e.target.value)} size='small' sx={{ minWidth: 110 }}>
              {Array.from({ length: 20 }, (_, i) => now.getFullYear() - 10 + i).map(y => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
            <Select value={month} onChange={e => setMonth(e.target.value)} size='small' sx={{ minWidth: 120 }}>
              {months.map((m, i) => (
                <MenuItem key={m} value={i + 1}>
                  {m}
                </MenuItem>
              ))}
            </Select>
            <Button variant='contained' color='error' onClick={() => setConfirmationOpen(true)} sx={{ fontWeight: 600 }}>
              Delete Month
            </Button>
          </Box>
        </Box>

        <Card
          sx={{
            mb: 3,
            background: 'linear-gradient(135deg, rgba(25,118,210,0.9) 0%, rgba(25,118,210,0.7) 100%)',
            color: '#fff'
          }}
        >
          <CardContent>
            <Typography variant={isMobile ? 'subtitle1' : 'h6'} align='center' sx={{ fontWeight: 600 }}>
              {months[month - 1]} {year} Total : ₹{Number(monthlyTotal).toLocaleString('en-IN')}
            </Typography>
          </CardContent>
        </Card>

        <Typography variant='h6' sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
          Daily Expenses • {day}/{month}/{year}
        </Typography>

        <Box sx={{ height: 320, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            density={isMobile ? 'compact' : 'standard'}
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                background: 'primary.main',
                color: '#fff',
                fontWeight: 700,
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                textAlign: 'center'
              },
              '& .MuiDataGrid-row': {
                fontSize: isMobile ? '0.75rem' : '0.85rem',
                '& .MuiDataGrid-cell': {
                  textAlign: 'center',
                  justifyContent: 'center'
                }
              },
              '& .MuiDataGrid-virtualScroller': {
                overflowX: 'auto'
              }
            }}
            autoHeight={isMobile}
          />
        </Box>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination count={daysInMonth} page={day} onChange={(e, v) => setDay(v)} size={isMobile ? 'small' : 'medium'} />
        </Box>
      </Container>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth='sm'>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Expense</DialogTitle>
        <DialogContent>
          {selectedExpense && (
            <Box component='form' id='edit-form' onSubmit={handleSave}>
              <TextField margin='normal' required fullWidth name='title' label='Title' defaultValue={selectedExpense.title} autoFocus />
              <TextField margin='normal' required fullWidth name='amount' label='Amount' type='number' defaultValue={selectedExpense.amount} />
              <Select margin='normal' fullWidth name='category' defaultValue={selectedExpense.category}>
                {Object.entries(categoryIcons).map(([cat, IconCmp]) => (
                  <MenuItem key={cat} value={cat}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconCmp fontSize='small' />
                      {cat}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              <TextField margin='normal' fullWidth name='description' label='Description' defaultValue={selectedExpense.description} multiline rows={3} />
              <TextField margin='normal' required fullWidth name='datetime' label='Date & Time' type='datetime-local' defaultValue={dayjs(selectedExpense.timestamp).format('YYYY-MM-DDTHH:mm')} InputLabelProps={{ shrink: true }} />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button type='submit' form='edit-form' variant='contained'>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Delete all expenses for {months[month - 1]} {year}?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmationOpen(false)}>Cancel</Button>
          <Button variant='contained' color='error' onClick={deleteMonthHandler}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  )
}
