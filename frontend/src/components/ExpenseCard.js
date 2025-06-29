import { Card, Box, Typography, Avatar, Chip } from '@mui/material'
import dayjs from 'dayjs'
import { categories } from '../utils/constants'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export default ({ expense, color }) => {
  const Icon = categories[expense.category] || categories.Other
  return (
    <Card variant='outlined' sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 3, borderColor: color }}>
      <Avatar sx={{ bgcolor: `${color}22`, color, width: 44, height: 44 }}>
        <Icon fontSize='medium' />
      </Avatar>
      <Box sx={{ flexGrow: 1, ml: 2 }}>
        <Typography sx={{ fontWeight: 600 }} noWrap>
          {expense.title}
        </Typography>
        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{dayjs(expense.timestamp).utcOffset(330).format('DD MMM, h:mm A')}</Typography>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography sx={{ fontWeight: 700 }}>₹{expense.amount.toLocaleString('en-IN')}</Typography>
        <Chip size='small' label={expense.category} icon={<Icon sx={{ fontSize: 14 }} />} sx={{ mt: 0.5 }} />
      </Box>
    </Card>
  )
}
