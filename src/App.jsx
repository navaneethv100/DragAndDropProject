import { useState } from 'react'
import { CssBaseline, ThemeProvider, createTheme, Box, Typography, Container } from '@mui/material'
import Board from './components/Board';
 

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container disableGutters maxWidth={false}>
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: '16px',
          }}
        >
          <Typography variant='h4' component="h1" gutterBottom>
            Task Board
          </Typography>
          <Box 
            sx={{ 
              width: '100%',
              maxWidth: 'calc(100vw - 32px)', 
              overflowX: 'auto', 
            }}
          >
            <Board />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App
