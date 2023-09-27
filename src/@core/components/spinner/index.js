// ** MUI Imports
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import screen from '../../../../public/images/pages/logo_dashboard.png'
import Image from 'next/image'

const FallbackSpinner = ({ sx }) => {
  // ** Hook
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      <Image
            src={screen}
            alt='logo'
            style={{
              width: '82px',
              height: '56px'
            }}
            priority 
          />

      <CircularProgress disableShrink sx={{ mt: 6 }} />
    </Box>
  )
}

export default FallbackSpinner
