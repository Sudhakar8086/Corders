// ** React Imports
import { useState } from 'react'
import axios from 'axios'
import moment from "moment"
import Spinner from 'src/@core/components/spinner'
// ** MUI Imports
import Box from '@mui/material/Box'
import DatePicker from 'react-datepicker'
import Fade from '@mui/material/Fade'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import Backdrop from '@mui/material/Backdrop'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge';
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography';
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import 'react-datepicker/dist/react-datepicker.css'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { width } from '@mui/system'



const LeaveCheck = ({ popperPlacement }) => {
    // ** States
    const [reload, setReload] = useState(false)
    const [collapsed, setCollapsed] = useState(true)
    const [visibility, setVisibility] = useState(true)
    const [loading, setLoading] = useState(false)
    const [isSearched, setIsSearched] = useState(false)
    const [leaveData, setLeaveData] = useState([])
    const [picker, setPicker] = useState("");
    const [endPicker, setEndPicker] = useState("");

    const startDate = picker ? moment(picker).format("YYYY-MM-DD") : ""
    const endDate = endPicker ? moment(endPicker).format("YYYY-MM-DD") : ""

    // const startDate = moment(picker[0]).format("YYYY-MM-DD")
    // const endDate = moment(endPicker[0]).format("YYYY-MM-DD")

    const handleBackDrop = () => {
        setReload(true)
        setTimeout(() => {
            setReload(false)
        }, 2000)
    }


    const OnlyLeavesFetch = async () => {
        setLoading(true);
        try {
            const resp = await axios({
                method: "POST",
                url: "https://jsf7ngq6b1.execute-api.us-east-1.amazonaws.com/TEST/LeaveManagementTest", // Define LeaveApprovalApi
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                data: JSON.stringify({
                    requestType: "LeaveStatus",
                    fromDate: startDate,
                    toDate: endDate,
                }),
            });
            setLoading(false);
            setIsSearched(true);
            setLeaveData(resp.data.leaveStatusResponse);
        } catch (err) {
            setIsSearched(true);
            setLoading(false);
            console.error(err);
        }
    }

    const Loading = () => {
        if (loading)
            return (
                <span
                    className="customizer-toggle d-flex align-items-center justify-content-center"
                    style={{ height: "100%" }}
                >
                    <Spinner size="lg" className="spinner" color="primary" />
                </span>
            );
    };


    return (
        <Fade in={visibility} timeout={300}>
            <Card sx={{ position: 'relative', height: 900 }}>
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
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }} className='demo-space-x'>
                        <div style={{ margin: '50px 0' }}> {/* Add margin to create space */}
                                <DatePicker
                                    selected={picker}
                                    popperPlacement={popperPlacement}
                                    id='basic-input'
                                    style={{ width: '80%' }}
                                    placeholderText="Select Start Date"
                                    onChange={(date) => setPicker(date)}
                                    customInput={<CustomInput label='Start Date' />}
                                    required

                                />
                            </div>
                            <div style={{ margin: '50px 0' }}> {/* Add margin to create space */}
                                <DatePicker
                                    selected={endPicker}
                                    id='basic-input'
                                    style={{ width: '80%' }}
                                    popperPlacement={popperPlacement}
                                    placeholderText="Select End Date"
                                    onChange={(date) => setEndPicker(date)}
                                    customInput={<CustomInput label='End Date' />}
                                    required

                                />
                            </div>
                            <div style={{ margin: '50px 0' }}>
                                <Button variant='contained' size='medium' sx={{ ml: 130,mt:3, width: 110 }} onClick={OnlyLeavesFetch}>Search</Button>
                            </div>
                        </Box>
                    <Loading />
                    {isSearched ? (
                    <div style={{ backgroundColor: "#E7EAEC " }} lg="3" md="2" xs="1" >
                        <Grid container spacing={4}>
                        <div style={{ maxHeight: '800px', display: 'flex',margin:'14px', padding: '10px', flexWrap: 'wrap' }}>
                        {leaveData?.length && !loading ? (
                            leaveData?.map((i, index) => (
                                <Grid item lg={4} md={6} xs={12} key={index}>
                                    <>
                                        <Card
                                            key={index}
                                            className="ml-500"
                                            style={{ borderTop: "3px solid #3BAFDA", margin: '10px'  }}
                                        >
                                            <CardContent>
                                            <Badge color="primary" badgeContent={i.date} overlap="rectangle" sx={{width:100}}>
                                            </Badge>
                                                {i.leaveStatusResponse.map((item, index) => (
                                                        <div key={index} className="d-flex justify-content-between align-items-center">
                                                        <div className="d-flex ">
                                                            <h5 >
                                                                <span> {item.firstName} - </span>
                                                            </h5>
                                                            {item.leaveStatus === 1 ? (
                                                                <div>
                                                                    <h6 className="ms-75">
                                                                        <span style={{ color: "orange" }}>
                                                                            Leave Approved
                                                                        </span>
                                                                    </h6>
                                                                </div>
                                                            ) : (<div>
                                                                <h6 className="ms-75">
                                                                    {`${item.leaveStatus ? ", " : ""
                                                                        }`}
                                                                    <span style={{ color: "orange" }}>
                                                                        Leave Applied
                                                                    </span>
                                                                </h6>
                                                            </div>)}
                                                        </div>
                                                        </div>
                                                ))}
                                                     </CardContent>
                                                 </Card>
                                            </>
                                            </Grid>
                                            ))
                                            ) : isSearched && !loading ? (
                                            <span className="d-flex align-items-center justify-content-center mt-3 mb-3 w-100">
                                                No Search Data Found...
                                            </span>
                                           ) : null}  
                                           </div>
                                           </Grid>
                                        </div>
                                        ) : null
                                        }
{/* className="m-20 p-20" */}
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
                                        </CardContent>
                                    </Collapse>
                                </Card>
        </Fade>
    )
}

export default LeaveCheck