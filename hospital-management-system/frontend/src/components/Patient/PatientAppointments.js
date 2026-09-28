import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

const PatientAppointments = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [appointmentForm, setAppointmentForm] = useState({
    doctorId: '',
    appointmentDateTime: new Date(),
    reason: '',
    appointmentType: 'CONSULTATION'
  });

  const appointmentTypes = [
    'CONSULTATION',
    'FOLLOW_UP',
    'CHECKUP',
    'EMERGENCY',
    'VACCINATION',
    'THERAPY'
  ];

  const statusColors = {
    REQUESTED: 'default',            // Gray - Patient requested appointment
    PENDING_APPROVAL: 'warning',     // Orange - Waiting for doctor approval
    APPROVED: 'primary',             // Blue - Doctor approved the appointment
    REJECTED: 'error',               // Red - Doctor rejected the appointment
    RESCHEDULED: 'secondary',        // Purple - Appointment was rescheduled
    CONFIRMED: 'success',            // Green - Final confirmation before appointment
    IN_PROGRESS: 'warning',          // Orange - Appointment is currently happening
    COMPLETED: 'success',            // Green - Appointment finished successfully
    CANCELLED: 'error',              // Red - Cancelled by patient or system
    NO_SHOW: 'default'              // Gray - Patient didn't show up
  };

  const fetchAppointments = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      // First get patient data by user ID, then fetch appointments
      const patientResponse = await api.get(`/patients/user/${currentUser.userId}`);
      const patientId = patientResponse.data.patientId;
      
      const response = await api.get(`/appointments/patient/${patientId}`);
      
      // Handle paginated response
      let appointments = response.data;
      if (appointments && typeof appointments === 'object' && appointments.content) {
        // This is a paginated response
        appointments = appointments.content;
      }
      
      // Ensure appointments is an array
      if (!Array.isArray(appointments)) {
        console.warn('Appointments data is not an array:', appointments);
        appointments = [];
      }
      
      setAppointments(appointments);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUser.userId]);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/users/role/DOCTOR');
      setDoctors(response.data);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    
    // Set up auto-refresh every 30 seconds to catch status updates
    const interval = setInterval(() => {
      fetchAppointments(true); // Show refresh indicator for auto-refresh
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchAppointments]);

  const handleNewAppointment = () => {
    setSelectedAppointment(null);
    setAppointmentForm({
      doctorId: '',
      appointmentDateTime: new Date(),
      reason: '',
      appointmentType: 'CONSULTATION'
    });
    setOpenDialog(true);
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setAppointmentForm({
      doctorId: appointment.doctorId,
      appointmentDateTime: new Date(appointment.appointmentDateTime),
      reason: appointment.reason,
      appointmentType: appointment.appointmentType
    });
    setOpenDialog(true);
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await api.put(`/appointments/${appointmentId}/cancel`);
        setSuccess('Appointment cancelled successfully');
        fetchAppointments();
      } catch (error) {
        console.error('Failed to cancel appointment:', error);
        setError('Failed to cancel appointment');
      }
    }
  };

  const handleSubmitAppointment = async () => {
    try {
      setError('');
      
      // Get patient ID first
      const patientResponse = await api.get(`/patients/user/${currentUser.userId}`);
      const patientId = patientResponse.data.patientId;
      
      const appointmentData = {
        ...appointmentForm,
        patientId: patientId
      };

      if (selectedAppointment) {
        await api.put(`/appointments/${selectedAppointment.appointmentId}`, appointmentData);
        setSuccess('Appointment updated successfully');
      } else {
        await api.post('/appointments', appointmentData);
        setSuccess('Appointment scheduled successfully');
      }

      setOpenDialog(false);
      fetchAppointments();
    } catch (error) {
      console.error('Failed to save appointment:', error);
      setError('Failed to save appointment');
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.userId === doctorId);
    return doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Unknown Doctor';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            My Appointments
          </Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshIcon />}
              onClick={() => fetchAppointments(true)}
              disabled={refreshing}
              sx={{ mr: 1 }}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNewAppointment}
            >
              Request Appointment
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <CalendarIcon sx={{ mr: 1 }} />
                  Appointment History
                </Typography>
                
                {appointments.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      No appointments found. Click "Request Appointment" to schedule your first appointment.
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {appointments.map((appointment, index) => (
                      <React.Fragment key={appointment.appointmentId}>
                        <ListItem>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="subtitle1">
                                  {getDoctorName(appointment.doctorId)}
                                </Typography>
                                <Chip 
                                  label={appointment.status} 
                                  color={statusColors[appointment.status]}
                                  size="small"
                                />
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" color="textSecondary" component="span">
                                  <ScheduleIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                                  {formatDateTime(appointment.appointmentDateTime)}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }} component="div">
                                  <strong>Type:</strong> {appointment.appointmentType} | 
                                  <strong> Reason:</strong> {appointment.reason || 'No reason provided'}
                                </Typography>
                                {appointment.status === 'APPROVED' && (
                                  <Typography variant="body2" sx={{ mt: 0.5, color: 'success.main', fontWeight: 'bold' }} component="div">
                                    ✓ Your appointment has been approved by the doctor!
                                  </Typography>
                                )}
                                {appointment.status === 'REJECTED' && (
                                  <Typography variant="body2" sx={{ mt: 0.5, color: 'error.main', fontWeight: 'bold' }} component="div">
                                    ✗ Your appointment has been rejected. Please contact the hospital for more information.
                                  </Typography>
                                )}
                                {appointment.status === 'CONFIRMED' && (
                                  <Typography variant="body2" sx={{ mt: 0.5, color: 'success.main', fontWeight: 'bold' }} component="div">
                                    ✓ Your appointment is confirmed! Please arrive 15 minutes early.
                                  </Typography>
                                )}
                                {appointment.notes && (
                                  <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }} component="div">
                                    <strong>Notes:</strong> {appointment.notes}
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            {(appointment.status === 'REQUESTED' || appointment.status === 'PENDING_APPROVAL' || appointment.status === 'APPROVED' || appointment.status === 'CONFIRMED') && (
                              <Box>
                                <IconButton 
                                  edge="end" 
                                  onClick={() => handleEditAppointment(appointment)}
                                  sx={{ mr: 1 }}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton 
                                  edge="end" 
                                  onClick={() => handleCancelAppointment(appointment.appointmentId)}
                                  color="error"
                                >
                                  <CancelIcon />
                                </IconButton>
                              </Box>
                            )}
                          </ListItemSecondaryAction>
                        </ListItem>
                        {index < appointments.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Appointment Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {selectedAppointment ? 'Edit Appointment' : 'Request New Appointment'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Doctor</InputLabel>
                <Select
                  value={appointmentForm.doctorId}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, doctorId: e.target.value })}
                  label="Doctor"
                >
                  {doctors.map((doctor) => (
                    <MenuItem key={doctor.userId} value={doctor.userId}>
                      Dr. {doctor.firstName} {doctor.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <DateTimePicker
                label="Appointment Date & Time"
                value={appointmentForm.appointmentDateTime}
                onChange={(newValue) => setAppointmentForm({ ...appointmentForm, appointmentDateTime: newValue })}
                minDateTime={new Date()}
                sx={{ width: '100%', mb: 3 }}
              />

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Appointment Type</InputLabel>
                <Select
                  value={appointmentForm.appointmentType}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, appointmentType: e.target.value })}
                  label="Appointment Type"
                >
                  {appointmentTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Reason for Visit"
                value={appointmentForm.reason}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, reason: e.target.value })}
                multiline
                rows={3}
                helperText="Please describe the reason for your visit"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmitAppointment} variant="contained">
              {selectedAppointment ? 'Update' : 'Request'} Appointment
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default PatientAppointments;