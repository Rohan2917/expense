import { SnackbarProvider } from 'notistack'
export default ({ children }) => (
  <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={1200}>
    {children}
  </SnackbarProvider>
)
