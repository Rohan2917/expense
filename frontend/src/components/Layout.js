import { useState } from 'react'
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { clearAuthentication } from '../store/slices/authSlice'

export default ({ children }) => {
  const { username } = useSelector(s => s.auth)
  const d = useDispatch()
  const r = useRouter()
  const t = useTheme()
  const m = useMediaQuery(t.breakpoints.down('sm'))
  const [a, setA] = useState(null)
  const o = Boolean(a)
  const open = e => setA(e.currentTarget)
  const close = () => setA(null)
  const logout = () => {
    d(clearAuthentication())
    r.push('/login')
    close()
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position='static' elevation={1}>
        <Container maxWidth='xl'>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant='h6' sx={{ fontWeight: 700 }}>
              <Link href='/' style={{ color: '#fff', textDecoration: 'none' }}>
                Expense Tracker
              </Link>
            </Typography>
            {username &&
              (m ? (
                <IconButton color='inherit' onClick={open}>
                  <MenuIcon />
                </IconButton>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button color='inherit' component={Link} href='/expenses' sx={{ textTransform: 'none' }}>
                    Expenses
                  </Button>
                  <Button color='inherit' component={Link} href='/admin' sx={{ textTransform: 'none' }}>
                    Admin
                  </Button>
                  <Button color='inherit' onClick={logout} sx={{ textTransform: 'none' }}>
                    Logout ({username})
                  </Button>
                </Box>
              ))}
          </Toolbar>
        </Container>
      </AppBar>
      <Menu anchorEl={a} open={o} onClose={close}>
        <MenuItem onClick={close} component={Link} href='/expenses'>
          Expenses
        </MenuItem>
        <MenuItem onClick={close} component={Link} href='/admin'>
          Admin
        </MenuItem>
        <MenuItem onClick={logout}>Logout ({username})</MenuItem>
      </Menu>
      <Container maxWidth='xl' sx={{ py: 4 }}>
        {children}
      </Container>
      <Box sx={{ py: 3, textAlign: 'center', color: 'text.secondary', mt: 'auto' }}>
        <Typography variant='body2'>Expense Tracker © {new Date().getFullYear()}</Typography>
      </Box>
    </Box>
  )
}
