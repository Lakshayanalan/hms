import React, { useState } from 'react';
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
import { useFormik } from 'formik';
import * as yup from 'yup';
import api from '../../utils/api';

const validationSchema = yup.object({
  username: yup.string()
    .min(3, 'Username should be of minimum 3 characters length')
    .required('Username is required'),
  email: yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup.string()
    .min(6, 'Password should be of minimum 6 characters length')
    .required('Password is required'),
  firstName: yup.string()
    .required('First name is required'),
  lastName: yup.string()
    .required('Last name is required'),
  phone: yup.string()
    .matches(/^[+]?[0-9\-\s()]*$/, 'Invalid phone number format'),
  dateOfBirth: yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future'),
  gender: yup.string()
    .required('Gender is required'),
  emergencyPhone: yup.string()
    .matches(/^[+]?[0-9\-\s()]*$/, 'Invalid phone number format'),
});

const genderOptions = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' }
];

const bloodTypeOptions = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

const PatientRegistration = ({ onSuccess, onCancel }) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      emergencyContact: '',
      emergencyPhone: '',
      bloodType: '',
      allergies: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      setSuccess('');
      
      try {
        const response = await api.post('/patients/register', values);
        
        setSuccess(`Patient registered successfully! Patient Number: ${response.data.patientNumber}`);
        
        // Reset form after successful registration
        formik.resetForm();
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess(response.data);
        }
        
      } catch (err) {
        const errorMessage = err.response?.data?.message || 
                           err.response?.data || 
                           'Registration failed. Please try again.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Card>
        <CardHeader 
          title="Patient Registration"
          subheader="Register a new patient in the system"
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
          
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Typography variant="h6" gutterBottom color="primary">
              User Account Information
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  id="username"
                  name="username"
                  label="Username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  helperText={formik.touched.username && formik.errors.username}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom color="primary">
              Personal Information
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  id="phone"
                  name="phone"
                  label="Phone Number"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  id="dateOfBirth"
                  name="dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formik.values.dateOfBirth}
                  onChange={formik.handleChange}
                  error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
                  helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth error={formik.touched.gender && Boolean(formik.errors.gender)}>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    id="gender"
                    name="gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    label="Gender"
                  >
                    {genderOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.gender && formik.errors.gender && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                      {formik.errors.gender}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Blood Type</InputLabel>
                  <Select
                    id="bloodType"
                    name="bloodType"
                    value={formik.values.bloodType}
                    onChange={formik.handleChange}
                    label="Blood Type"
                  >
                    {bloodTypeOptions.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  id="address"
                  name="address"
                  label="Address"
                  multiline
                  rows={2}
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom color="primary">
              Emergency Contact
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  id="emergencyContact"
                  name="emergencyContact"
                  label="Emergency Contact Name"
                  value={formik.values.emergencyContact}
                  onChange={formik.handleChange}
                  error={formik.touched.emergencyContact && Boolean(formik.errors.emergencyContact)}
                  helperText={formik.touched.emergencyContact && formik.errors.emergencyContact}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  id="emergencyPhone"
                  name="emergencyPhone"
                  label="Emergency Contact Phone"
                  value={formik.values.emergencyPhone}
                  onChange={formik.handleChange}
                  error={formik.touched.emergencyPhone && Boolean(formik.errors.emergencyPhone)}
                  helperText={formik.touched.emergencyPhone && formik.errors.emergencyPhone}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom color="primary">
              Medical Information
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  id="allergies"
                  name="allergies"
                  label="Allergies and Medical Notes"
                  multiline
                  rows={3}
                  placeholder="List any known allergies, medical conditions, or special notes..."
                  value={formik.values.allergies}
                  onChange={formik.handleChange}
                  error={formik.touched.allergies && Boolean(formik.errors.allergies)}
                  helperText={formik.touched.allergies && formik.errors.allergies}
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
                {loading ? 'Registering...' : 'Register Patient'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PatientRegistration;