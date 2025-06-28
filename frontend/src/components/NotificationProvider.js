import { SnackbarProvider } from 'notistack'

const NotificationProvider = ({ children }) => (
  <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={1000}>
    {children}
  </SnackbarProvider>
)
export default NotificationProvider
