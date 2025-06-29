import { Backdrop, CircularProgress } from '@mui/material'
export default ({ open }) => (
  <Backdrop open={open} sx={{ zIndex: 1400 }}>
    <CircularProgress />
  </Backdrop>
)
