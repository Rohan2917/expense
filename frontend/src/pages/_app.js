// import '@mui/x-data-grid/css/style.css'
import { Provider } from 'react-redux'
import store from '../store'
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material'
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#00adb5' },
    background: { default: '#1a1a2e', paper: '#1a1a2e' },
    text: { primary: '#ffffff', secondary: '#cccccc' }
  }
})
export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  )
}
