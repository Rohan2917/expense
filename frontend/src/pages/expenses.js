import { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchExpenses, deleteMonthExpenses, deleteExpense, updateExpense } from '../store/expensesSlice'
import { clearAuth } from '../store/authSlice'
import { Container, Typography, Button, Box, Select, MenuItem, IconButton, Drawer, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Stack } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from 'next/router'
export default function Expenses() {
  const { token, username } = useSelector(s => s.auth)
  const items = useSelector(s => s.expenses.items)
  const d = useDispatch()
  const r = useRouter()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState('view')
  const [selected, setSel] = useState(null)
  const [conf, setConf] = useState(false)
  useEffect(() => {
    if (!token) r.push('/login')
    else d(fetchExpenses())
  }, [token])
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const yOpt = useMemo(() => Array.from({ length: 50 }, (_, i) => 2001 + i), [])
  const rowsSrc = useMemo(
    () =>
      items.filter(x => {
        const t = new Date(x.timestamp)
        return t.getFullYear() === year && t.getMonth() + 1 === month
      }),
    [items, year, month]
  )
  const tot = useMemo(() => rowsSrc.reduce((s, x) => s + x.amount, 0), [rowsSrc])
  const tW = Math.min(300, Math.max(80, Math.max(...rowsSrc.map(x => x.title.length), 8) * 8))
  const dW = Math.min(400, Math.max(100, Math.max(...rowsSrc.map(x => x.description.length), 10) * 6))
  const cols = [
    { field: 'title', headerName: 'Title', width: tW },
    { field: 'date', headerName: 'Date', width: 110 },
    { field: 'time', headerName: 'Time', width: 100 },
    { field: 'amount', headerName: 'Amount', width: 110 },
    { field: 'description', headerName: 'Description', width: dW },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 140,
      sortable: false,
      renderCell: p => (
        <Stack direction='row' spacing={1}>
          <IconButton
            color='primary'
            onClick={() => {
              setSel(items.find(x => x._id === p.row._id))
              setDrawerMode('view')
              setDrawerOpen(true)
            }}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            color='primary'
            onClick={() => {
              setSel(items.find(x => x._id === p.row._id))
              setDrawerMode('edit')
              setDrawerOpen(true)
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton color='primary' onClick={() => d(deleteExpense(p.row._id))}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      )
    }
  ]
  const rows = rowsSrc.map(x => ({ ...x, id: x._id, date: dayjs(x.timestamp).format('DD/MM/YYYY'), time: dayjs(x.timestamp).format('HH:mm') }))
  const sty = { minWidth: 100, height: 40 }
  const save = e => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    d(updateExpense({ id: selected._id, title: f.get('title'), amount: Number(f.get('amount')), description: f.get('description'), timestamp: new Date(f.get('datetime')).toISOString() }))
    setDrawerOpen(false)
  }
  return (
    <Container maxWidth='xl' sx={{ pt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant='h4'>Expenses • {username}</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Select value={year} onChange={e => setYear(e.target.value)} size='small' sx={sty}>
            {yOpt.map(y => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
          <Select value={month} onChange={e => setMonth(e.target.value)} size='small' sx={{ ...sty, minWidth: 130 }}>
            {months.map((m, i) => (
              <MenuItem key={m} value={i + 1}>
                {m}
              </MenuItem>
            ))}
          </Select>
          <Button variant='contained' sx={sty} onClick={() => setConf(true)}>
            Delete All
          </Button>
          <Link href='/add-expense' style={{ textDecoration: 'none' }}>
            <Button variant='contained' sx={sty}>
              Add Expense
            </Button>
          </Link>
          <Button
            variant='contained'
            color='secondary'
            sx={sty}
            onClick={() => {
              d(clearAuth())
              r.push('/login')
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>
      <Typography sx={{ mt: 2 }} variant='h6'>
        Total = ₹ {tot}
      </Typography>
      <Box sx={{ mt: 2, '& .MuiDataGrid-root': { border: '1px solid #444' }, '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeaders': { borderRight: '1px solid #444' }, height: 500, width: '100%' }}>
        <DataGrid rows={rows} columns={cols} autoHeight hideFooter disableColumnMenu disableSelectionOnClick />
      </Box>
      <Drawer anchor='right' open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {selected && drawerMode === 'view' && (
          <Box sx={{ p: 3, width: 350, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant='h6'>View Expense</Typography>
            <Typography>Title: {selected.title}</Typography>
            <Typography>Amount: {selected.amount}</Typography>
            <Typography>Description: {selected.description}</Typography>
            <Typography>Date: {dayjs(selected.timestamp).format('DD/MM/YYYY')}</Typography>
            <Typography>Time: {dayjs(selected.timestamp).format('HH:mm')}</Typography>
            <Button variant='contained' onClick={() => setDrawerOpen(false)}>
              Close
            </Button>
          </Box>
        )}
        {selected && drawerMode === 'edit' && (
          <Box component='form' onSubmit={save} sx={{ p: 3, width: 350, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant='h6'>Edit Expense</Typography>
            <TextField name='title' label='Title' defaultValue={selected.title} required fullWidth />
            <TextField name='amount' label='Amount' type='number' defaultValue={selected.amount} required fullWidth />
            <TextField name='description' label='Description' defaultValue={selected.description} multiline rows={3} fullWidth />
            <TextField name='datetime' label='Date & Time' type='datetime-local' defaultValue={dayjs(selected.timestamp).format('YYYY-MM-DDTHH:mm')} required fullWidth />
            <Button type='submit' variant='contained'>
              Save
            </Button>
          </Box>
        )}
      </Drawer>
      <Dialog open={conf} onClose={() => setConf(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Delete all expenses for {months[month - 1]} {year}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConf(false)}>Cancel</Button>
          <Button
            variant='contained'
            onClick={() => {
              d(deleteMonthExpenses({ year, month }))
              setConf(false)
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
