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
  CardHeader,
  Avatar,
  Chip,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  LocalHospital as MedicalIcon,
  ContactPhone as ContactIcon,
  Info as InfoIcon
} from '@mui/icons-material';
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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const PatientProfile = ({ patientId, onClose, onUpdate }) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);

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
        // Prepare update data - password is optional for updates
        const updateData = { ...values };
        
        // If password is empty, send an empty string (backend will handle it)
        if (!updateData.password || updateData.password.trim() === '') {
          updateData.password = '';
        }
        
        const response = await api.put(
          `/patients/${patientId}`, 
          updateData
        );
        
        setPatient(response.data);
        setSuccess('Patient profile updated successfully!');
        setEditMode(false);
        
        if (onUpdate) {
          onUpdate(response.data);
        }
        
      } catch (err) {
        const errorMessage = err.response?.data?.message || 
                           err.response?.data || 
                           'Update failed. Please try again.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  // Fetch patient data
  const fetchPatient = async () => {
    if (!patientId) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await api.get(`/patients/${patientId}`);
      const patientData = response.data;
      
      setPatient(patientData);
      
      // Populate form with patient data
      formik.setValues({
        username: patientData.username || '',
        email: patientData.email || '',
        password: '',
        firstName: patientData.firstName || '',
        lastName: patientData.lastName || '',
        phone: patientData.phone || '',
        dateOfBirth: patientData.dateOfBirth || '',
        gender: patientData.gender || '',
        address: patientData.address || '',
        emergencyContact: patientData.emergencyContact || '',
        emergencyPhone: patientData.emergencyPhone || '',
        bloodType: patientData.bloodType || '',
        allergies: patientData.allergies || ''
      });
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         'Failed to fetch patient data. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const handleEditToggle = () => {
    if (editMode) {
      // Cancel edit - reset form to original values
      formik.resetForm();
      fetchPatient();
    }
    setEditMode(!editMode);
    setError('');
    setSuccess('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (!patient && !loading) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Alert severity="error">
          Patient not found or failed to load patient data.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Card>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              <PersonIcon fontSize="large" />
            </Avatar>
          }
          title={
            <Box>
              <Typography variant="h5">
                {patient ? patient.fullName : 'Loading...'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Patient ID: {patient?.patientNumber || 'Loading...'}
              </Typography>
            </Box>
          }
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              {!editMode ? (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEditToggle}
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleEditToggle}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={formik.handleSubmit}
                    disabled={loading}
                  >
                    Save Changes
                  </Button>
                </>
              )}
              {onClose && (
                <Button onClick={onClose} color="secondary">
                  Close
                </Button>
              )}
            </Box>
          }
        />
        
        {error && (
          <Alert severity="error" sx={{ mx: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mx: 2 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Personal Information" icon={<InfoIcon />} />
            <Tab label="Contact Details" icon={<ContactIcon />} />
            <Tab label="Medical Information" icon={<MedicalIcon />} />
          </Tabs>
        </Box>

        <form onSubmit={formik.handleSubmit}>
          {/* Personal Information Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  id="username"
                  name="username"
                  label="Username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  helperText={formik.touched.username && formik.errors.username}
                  disabled={!editMode}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
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
                  disabled={!editMode}
                />
              </Grid>
              {editMode && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    id="password"
                    name="password"
                    label="New Password (leave blank to keep current)"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                  />
                </Grid>
              )}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                  disabled={!editMode}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  disabled={!editMode}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
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
                  disabled={!editMode}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth disabled={!editMode}>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    id="gender"
                    name="gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    label="Gender"
                    error={formik.touched.gender && Boolean(formik.errors.gender)}
                  >
                    {genderOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {!editMode && (
                <Grid size={{ xs: 12 }}>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Age"
                        secondary={`${getAge(patient?.dateOfBirth)} years old`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Registration Date"
                        secondary={formatDate(patient?.createdAt)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Status"
                        secondary={
                          <Chip 
                            label={patient?.isActive ? 'Active' : 'Inactive'} 
                            color={patient?.isActive ? 'success' : 'error'}
                            size="small"
                          />
                        }
                      />
                    </ListItem>
                  </List>
                </Grid>
              )}
            </Grid>
          </TabPanel>

          {/* Contact Details Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  id="phone"
                  name="phone"
                  label="Phone Number"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                  disabled={!editMode}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  id="address"
                  name="address"
                  label="Address"
                  multiline
                  rows={3}
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                  disabled={!editMode}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  id="emergencyContact"
                  name="emergencyContact"
                  label="Emergency Contact Name"
                  value={formik.values.emergencyContact}
                  onChange={formik.handleChange}
                  error={formik.touched.emergencyContact && Boolean(formik.errors.emergencyContact)}
                  helperText={formik.touched.emergencyContact && formik.errors.emergencyContact}
                  disabled={!editMode}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  id="emergencyPhone"
                  name="emergencyPhone"
                  label="Emergency Contact Phone"
                  value={formik.values.emergencyPhone}
                  onChange={formik.handleChange}
                  error={formik.touched.emergencyPhone && Boolean(formik.errors.emergencyPhone)}
                  helperText={formik.touched.emergencyPhone && formik.errors.emergencyPhone}
                  disabled={!editMode}
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Medical Information Tab */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth disabled={!editMode}>
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
                  id="allergies"
                  name="allergies"
                  label="Allergies and Medical Notes"
                  multiline
                  rows={4}
                  placeholder="List any known allergies, medical conditions, or special notes..."
                  value={formik.values.allergies}
                  onChange={formik.handleChange}
                  error={formik.touched.allergies && Boolean(formik.errors.allergies)}
                  helperText={formik.touched.allergies && formik.errors.allergies}
                  disabled={!editMode}
                />
              </Grid>
            </Grid>
          </TabPanel>
        </form>
      </Card>
    </Container>
  );
};

export default PatientProfile;