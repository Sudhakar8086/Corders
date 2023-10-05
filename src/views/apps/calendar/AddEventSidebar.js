// ** React Imports
import { useState, useEffect, forwardRef, useCallback, Fragment } from 'react'
import { Button, Modal, ModalHeader, ModalBody, Label, Form, Card, ListGroup, ListGroupItem, CardTitle, Badge, Row, Col } from 'reactstrap'
// ** MUI Imports
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Switch from '@mui/material/Switch'
// import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
// import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
// import Dialog from 'src/pages/components/dialogs'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Slide from '@mui/material/Slide'
// import { Card, CardContent, DataGrid } from '@mui/material'
import DialogContentText from '@mui/material/DialogContentText'
import { FormControl, Grid, Autocomplete } from '@mui/material'
import Select, { components } from 'react-select'
import moment from "moment"
import toast from 'react-hot-toast'
import Flatpickr from 'react-flatpickr'



const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />
})
// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import axios from 'axios'

// ** Third Party Imports
import DatePicker from 'react-datepicker'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const capitalize = string => string && string[0].toUpperCase() + string.slice(1)

const defaultState = {
  url: '',
  title: '',
  guests: [],
  allDay: true,
  description: '',
  endDate: new Date(),
  calendar: 'Business',
  startDate: new Date()
}

const AddEventSidebar = props => {
  // ** Props
  const {
    store,
    dispatch,
    addEvent,
    updateEvent,
    drawerWidth,
    calendarApi,
    removeEvent,
    handleSelectEvent,
    addEventSidebarOpen,
    handleAddEventSidebarToggle,
    selectEvent
  } = props

    // ** Vars & Hooks
    const selectedEvent = store.selectedEvent,
    {
      control,
      setError,
      setValue,
      getValues,
      handleSubmit,
      formState: { errors }
    } = useForm({
      defaultValues: { title: '' }
    })

  //API
  const ScheduleApi = process.env.NEXT_PUBLIC_PHYSICIAN_SCHEDULING
  const LeaveDetails = process.env.NEXT_PUBLIC_LEAVE_DETAILS


  // ** States
  const [values, setValues] = useState(defaultState)
  const [startPicker, setStartPicker] = useState()
  const [calendarLabel, setCalendarLabel] = useState([])
  const [previousCalendarLabel, setPreviousCalendarLabel] = useState()
  const [leaves, setLeaves] = useState([])

  // const {
  //   getValues,
  //   control,
  //   setValue,
  //   clearErrors,
  //   handleSubmit,
  //   formState: { errors }
  // } = useForm({ defaultValues: { title: '' } })


  // ** React Select Theme Colors
 const selectThemeColors = theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#7367f01a', // for option hover bg-color
    primary: '#7367f0', // for selected option bg-color
    neutral10: '#7367f0', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed' // for input hover border-color
  }
})

const isObjEmpty = obj => Object.keys(obj).length === 0
const OptionComponent = ({ data, ...props }) => {
  return (
    <components.Option {...props}>
      <span className={`bullet bullet-${data.color} bullet-sm me-50`}></span>
      {data.label}
    </components.Option>
  )
}

