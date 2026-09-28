import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Chip
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFormik } from 'formik';
import * as yup from 'yup';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

const validationSchema = yup.object({
  patientId: yup.number()
    .required('Patient is required'),
  doctorId: yup.number()
    .required('Doctor is required'),
  appointmentDateTime: yup.date()
    .required('Appointment date and time is required')
    .min(new Date(), 'Appointment must be in the future'),
  durationMinutes: yup.number()
    .min(15, 'Duration must be at least 15 minutes')
    .max(240, 'Duration cannot exceed 4 hours'),
  appointmentType: yup.string()
    .required('Appointment type is required'),
  reason: yup.string()
    .max(500, 'Reason cannot exceed 500 characters')
});

const appointmentTypes = [
  { value: 'CONSULTATION', label: 'General Consultation' },
  { value: 'FOLLOW_UP', label: 'Follow-up Visit' },
  { value: 'CHECKUP', label: 'Regular Checkup' },
  { value: 'EMERGENCY', label: 'Emergency' },
  { value: 'VACCINATION', label: 'Vaccination' },
  { value: 'SURGERY', label: 'Surgery' },
  { value: 'THERAPY', label: 'Therapy Session' },
  { value: 'DIAGNOSTIC', label: 'Diagnostic Test' }
];

const AppointmentScheduling = ({ onSuccess, onCancel, selectedPatient }) => {
  const { userRole, currentUser } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [currentPatient, setCurrentPatient] = useState(null);

  const formik = useFormik({
    initialValues: {
      patientId: selectedPatient?.patientId || currentPatient?.patientId || '',
      doctorId: '',
      appointmentDateTime: new Date(),
      durationMinutes: 30,
      appointmentType: 'CONSULTATION',
      reason: '',
      notes: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      setSuccess('');
      
      try {
        const response = await api.post('/appointments', {
          ...values,
          appointmentDateTime: values.appointmentDateTime.toISOString()
        });
        
        setSuccess('Appointment scheduled successfully!');
        
        // Reset form after successful scheduling
        formik.resetForm();
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess(response.data);
        }
        
      } catch (err) {
        const errorMessage = err.response?.data?.message || 
                           err.response?.data || 
                           'Failed to schedule appointment. Please try again.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  // Load current patient data if user is a patient
  useEffect(() => {
    const loadCurrentPatient = async () => {
      if (userRole === 'PATIENT' && currentUser?.username) {
        try {
          console.log('Loading current patient data for:', currentUser.username);
          
          // Find patient by username
          const patientsRes = await api.get('/patients');
          const allPatients = patientsRes.data || [];
          const patient = allPatients.find(p => p.username === currentUser.username);
          
          if (patient) {
            console.log('Current patient found:', patient);
            setCurrentPatient(patient);
            // Auto-select the current patient
            formik.setFieldValue('patientId', patient.patientId);
          } else {
            setError('Patient profile not found. Please contact administrator.');
          }
        } catch (err) {
          console.error('Error loading current patient:', err);
          setError('Failed to load your patient profile.');
        }
      }
    };

    loadCurrentPatient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole, currentUser]);

  // Load patients and doctors on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      try {
        console.log('Loading patients and doctors...');
        
        const apiCalls = [api.get('/users/role/doctor')];
        
        // Only load all patients if user is not a patient (for staff members)
        if (userRole !== 'PATIENT') {
          apiCalls.push(api.get('/patients'));
        }
        
        const responses = await Promise.all(apiCalls);
        const doctorsRes = responses[0];
        const patientsRes = responses[1];
        
        console.log('Doctors loaded:', doctorsRes.data);
        setDoctors(doctorsRes.data || []);
        
        if (patientsRes) {
          console.log('Patients loaded:', patientsRes.data);
          setPatients(patientsRes.data || []);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError(`Failed to load data: ${err.response?.data || err.message}`);
      } finally {
        setLoadingData(false);
      }
    };
    
    loadData();
  }, [userRole]);

  // Check doctor availability whenever the doctor or date changes
  useEffect(() => {
    if (formik.values.doctorId && formik.values.appointmentDateTime) {
      checkDoctorAvailability();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.doctorId, formik.values.appointmentDateTime]);

  const checkDoctorAvailability = async () => {
    setLoadingAvailability(true);
    try {
      const date = formik.values.appointmentDateTime.toISOString().split('T')[0];
      const response = await api.get(`/appointments/doctors/${formik.values.doctorId}/availability`, {
        params: { date },
      });
      setAvailability(response.data);
    } catch (err) {
      console.error('Failed to load availability:', err);
      setAvailability(null);
    } finally {
      setLoadingAvailability(false);
    }
  };

  const getAvailabilityStatus = () => {
    if (!formik.values.doctorId) return null;
    if (loadingAvailability) {
      return <Chip label="Checking availability..." size="small" />;
    }
    if (!availability?.availableSlots) {
      return <Chip label="Availability unknown" size="small" />;
    }

    const selected = formik.values.appointmentDateTime?.getTime();
    const isFree = availability.availableSlots.some((slot) => {
      const start = new Date(slot.startTime).getTime();
      const end = new Date(slot.endTime).getTime();
      return slot.isAvailable && selected >= start && selected < end;
    });

    return isFree ? (
      <Chip label="Doctor available" color="success" size="small" />
    ) : (
      <Chip label="Doctor may be unavailable" color="warning" size="small" />
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Card>
        <CardHeader 
          title="Schedule Appointment"
          subheader="Book a new appointment for a patient"
        />
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box component="form" onSubmit={formik.handleSubmit}>
              <Typography variant="h6" gutterBottom color="primary">
                Patient Information
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12 }}>
                  {userRole === 'PATIENT' ? (
                    // Show patient info for logged-in patients
                    currentPatient ? (
                      <Card variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Typography variant="body1" gutterBottom>
                          <strong>Patient:</strong> {currentPatient.fullName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Patient Number: {currentPatient.patientNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Email: {currentUser?.email}
                        </Typography>
                      </Card>
                    ) : (
                      <Alert severity="info">
                        Loading your patient information...
                      </Alert>
                    )
                  ) : (
                    // Show dropdown for staff members
                    <FormControl fullWidth error={formik.touched.patientId && Boolean(formik.errors.patientId)}>
                      <InputLabel>Select Patient</InputLabel>
                      <Select
                        id="patientId"
                        name="patientId"
                        value={formik.values.patientId}
                        onChange={formik.handleChange}
                        label="Select Patient"
                        disabled={Boolean(selectedPatient) || loadingData}
                      >
                        {loadingData ? (
                          <MenuItem disabled>Loading patients...</MenuItem>
                        ) : patients && patients.length > 0 ? patients.map((patient) => (
                          <MenuItem key={patient.patientId} value={patient.patientId}>
                            {patient.fullName} ({patient.patientNumber})
                          </MenuItem>
                        )) : (
                          <MenuItem disabled>No patients available</MenuItem>
                        )}
                      </Select>
                      {formik.touched.patientId && formik.errors.patientId && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                          {formik.errors.patientId}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom color="primary">
                Appointment Details
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth error={formik.touched.doctorId && Boolean(formik.errors.doctorId)}>
                    <InputLabel>Select Doctor</InputLabel>
                    <Select
                      id="doctorId"
                      name="doctorId"
                      value={formik.values.doctorId}
                      onChange={formik.handleChange}
                      label="Select Doctor"
                      disabled={loadingData}
                    >
                      {loadingData ? (
                        <MenuItem disabled>Loading doctors...</MenuItem>
                      ) : doctors && doctors.length > 0 ? doctors.map((doctor) => (
                        <MenuItem key={doctor.userId} value={doctor.userId}>
                          Dr. {doctor.firstName} {doctor.lastName}
                        </MenuItem>
                      )) : (
                        <MenuItem disabled>No doctors available</MenuItem>
                      )}
                    </Select>
                    {formik.touched.doctorId && formik.errors.doctorId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {formik.errors.doctorId}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth error={formik.touched.appointmentType && Boolean(formik.errors.appointmentType)}>
                    <InputLabel>Appointment Type</InputLabel>
                    <Select
                      id="appointmentType"
                      name="appointmentType"
                      value={formik.values.appointmentType}
                      onChange={formik.handleChange}
                      label="Appointment Type"
                    >
                      {appointmentTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.appointmentType && formik.errors.appointmentType && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {formik.errors.appointmentType}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DateTimePicker
                    label="Appointment Date & Time"
                    value={formik.values.appointmentDateTime}
                    onChange={(newValue) => formik.setFieldValue('appointmentDateTime', newValue)}
                    minDateTime={new Date()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.appointmentDateTime && Boolean(formik.errors.appointmentDateTime),
                        helperText: formik.touched.appointmentDateTime && formik.errors.appointmentDateTime,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      fullWidth
                      id="durationMinutes"
                      name="durationMinutes"
                      label="Duration (minutes)"
                      type="number"
                      value={formik.values.durationMinutes}
                      onChange={formik.handleChange}
                      error={formik.touched.durationMinutes && Boolean(formik.errors.durationMinutes)}
                      helperText={formik.touched.durationMinutes && formik.errors.durationMinutes}
                    />
                    {getAvailabilityStatus()}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    id="reason"
                    name="reason"
                    label="Reason for Visit"
                    multiline
                    rows={3}
                    value={formik.values.reason}
                    onChange={formik.handleChange}
                    error={formik.touched.reason && Boolean(formik.errors.reason)}
                    helperText={formik.touched.reason && formik.errors.reason}
                    placeholder="Brief description of the reason for this appointment..."
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    id="notes"
                    name="notes"
                    label="Additional Notes"
                    multiline
                    rows={2}
                    value={formik.values.notes}
                    onChange={formik.handleChange}
                    error={formik.touched.notes && Boolean(formik.errors.notes)}
                    helperText={formik.touched.notes && formik.errors.notes}
                    placeholder="Any additional notes or special requirements..."
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                {onCancel && (
                  <Button variant="outlined" onClick={onCancel} disabled={loading}>
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ minWidth: 120 }}
                >
                  {loading ? 'Scheduling...' : 'Schedule Appointment'}
                </Button>
              </Box>
            </Box>
          </LocalizationProvider>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AppointmentScheduling;