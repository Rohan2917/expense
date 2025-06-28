import { Provider } from 'react-redux'
import store from '../store'
import { CssBaseline, ThemeProvider } from '@mui/material'
import theme from '../theme'
import NotificationProvider from '../components/NotificationProvider'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NotificationProvider>
          <Component {...pageProps} />
        </NotificationProvider>
      </ThemeProvider>
    </Provider>
  )
}
