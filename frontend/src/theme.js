import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5'
    },
    secondary: {
      main: '#4caf50'
    },
    background: {
      default: '#f5f7fa'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700
    },
    h5: {
      fontWeight: 600
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          transition: 'box-shadow 0.3s',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
          }
        }
      }
    }
  }
})

export default theme
// import { createTheme } from '@mui/material/styles'

// const theme = createTheme({
//   palette: {
//     mode: 'light',
//     primary: {
//       main: '#5A55FF', // Electric indigo
//       light: '#8A85FF',
//       dark: '#2f2bb2',
//       contrastText: '#ffffff'
//     },
//     secondary: {
//       main: '#00C2A8', // Teal green
//       light: '#5BE6D4',
//       dark: '#009688',
//       contrastText: '#ffffff'
//     },
//     error: {
//       main: '#FF4D4F'
//     },
//     warning: {
//       main: '#FFA940'
//     },
//     info: {
//       main: '#1890FF'
//     },
//     success: {
//       main: '#52C41A'
//     },
//     background: {
//       default: '#f4f6f8',
//       paper: '#ffffff'
//     },
//     text: {
//       primary: '#1e1e2f',
//       secondary: '#555770'
//     }
//   },
//   typography: {
//     fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
//     h4: {
//       fontWeight: 700,
//       color: '#1e1e2f'
//     },
//     h5: {
//       fontWeight: 600,
//       color: '#2b2d42'
//     },
//     button: {
//       textTransform: 'none',
//       fontWeight: 500
//     }
//   },
//   shape: {
//     borderRadius: 12
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 10,
//           textTransform: 'none',
//           fontWeight: 600,
//           padding: '8px 16px',
//           boxShadow: 'none',
//           '&:hover': {
//             boxShadow: '0 4px 12px rgba(90, 85, 255, 0.2)'
//           }
//         }
//       }
//     },
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: 16,
//           boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
//           transition: '0.3s ease',
//           '&:hover': {
//             boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)'
//           }
//         }
//       }
//     },
//     MuiPaper: {
//       styleOverrides: {
//         elevation1: {
//           boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)'
//         }
//       }
//     },
//     MuiTypography: {
//       styleOverrides: {
//         root: {
//           color: '#1e1e2f'
//         }
//       }
//     }
//   }
// })

// export default theme
