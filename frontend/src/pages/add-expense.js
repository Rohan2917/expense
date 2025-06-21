import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addExpense } from '../store/expensesSlice'
import { Container, TextField, Button, Typography, Box } from '@mui/material'
import { useRouter } from 'next/router'
import Link from 'next/link'
export default function AddExpense() {
  const { username } = useSelector(s => s.auth)
  const d = useDispatch()
  const r = useRouter()
  const [t, setT] = useState('')
  const [a, setA] = useState('')
  const [dsc, setD] = useState('')
  const [dt, setDT] = useState('')
  const go = async e => {
    e.preventDefault()
    if (!t || !a) return
    await d(addExpense({ title: t, amount: Number(a), description: dsc, timestamp: dt ? new Date(dt).toISOString() : undefined })).unwrap()
    r.push('/expenses')
  }
  return (
    <Container maxWidth='sm' sx={{ mt: 8 }}>
      <Typography variant='h4' align='center'>
        Add Expense • {username}
      </Typography>
      <Box component='form' onSubmit={go} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
        <TextField label='Title' value={t} onChange={e => setT(e.target.value)} required />
        <TextField label='Amount' type='number' value={a} onChange={e => setA(e.target.value)} required />
        <TextField label='Description' value={dsc} onChange={e => setD(e.target.value)} multiline rows={3} />
        <TextField label='Date & Time' type='datetime-local' value={dt} onChange={e => setDT(e.target.value)} InputLabelProps={{ shrink: true }} />
        <Button type='submit' variant='contained'>
          Save
        </Button>
        <Link href='/expenses' style={{ textDecoration: 'none' }}>
          <Button variant='outlined'>Back to Expenses</Button>
        </Link>
      </Box>
    </Container>
  )
}
