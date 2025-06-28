import { Backdrop, CircularProgress } from '@mui/material'

const Loader = ({ open }) => (
  <Backdrop open={open} sx={{ zIndex: 1400 }}>
    <CircularProgress />
  </Backdrop>
)
export default Loader
