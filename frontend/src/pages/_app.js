import { Provider } from 'react-redux'
import store from '../store'
import { CssBaseline, ThemeProvider } from '@mui/material'
import NotificationProvider from '../components/NotificationProvider'
import theme from '../theme'
import '../styles/globals.css'

export default ({ Component, pageProps }) => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </ThemeProvider>
  </Provider>
)
