// ** Reactstrap Imports
import { Fragment} from 'react'
import { useTheme } from '@mui/material/styles'
// ** Demo Components
import LeaveCheck from './LeaveCheck'

const ProviderLeave = () => {
    const theme = useTheme()
    const { direction } = theme
    const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  return (
    <Fragment>
     <LeaveCheck popperPlacement={popperPlacement}/>
    </Fragment>
  )
}
export default ProviderLeave