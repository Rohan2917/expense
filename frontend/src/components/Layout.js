import { useState } from 'react'
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { clearAuthentication } from '../store/slices/authSlice'

export default function Layout({ children }) {
  const { username } = useSelector(s => s.auth)
  const dispatch = useDispatch()
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleMenuOpen = event => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  const handleLogout = () => {
    dispatch(clearAuthentication())
    router.push('/login')
    handleMenuClose()
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position='static' elevation={1}>
        <Container maxWidth='xl'>
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Typography variant='h6' sx={{ fontWeight: 700 }}>
              <Link href='/' style={{ textDecoration: 'none', color: 'white' }}>
                Expense Tracker
              </Link>
            </Typography>

            {username && (
              <>
                {isMobile ? (
                  <IconButton color='inherit' onClick={handleMenuOpen}>
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
                    <Button color='inherit' onClick={handleLogout} sx={{ textTransform: 'none' }}>
                      Logout ({username})
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose} PaperProps={{ sx: { minWidth: 140 } }}>
        <MenuItem onClick={handleMenuClose} component={Link} href='/expenses'>
          Expenses
        </MenuItem>
        <MenuItem onClick={handleMenuClose} component={Link} href='/admin'>
          Admin
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout ({username})</MenuItem>
      </Menu>

      <Container
        maxWidth='xl'
        sx={{
          py: 4,
          px: { xs: 2, sm: 3 },
          flex: 1
        }}
      >
        {children}
      </Container>

      <Box
        sx={{
          py: 3,
          textAlign: 'center',
          color: 'text.secondary',
          backgroundColor: 'background.paper',
          mt: 'auto'
        }}
      >
        <Typography variant='body2'>Expense Tracker © {new Date().getFullYear()}</Typography>
      </Box>
    </Box>
  )
}
