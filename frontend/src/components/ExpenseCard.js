import { Card, Box, Typography, Avatar, Chip } from '@mui/material'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { categories } from '../utils/constants'

dayjs.extend(utc)
dayjs.extend(timezone)
const TZ = 'Asia/Kolkata'

export default function ExpenseCard({ expense, color }) {
  const Icon = categories[expense.category] || categories.Other
  // const time = dayjs.utc(expense.timestamp).tz(TZ).format('DD MMM, h:mm A')
  const time = dayjs(expense.timestamp).add(5, 'hour').add(30, 'minute').format('DD MMM, h:mm A')

  return (
    <Card variant='outlined' sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 3, borderColor: color }}>
      <Avatar sx={{ bgcolor: `${color}22`, color, width: 44, height: 44 }}>
        <Icon fontSize='medium' />
      </Avatar>
      <Box sx={{ flexGrow: 1, ml: 2 }}>
        <Typography sx={{ fontWeight: 600 }} noWrap>
          {expense.title}
        </Typography>
        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{time}</Typography>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography sx={{ fontWeight: 700 }}>₹{expense.amount.toLocaleString('en-IN')}</Typography>
        <Chip size='small' label={expense.category} icon={<Icon sx={{ fontSize: 14 }} />} sx={{ mt: 0.5 }} />
      </Box>
    </Card>
  )
}
