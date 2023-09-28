// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import DatePicker from 'react-datepicker'
import Fade from '@mui/material/Fade'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import Backdrop from '@mui/material/Backdrop'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import 'react-datepicker/dist/react-datepicker.css'
// ** Icon Imports
import Icon from 'src/@core/components/icon'

const LeaveCheck = ({ popperPlacement }) => {
    // ** States
    const [reload, setReload] = useState(false)
    const [collapsed, setCollapsed] = useState(true)
    const [visibility, setVisibility] = useState(true)
    const [date, setDate] = useState(new Date())
    const handleBackDrop = () => {
        setReload(true)
        setTimeout(() => {
            setReload(false)
        }, 2000)
    }

    return (
        <Fade in={visibility} timeout={300}>
            <Card sx={{ position: 'relative', height: 420 }}>
                <CardHeader
                    title='Provider Leave Check'
                    action={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton
                                size='small'
                                aria-label='collapse'
                                sx={{ mr: 2, color: 'text.secondary' }}
                                onClick={() => setCollapsed(!collapsed)}
                            >
                                <Icon fontSize={20} icon={!collapsed ? 'tabler:chevron-down' : 'tabler:chevron-up'} />
                            </IconButton>
                            <IconButton
                                size='small'
                                aria-label='reload'
                                onClick={() => handleBackDrop()}
                                sx={{ mr: 2, color: 'text.secondary' }}
                            >
                                <Icon icon='tabler:reload' fontSize={20} />
                            </IconButton>
                            <IconButton
                                size='small'
                                aria-label='close'
                                sx={{ color: 'text.secondary' }}
                                onClick={() => setVisibility(false)}
                            >
                                <Icon icon='tabler:x' fontSize={20} />
                            </IconButton>
                        </Box>
                    }
                />
                <Collapse in={collapsed}>
                    <CardContent>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                            <div sm={6}>
                                <DatePicker
                                    selected={date}
                                    popperPlacement={popperPlacement}
                                    id='basic-input'
                                    style={{ width: '80%' }}
                                    onChange={date => setDate(date)}
                                    customInput={<CustomInput label='Start Date' />}
                                    required

                                />
                            </div>
                            <div sm={6}>
                                <DatePicker
                                    selected={date}
                                    id='basic-input'
                                    style={{ width: '80%' }}
                                    popperPlacement={popperPlacement}
                                    onChange={date => setDate(date)}
                                    customInput={<CustomInput label='End Date' />}
                                    required

                                />
                            </div>
                            <div>
                                <Button variant='contained' size='medium' sx={{ ml: 150, mt: 4, width: 110 }}>Search</Button>
                            </div>
                        </Box>
                    </CardContent>

                    <Backdrop
                        open={reload}
                        sx={{
                            position: 'absolute',
                            color: 'common.white',
                            zIndex: theme => theme.zIndex.mobileStepper - 1
                        }}
                    >
                        <CircularProgress color='inherit' />
                    </Backdrop>
                </Collapse>
            </Card>
        </Fade>
    )
}

export default LeaveCheck