const handleCalendarLabelChange = (data) => {
  setPreviousCalendarLabel(calendarLabel)
  setCalendarLabel(data)
}
  const handleSidebarClose = async () => {
    setValues(defaultState)
    // clearErrors()
    // dispatch(handleSelectEvent(null))
    handleAddEventSidebarToggle()
  }

  const onSubmit = data => {
    const modifiedEvent = {
      url: values.url,
      display: 'block',
      title: data.title,
      end: values.endDate,
      allDay: values.allDay,
      start: values.startDate,
      extendedProps: {
        calendar: capitalize(values.calendar),
        guests: values.guests && values.guests.length ? values.guests : undefined,
        description: values.description.length ? values.description : undefined
      }
    }
    if (store.selectedEvent === null || (store.selectedEvent !== null && !store.selectedEvent.title.length)) {
      dispatch(addEvent(modifiedEvent))
    } else {
      dispatch(updateEvent({ id: store.selectedEvent.id, ...modifiedEvent }))
    }
    calendarApi.refetchEvents()
    handleSidebarClose()
  }

  const handleDeleteEvent = () => {
    if (store.selectedEvent) {
      dispatch(removeEvent(store.selectedEvent.id))
    }

    // calendarApi.getEventById(store.selectedEvent.id).remove()
    handleSidebarClose()
  }

  const handleStartDate = date => {
    if (date > values.endDate) {
      setValues({ ...values, startDate: new Date(date), endDate: new Date(date) })
    }
  }


  const handleEditEvent = async () => {
    if (getValues('title').label.length) {
      const event = {
        providerId: getValues('title').hasOwnProperty('id') === false ? providerData.find(x => x.label === selectedEvent.title.split(' : ')[1]).id : getValues('title').id,
        previousHospitalId: previousCalendarLabel.id === undefined ? facilityData.find(x => x.label === selectedEvent.extendedProps.calendar).id : previousCalendarLabel.id,
        Date: startPicker,
        extendedProps: {
          newHospitalId: calendarLabel.id === undefined ? facilityData.find(x => x.label === selectedEvent.extendedProps.calendar).id : calendarLabel.id
        }
      }

      await axios({
        method: "POST",
        url: ScheduleApi,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: JSON.stringify({
          requestType: "editScheduling",
          date: moment(event.Date).format("YYYY-MM-DD"),
          providerId: event.providerId,
          newHospitalId: event.extendedProps.newHospitalId,
          previousHospitalId: event.previousHospitalId
        })
      })

      handleAddEventSidebar()
      dispatch(fetchEvents(store.selectedCalendars))
      toast.success('Event Updated')
    } else {
      setError('title', {
        type: 'manual'
      })
    }
  }

  // const resetToStoredValues = useCallback(() => {
  //   if (store.selectedEvent !== null) {
  //     const event = store.selectedEvent
  //     setValue('title', event.title || '')
  //     setValues({
  //       url: event.url || '',
  //       title: event.title || '',
  //       allDay: event.allDay,
  //       guests: event.extendedProps.guests || [],
  //       description: event.extendedProps.description || '',
  //       calendar: event.extendedProps.calendar || 'Business',
  //       endDate: event.end !== null ? event.end : event.start,
  //       startDate: event.start !== null ? event.start : new Date()
  //     })
  //   }
  // }, [setValue, store.selectedEvent])

  // const resetToEmptyValues = useCallback(() => {
  //   setValue('title', '')
  //   setValues(defaultState)
  // }, [setValue])
  // useEffect(() => {
  //   if (store.selectedEvent !== null) {
  //     resetToStoredValues()
  //   } else {
  //     resetToEmptyValues()
  //   }
  // }, [addEventSidebarOpen, resetToStoredValues, resetToEmptyValues, store.selectedEvent])

  const PickersComponent = forwardRef(({ ...props }, ref) => {
    return (
      <CustomTextField
        inputRef={ref}
        fullWidth
        {...props}
        label={props.label || ''}
        sx={{ width: '100%' }}
        error={props.error}
      />
    )
  })

  const showLeaves = async (date) => {
    const resp = await axios({
      method: "POST",
      url: LeaveDetails,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: JSON.stringify({
        requestType: "Leaves",
        date: moment(date).format("YYYY-MM-DD"),
        providerId: userRole.userId
      })
    })
    setLeaves(resp.data.providerleavesCheckResponse.providerleaveCheckList)
  }
  const ScheduleDate = moment(startPicker).format("YYYY-MM-DD")
  //scheduleCheck
  const ScheduleCheck = async (item) => {
    const resp = await axios({
      method: "POST",
      url: ScheduleApi,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: JSON.stringify({
        requestType: "ScheduleCheck",
        date: ScheduleDate,
        providerId: item !== undefined ? item.title.id : null
      })
    })
    if (resp.data.scheduleCheck.hospitalName !== null) {
      toast.success(`${getValues('title').label} has been assigned to ${resp.data.scheduleCheck.hospitalName} Hospital`, {
        duration: 3000
      })
      console.log(resp, "resp from chedulecheck")
    }
  }

    // ** Reset Input Values on Close
    const handleResetInputValues = () => {
      dispatch(selectEvent({}))
      setValue('title', '')
      setCalendarLabel([{ value: 'Valley', label: 'Valley', color: 'primary' }])
      setStartPicker()
      setLeaves([])
      setPreviousCalendarLabel()
    }
   // ** Adds New Event
   const handleAddEvent = () => {
    const obj = {
      title: getValues('title'),
      start: startPicker,
      extendedProps: {
        calendar: calendarLabel.label
      }
    }
    dispatch(addEvent(obj))
    refetchEvents()
    handleAddEventSidebar()
    toast.success('Event Added')
  }

