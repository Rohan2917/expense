import { Card, Box, Typography, Avatar, Chip } from '@mui/material'
import dayjs from 'dayjs'
import { categories } from '../utils/constants'

const ExpenseCard = ({ expense, color }) => {
  const CategoryIcon = categories[expense.category] || categories.Other
  return (
    <Card
      variant='outlined'
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 2,
        py: 1.5,
        borderRadius: '15px',
        borderColor: color,
        transition: 'all .2s',
        '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' }
      }}
    >
      <Avatar sx={{ bgcolor: `${color}22`, color, width: 42, height: 42 }}>
        <CategoryIcon fontSize='medium' />
      </Avatar>
      <Box sx={{ flexGrow: 1, ml: 2, minWidth: 0 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 15 }} noWrap>
          {expense.title}
        </Typography>
        <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{dayjs(expense.timestamp).format('DD MMM, h:mm A')}</Typography>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography sx={{ fontWeight: 700, fontSize: 15 }}>₹{expense.amount.toLocaleString('en-IN')}</Typography>
        <Chip size='small' label={expense.category} icon={<CategoryIcon sx={{ fontSize: 14 }} />} sx={{ mt: 0.5 }} />
      </Box>
    </Card>
  )
}

export default ExpenseCard
