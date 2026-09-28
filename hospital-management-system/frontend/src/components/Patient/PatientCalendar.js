import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Chip,
  Grid,
  IconButton
} from '@mui/material';
import { RefreshRounded as RefreshIcon } from '@mui/icons-material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
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

const PatientCalendar = () => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadAppointments = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');
    
    try {
      // First get patient data by user ID, then fetch appointments
      const patientResponse = await api.get(`/patients/user/${currentUser.userId}`);
      const patientId = patientResponse.data.patientId;
      
      const response = await api.get(`/appointments/patient/${patientId}`);
      
      // Handle paginated response
      let appointments = response.data;
      if (appointments && typeof appointments === 'object' && appointments.content) {
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
          title: `${appointment.doctorName || 'Doctor'} - ${appointment.appointmentType || 'Appointment'}`,
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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAppointments();
    
    // Set up auto-refresh every 30 seconds to catch status updates
    const interval = setInterval(() => {
      loadAppointments(true);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [currentUser.userId]);

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
        {event.resource.doctorName || 'Doctor'}
      </Typography>
      <Typography variant="caption" sx={{ display: 'block' }}>
        {event.resource.appointmentType}
      </Typography>
      <Chip
        label={event.resource.status}
        size="small"
        sx={{ 
          fontSize: '9px', 
          height: '14px',
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
          <button onClick={goToBack} style={{ padding: '8px 16px', fontSize: '14px' }}>
            Previous
          </button>
          <button onClick={goToCurrent} style={{ padding: '8px 16px', fontSize: '14px' }}>
            Today
          </button>
          <button onClick={goToNext} style={{ padding: '8px 16px', fontSize: '14px' }}>
            Next
          </button>
        </Box>
        
        <Typography variant="h6" component="h2" sx={{ flexGrow: 1, textAlign: 'center' }}>
          {toolbar.label}
        </Typography>
        
        <IconButton 
          onClick={() => loadAppointments(true)}
          disabled={refreshing}
          title="Refresh appointments"
        >
          {refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
        </IconButton>
      </Box>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            My Appointment Calendar
          </Typography>
          <Typography variant="body2" color="textSecondary">
            View your scheduled appointments and their current status
          </Typography>
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
              eventPropGetter={eventStyleGetter}
              components={{
                event: CustomEvent,
                toolbar: CustomToolbar
              }}
              views={['month', 'week', 'day']}
              defaultView="month"
              step={30}
              timeslots={2}
              min={new Date(0, 0, 0, 8, 0, 0)} // 8 AM
              max={new Date(0, 0, 0, 18, 0, 0)} // 6 PM
            />
          </Box>
        )}

        {/* Status Legend */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
            Appointment Status Guide:
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                Request Status:
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
            </Grid>
            
            <Grid size={{ xs: 12, md: 4 }}>
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
                  label="Confirmed"
                  sx={{ 
                    backgroundColor: appointmentStatusColors.CONFIRMED, 
                    color: 'white',
                    fontSize: '11px'
                  }}
                  size="small"
                />
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, md: 4 }}>
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
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2, p: 2, backgroundColor: 'background.default', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
              <strong>How it works:</strong> After you request an appointment, the doctor will review and either approve or reject it. 
              Once approved, your appointment will be confirmed and you'll see the status change from gray → orange → blue → green.
              The calendar automatically refreshes every 30 seconds to show the latest status.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default PatientCalendar;