// ** Select Options
const facility = JSON.parse(localStorage.getItem('facility'))
const provider = JSON.parse(localStorage.getItem('provider'))


const color = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'primary', 'primary']
const facilityData = facility !== null ? facility.map((v, i) => ({ label: v.hospitalName, id: v.hospitalId, value: v.hospitalName, color: color[i] })) : null
const providerData = provider !== null ? provider.map((v, i) => ({ label: v.firstName, id: v.userId, value: v.firstName, color: color[i] })) : null
  const RenderSidebarFooter = () => {
    if (store.selectedEvent === null || (store.selectedEvent !== null && !store.selectedEvent.title.length)) {
      return (
        <Fragment>
          <Button type='submit' variant='contained' sx={{ mr: 4 }}>
            Add
          </Button>
          <Button variant='tonal' color='secondary' onClick={resetToEmptyValues}>
            Reset
          </Button>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <Button type='submit' variant='contained' sx={{ mr: 4 }}>
            Update
          </Button>
          <Button variant='tonal' color='secondary' onClick={resetToStoredValues}>
            Reset
          </Button>
        </Fragment>
      )
    }
  }

  const onOpen = () => {
      addEventSidebarOpen()
      handleSelectedEvent()
  }

  const handleSelectedEvent = async () => {
    if (!isObjEmpty(selectedEvent)) {
      const calendar = selectedEvent.extendedProps.calendar
      const resolveLabel = () => {
        if (calendar.length === undefined) {
          return { value: 'Valley', label: 'Valley', color: 'primary' }
        } else {
          return { label: calendar, value: calendar, color: calendarsColor[calendar] }
        }
      }
      setValue('title', { label: selectedEvent.title.split(' : ')[1], value: selectedEvent.title.split(' : ')[1], color: "success" } || { label: getValues('title'), value: getValues('title'), color: "success" })
      if (String(selectedEvent.start).includes('India')) {
        setStartPicker(new Date(String(selectedEvent.start)))
      } else {
        setStartPicker(new Date(String(selectedEvent._instance.range.end)))
      }
      setCalendarLabel([resolveLabel()])
    }
    await showLeaves(selectedEvent.start)
  }

   // ** Event Action buttons
   const EventActions = () => {
    const isProviderUnassigned = getValues('title').label === 'Unassigned'

    // Check if an event is selected and the provider was initially "Unassigned"
    const shouldHideUpdateButton = isObjEmpty(selectedEvent) && isProviderUnassigned


    if (isObjEmpty(selectedEvent) || (!isObjEmpty(selectedEvent) && !selectedEvent.title.length)) {
      return (
        <Fragment>
          {getValues('title') && calendarLabel && getValues('title').label !== undefined && calendarLabel.label !== undefined ? <Button className='me-1' type='submit' color='primary'>
            Add
          </Button> : <Button className='me-1' type='submit' color='secondary' disabled>
            Add
          </Button>}

          <Button color='secondary' type='reset' onClick={handleAddEventSidebarToggle} outline>
            Cancel
          </Button>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          {getValues('title') ? <Button className='me-1' color='primary' onClick={handleUpdateEvent}>
            Assign
          </Button> : <Button className='me-1' color='secondary' disabled>
            Assign
          </Button>}
          {getValues('title').label !== 'Unassigned' && !shouldHideUpdateButton ? previousCalendarLabel !== undefined && getValues('title').id === undefined ? <Button className='me-1' color='primary' onClick={handleEditEvent}>
            Update
          </Button> : <Button className='me-1' color='secondary' disabled>
            Update
          </Button> : null}

          <Button color='danger' onClick={handleDeleteEvent} outline>
            Cancel
          </Button>
        </Fragment>
      )
    }
  }
  return (
    <Dialog
      open={addEventSidebarOpen}
      onClose={handleSidebarClose}
      fullWidth
      maxWidth="xs" // Adjust this based on your design
    >
      <DialogTitle style={{ backgroundColor: "#f8f8f8", display: "flex", justifyContent: "space-between", alignContent: "center", alignItems: "center" }}>
        {store.selectedEvent !== null && store.selectedEvent.title && store.selectedEvent.title.length ? 'Update Event' : 'Add Event'}

        <button onClick={handleSidebarClose} style={{ border: "none", background: "transparent" }}>X</button>
      </DialogTitle>
      <DialogContent className='flex-grow-1 pb-sm-0 pb-3'>
        <Form>
        <div className='mb-1'>
              <Label className='form-label' for='title'>
                Providers <span className='text-danger'>*</span>
              </Label>
              <Controller
                name='title'
                id='title'
                control={control}
                render={({ field }) => (
                  <Select
                    id='title'
                    value={{ label: getValues('title'), value: getValues('title'), color: "success" }}
                    options={providerData}
                    theme={selectThemeColors}
                    isClearable={false}
                    onInputChange={ScheduleCheck(getValues())}
                    {...field}
                  />
                )}
              />
            </div>
            <div className='mb-1'>
              <Label className='form-label' htmlFor='label'>
                Hospitals
              </Label>
              <Select
                id='label'
                placeholder='Hospital list'
                value={calendarLabel[0]}
                options={facilityData}
                theme={selectThemeColors}
                isClearable={false}
                onChange={(data) => handleCalendarLabelChange(data)}
                components={{
                  Option: OptionComponent
                }}
                isDisabled={getValues('title').label === 'Unassigned'} // Conditionally disable the select
              />
            </div>

            <div className='mb-1'>
              <Label className='form-label' for='startDate'>
                Date
              </Label>
              {console.log('startPicker', startPicker)}
              <Flatpickr
                required
                id='startDate'
                name='startDate'
                className='form-control'
                disabled
                onChange={date => setStartPicker(date[0])}
                value={startPicker}
                placeholder={startPicker === undefined ? null : `${startPicker.getFullYear()}-${(startPicker.getMonth() + 1)}-${startPicker.getDate()}`}
                options={{
                  enableTime: false,
                  dateFormat: 'Y-m-d',
                  enable: [startPicker]
                }}
              />
            </div>
            <div className='d-flex mb-1'>
              <EventActions />
            </div>
        </Form>


      </DialogContent>
      <DialogActions>
      <Card >
            <CardTitle className='mb-0 ms-1 mt-1'><h5>Physician  On Leave</h5></CardTitle>
            <Row>
              {leaves.length > 0 ? leaves.map(dt => {
                return (
                  <Col lg='3' className='m-1'>
                    <Badge color='light-primary'>
                      {dt.firstName}
                    </Badge>
                  </Col>
                )
              }) : <p className='m-1'>No one on Leave</p>}
            </Row>
          </Card>
      </DialogActions>
    </Dialog>
  )
}

export default AddEventSidebar