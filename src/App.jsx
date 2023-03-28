import { useState } from 'react'
import './App.css'

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './components/Home';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
function App() {
  const [count, setCount] = useState(0)

  return (
   <div>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Home/>
    </ThemeProvider>
   </div>
  )
}

export default App
