import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../../utils/api';
import { appointmentStatusColors } from '../../theme/tokens';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const AppointmentCalendar = ({ doctorId, onSelectSlot, onSelectEvent }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(doctorId || '');

  const loadAppointments = async () => {
    if (!selectedDoctor) {
      setEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await api.get(`/appointments/doctor/${selectedDoctor}`);
      
      // Handle paginated response
      let appointments = response.data;
      if (appointments && typeof appointments === 'object' && appointments.content) {
        // This is a paginated response
        appointments = appointments.content;
      }
      
      // Ensure appointments is an array
      if (!Array.isArray(appointments)) {
        console.warn('Appointments data is not an array:', appointments);
        setEvents([]);
        setError('Invalid appointments data format');
        return;
      }
      
      const calendarEvents = appointments.map(appointment => {
        // Validate appointment object
        if (!appointment.appointmentId || !appointment.appointmentDateTime) {
          console.warn('Invalid appointment data:', appointment);
          return null;
        }
        
        return {
          id: appointment.appointmentId,
          title: `${appointment.patientName || 'Unknown Patient'} - ${appointment.appointmentType || 'Appointment'}`,
          start: new Date(appointment.appointmentDateTime),
          end: new Date(new Date(appointment.appointmentDateTime).getTime() + (appointment.durationMinutes || 30) * 60000),
          resource: appointment,
          color: appointmentStatusColors[appointment.status] || appointmentStatusColors.REQUESTED
        };
      }).filter(event => event !== null); // Remove any null events
      
      setEvents(calendarEvents);
    } catch (err) {
      setError('Failed to load appointments');
      console.error('Error loading appointments:', err);
      setEvents([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const loadDoctors = async () => {
    try {
      const response = await api.get('/appointments/doctors');
      const doctorsData = response.data;
      
      // Ensure doctors data is an array
      if (!Array.isArray(doctorsData)) {
        console.warn('Doctors data is not an array:', doctorsData);
        setDoctors([]);
        return;
      }
      
      setDoctors(doctorsData);
      
      if (!doctorId && doctorsData.length > 0) {
        setSelectedDoctor(doctorsData[0].userId);
      }
    } catch (err) {
      setError('Failed to load doctors');
      console.error('Error loading doctors:', err);
      setDoctors([]); // Set empty array on error
    }
  };

  useEffect(() => {
    loadDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadAppointments();

    // Set up auto-refresh every 30 seconds to catch status updates
    const interval = setInterval(() => {
      loadAppointments();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDoctor]);

  const handleSelectSlot = (slotInfo) => {
    if (onSelectSlot) {
      onSelectSlot({
        start: slotInfo.start,
        end: slotInfo.end,
        doctorId: selectedDoctor
      });
    }
  };

  const handleSelectEvent = (event) => {
    if (onSelectEvent) {
      onSelectEvent(event.resource);
    }
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.color,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '12px'
      }
    };
  };

  const CustomEvent = ({ event }) => (
    <Box sx={{ p: 0.5 }}>
      <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>
        {event.resource.patientName}
      </Typography>
      <Typography variant="caption" sx={{ display: 'block' }}>
        {event.resource.appointmentType}
      </Typography>
      <Chip
        label={event.resource.status}
        size="small"
        sx={{ 
          fontSize: '10px', 
          height: '16px',
          backgroundColor: 'rgba(255,255,255,0.3)',
          color: 'white'
        }}
      />
    </Box>
  );

  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
      toolbar.onNavigate('NEXT');
    };

    const goToCurrent = () => {
      toolbar.onNavigate('TODAY');
    };

    const goToView = (view) => {
      toolbar.onView(view);
    };

    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={goToBack} size="small">
            Previous
          </Button>
          <Button onClick={goToCurrent} size="small" variant="outlined">
            Today
          </Button>
          <Button onClick={goToNext} size="small">
            Next
          </Button>
        </Box>
        
        <Typography variant="h6" component="h2" sx={{ flexGrow: 1, textAlign: 'center' }}>
          {toolbar.label}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            onClick={() => goToView('month')}
            variant={toolbar.view === 'month' ? 'contained' : 'outlined'}
            size="small"
          >
            Month
          </Button>
          <Button
            onClick={() => goToView('week')}
            variant={toolbar.view === 'week' ? 'contained' : 'outlined'}
            size="small"
          >
            Week
          </Button>
          <Button
            onClick={() => goToView('day')}
            variant={toolbar.view === 'day' ? 'contained' : 'outlined'}
            size="small"
          >
            Day
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Appointment Calendar
          </Typography>
          
          {!doctorId && (
            <FormControl sx={{ minWidth: 200, mb: 2 }}>
              <InputLabel>Select Doctor</InputLabel>
              <Select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                label="Select Doctor"
              >
                {doctors.map((doctor) => (
                  <MenuItem key={doctor.userId} value={doctor.userId}>
                    Dr. {doctor.firstName} {doctor.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ height: 600 }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              selectable
              popup
              eventPropGetter={eventStyleGetter}
              components={{
                event: CustomEvent,
                toolbar: CustomToolbar
              }}
              views={['month', 'week', 'day']}
              defaultView="week"
              step={30}
              timeslots={2}
              min={new Date(0, 0, 0, 8, 0, 0)} // 8 AM
              max={new Date(0, 0, 0, 18, 0, 0)} // 6 PM
            />
          </Box>
        )}

        {/* Legend */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
            Appointment Status Legend:
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                Initial Status:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip
                  label="Requested"
                  sx={{ 
                    backgroundColor: appointmentStatusColors.REQUESTED, 
                    color: 'white',
                    fontSize: '11px'
                  }}
                  size="small"
                />
                <Chip
                  label="Pending Approval"
                  sx={{ 
                    backgroundColor: appointmentStatusColors.PENDING_APPROVAL, 
                    color: 'white',
                    fontSize: '11px'
                  }}
                  size="small"
                />
              </Box>
              
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                Doctor Response:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip
                  label="Approved"
                  sx={{ 
                    backgroundColor: appointmentStatusColors.APPROVED, 
                    color: 'white',
                    fontSize: '11px'
                  }}
                  size="small"
                />
                <Chip
                  label="Rejected"
                  sx={{ 
                    backgroundColor: appointmentStatusColors.REJECTED, 
                    color: 'white',
                    fontSize: '11px'
                  }}
                  size="small"
                />
                <Chip
                  label="Rescheduled"
                  sx={{ 
                    backgroundColor: appointmentStatusColors.RESCHEDULED, 
                    color: 'white',
                    fontSize: '11px'
                  }}
                  size="small"
                />
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                Appointment Day:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip
                  label="Confirmed"
                  sx={{ 
                    backgroundColor: appointmentStatusColors.CONFIRMED, 
                    color: 'white',
                    fontSize: '11px'
                  }}
                  size="small"
                />
                <Chip
                  label="In Progress"
                  sx={{ 
                    backgroundColor: appointmentStatusColors.IN_PROGRESS, 
                    color: 'white',
                    fontSize: '11px'
                  }}
                  size="small"
                />
              </Box>
              
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                Final Status:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label="Completed"
                  sx={{ 
                    backgroundColor: appointmentStatusColors.COMPLETED, 
                    color: 'white',
                    fontSize: '11px'
                  }}
                  size="small"
                />
                <Chip
                  label="Cancelled"
                  sx={{ 
                    backgroundColor: appointmentStatusColors.CANCELLED, 
                    color: 'white',
                    fontSize: '11px'
                  }}
                  size="small"
                />
                <Chip
                  label="No Show"
                  sx={{ 
                    backgroundColor: appointmentStatusColors.NO_SHOW, 
                    color: 'white',
                    fontSize: '11px'
                  }}
                  size="small"
                />
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2, p: 2, backgroundColor: 'background.default', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
              <strong>Appointment Flow:</strong> Patient requests appointment → Doctor approval required → 
              Once approved, appointment gets confirmed → During appointment time, status shows "In Progress" → 
              Finally marked as "Completed", "Cancelled", or "No Show"
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AppointmentCalendar;