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
  Divider
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFormik } from 'formik';
import * as yup from 'yup';
import api from '../../utils/api';

const validationSchema = yup.object({
  patientId: yup.number()
    .required('Patient is required'),
  doctorId: yup.number()
    .required('Doctor is required'),
  title: yup.string()
    .required('Title is required')
    .max(200, 'Title cannot exceed 200 characters'),
  recordDate: yup.date()
    .required('Record date is required')
});

const MedicalRecordForm = ({ onSuccess, onCancel, selectedPatient, selectedAppointment, existingRecord }) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const isEditing = Boolean(existingRecord);

  const formik = useFormik({
    initialValues: {
      patientId: existingRecord?.patientId || selectedPatient?.patientId || '',
      doctorId: existingRecord?.doctorId || '',
      appointmentId: existingRecord?.appointmentId || selectedAppointment?.appointmentId || '',
      title: existingRecord?.title || '',
      chiefComplaint: existingRecord?.chiefComplaint || '',
      historyPresentIllness: existingRecord?.historyPresentIllness || '',
      physicalExamination: existingRecord?.physicalExamination || '',
      vitalSigns: existingRecord?.vitalSigns || '',
      diagnosis: existingRecord?.diagnosis || '',
      treatmentPlan: existingRecord?.treatmentPlan || '',
      medications: existingRecord?.medications || '',
      labResults: existingRecord?.labResults || '',
      notes: existingRecord?.notes || '',
      followUpInstructions: existingRecord?.followUpInstructions || '',
      recordDate: existingRecord ? new Date(existingRecord.recordDate) : new Date()
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      setSuccess('');
      
      try {
        const requestData = {
          ...values,
          recordDate: values.recordDate.toISOString(),
          appointmentId: values.appointmentId || null
        };

        let response;
        if (isEditing) {
          response = await api.put(`/medical-records/${existingRecord.recordId}`, requestData);
          setSuccess('Medical record updated successfully!');
        } else {
          response = await api.post('/medical-records', requestData);
          setSuccess('Medical record created successfully!');
        }
        
        // Reset form after successful operation
        if (!isEditing) {
          formik.resetForm();
        }
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess(response.data);
        }
        
      } catch (err) {
        const errorMessage = err.response?.data?.message || 
                           err.response?.data || 
                           `Failed to ${isEditing ? 'update' : 'create'} medical record. Please try again.`;
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  // Load patients, doctors, and appointments on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setDataLoading(true);
        const [patientsRes, doctorsRes] = await Promise.all([
          api.get('/patients'),
          api.get('/users/role/doctor')
        ]);
        
        setPatients(patientsRes.data || []);
        setDoctors(doctorsRes.data || []);

        // Load appointments for selected patient
        if (formik.values.patientId) {
          try {
            const appointmentsRes = await api.get(`/appointments/patient/${formik.values.patientId}`);
            setAppointments(appointmentsRes.data?.content || appointmentsRes.data || []);
          } catch (appointmentErr) {
            console.error('Error loading appointments:', appointmentErr);
            setAppointments([]);
          }
        }
      } catch (err) {
        console.error('Error loading form data:', err);
        setError(`Failed to load form data: ${err.response?.data?.message || err.message}`);
        // Set default empty arrays to prevent crashes
        setPatients([]);
        setDoctors([]);
        setAppointments([]);
      } finally {
        setDataLoading(false);
      }
    };
    
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load appointments when patient changes
  useEffect(() => {
    if (formik.values.patientId) {
      const loadAppointments = async () => {
        try {
          const response = await api.get(`/appointments/patient/${formik.values.patientId}`);
          setAppointments(response.data?.content || response.data || []);
        } catch (err) {
          console.error('Failed to load appointments:', err);
          setAppointments([]);
        }
      };
      loadAppointments();
    } else {
      setAppointments([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.patientId]);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Card>
        <CardHeader 
          title={isEditing ? "Edit Medical Record" : "Create Medical Record"}
          subheader={isEditing ? "Update existing medical record" : "Create a new medical record for a patient"}
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

          {dataLoading && (
            <Box sx={{ mb: 2 }}>
              <Typography>Loading form data...</Typography>
            </Box>
          )}
          
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box component="form" onSubmit={formik.handleSubmit}>
              <Typography variant="h6" gutterBottom color="primary">
                Basic Information
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth error={formik.touched.patientId && Boolean(formik.errors.patientId)}>
                    <InputLabel>Select Patient</InputLabel>
                    <Select
                      id="patientId"
                      name="patientId"
                      value={formik.values.patientId}
                      onChange={formik.handleChange}
                      label="Select Patient"
                      disabled={Boolean(selectedPatient)}
                    >
                      {patients && patients.length > 0 ? patients.map((patient) => (
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
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth error={formik.touched.doctorId && Boolean(formik.errors.doctorId)}>
                    <InputLabel>Select Doctor</InputLabel>
                    <Select
                      id="doctorId"
                      name="doctorId"
                      value={formik.values.doctorId}
                      onChange={formik.handleChange}
                      label="Select Doctor"
                    >
                      {doctors && doctors.length > 0 ? doctors.map((doctor) => (
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
                  <FormControl fullWidth>
                    <InputLabel>Related Appointment (Optional)</InputLabel>
                    <Select
                      id="appointmentId"
                      name="appointmentId"
                      value={formik.values.appointmentId}
                      onChange={formik.handleChange}
                      label="Related Appointment (Optional)"
                    >
                      <MenuItem value="">None</MenuItem>
                      {appointments && appointments.length > 0 ? appointments.map((appointment) => (
                        <MenuItem key={appointment.appointmentId} value={appointment.appointmentId}>
                          {new Date(appointment.appointmentDateTime).toLocaleDateString()} - {appointment.appointmentType}
                        </MenuItem>
                      )) : null}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DateTimePicker
                    label="Record Date & Time"
                    value={formik.values.recordDate}
                    onChange={(newValue) => formik.setFieldValue('recordDate', newValue)}
                    maxDateTime={new Date()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.recordDate && Boolean(formik.errors.recordDate),
                        helperText: formik.touched.recordDate && formik.errors.recordDate,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    id="title"
                    name="title"
                    label="Record Title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                    placeholder="Brief title for this medical record..."
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom color="primary">
                Clinical Information
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    id="chiefComplaint"
                    name="chiefComplaint"
                    label="Chief Complaint"
                    multiline
                    rows={3}
                    value={formik.values.chiefComplaint}
                    onChange={formik.handleChange}
                    error={formik.touched.chiefComplaint && Boolean(formik.errors.chiefComplaint)}
                    helperText={formik.touched.chiefComplaint && formik.errors.chiefComplaint}
                    placeholder="Main reason for visit/concern..."
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    id="vitalSigns"
                    name="vitalSigns"
                    label="Vital Signs"
                    multiline
                    rows={3}
                    value={formik.values.vitalSigns}
                    onChange={formik.handleChange}
                    error={formik.touched.vitalSigns && Boolean(formik.errors.vitalSigns)}
                    helperText={formik.touched.vitalSigns && formik.errors.vitalSigns}
                    placeholder="BP, HR, RR, Temp, O2 Sat, etc."
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    id="historyPresentIllness"
                    name="historyPresentIllness"
                    label="History of Present Illness"
                    multiline
                    rows={4}
                    value={formik.values.historyPresentIllness}
                    onChange={formik.handleChange}
                    error={formik.touched.historyPresentIllness && Boolean(formik.errors.historyPresentIllness)}
                    helperText={formik.touched.historyPresentIllness && formik.errors.historyPresentIllness}
                    placeholder="Detailed history of the current illness..."
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    id="physicalExamination"
                    name="physicalExamination"
                    label="Physical Examination"
                    multiline
                    rows={4}
                    value={formik.values.physicalExamination}
                    onChange={formik.handleChange}
                    error={formik.touched.physicalExamination && Boolean(formik.errors.physicalExamination)}
                    helperText={formik.touched.physicalExamination && formik.errors.physicalExamination}
                    placeholder="Physical examination findings..."
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom color="primary">
                Assessment & Plan
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    id="diagnosis"
                    name="diagnosis"
                    label="Diagnosis"
                    multiline
                    rows={3}
                    value={formik.values.diagnosis}
                    onChange={formik.handleChange}
                    error={formik.touched.diagnosis && Boolean(formik.errors.diagnosis)}
                    helperText={formik.touched.diagnosis && formik.errors.diagnosis}
                    placeholder="Primary and secondary diagnoses..."
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    id="treatmentPlan"
                    name="treatmentPlan"
                    label="Treatment Plan"
                    multiline
                    rows={3}
                    value={formik.values.treatmentPlan}
                    onChange={formik.handleChange}
                    error={formik.touched.treatmentPlan && Boolean(formik.errors.treatmentPlan)}
                    helperText={formik.touched.treatmentPlan && formik.errors.treatmentPlan}
                    placeholder="Planned treatments and interventions..."
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    id="medications"
                    name="medications"
                    label="Medications"
                    multiline
                    rows={3}
                    value={formik.values.medications}
                    onChange={formik.handleChange}
                    error={formik.touched.medications && Boolean(formik.errors.medications)}
                    helperText={formik.touched.medications && formik.errors.medications}
                    placeholder="Prescribed medications and dosages..."
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    id="followUpInstructions"
                    name="followUpInstructions"
                    label="Follow-up Instructions"
                    multiline
                    rows={3}
                    value={formik.values.followUpInstructions}
                    onChange={formik.handleChange}
                    error={formik.touched.followUpInstructions && Boolean(formik.errors.followUpInstructions)}
                    helperText={formik.touched.followUpInstructions && formik.errors.followUpInstructions}
                    placeholder="Follow-up care instructions..."
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom color="primary">
                Additional Information
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    id="labResults"
                    name="labResults"
                    label="Lab Results"
                    multiline
                    rows={3}
                    value={formik.values.labResults}
                    onChange={formik.handleChange}
                    error={formik.touched.labResults && Boolean(formik.errors.labResults)}
                    helperText={formik.touched.labResults && formik.errors.labResults}
                    placeholder="Laboratory test results and imaging findings..."
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    id="notes"
                    name="notes"
                    label="Additional Notes"
                    multiline
                    rows={3}
                    value={formik.values.notes}
                    onChange={formik.handleChange}
                    error={formik.touched.notes && Boolean(formik.errors.notes)}
                    helperText={formik.touched.notes && formik.errors.notes}
                    placeholder="Any additional notes or observations..."
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
                  {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Record' : 'Create Record')}
                </Button>
              </Box>
            </Box>
          </LocalizationProvider>
        </CardContent>
      </Card>
    </Container>
  );
};

export default MedicalRecordForm;