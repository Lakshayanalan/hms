import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocalHospital as MedicalIcon,
  Cake as BirthdayIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { apiRequest } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

const PatientMyProfile = () => {
  const { currentUser } = useAuth();
  const [patientData, setPatientData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: null,
    gender: '',
    bloodType: '',
    address: '',
    allergies: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genderOptions = ['MALE', 'FEMALE', 'OTHER'];

  const fetchPatientData = useCallback(async () => {
    try {
      setLoading(true);
      const [patientData, userData] = await Promise.all([
        apiRequest('GET', `/patients/user/${currentUser.userId}`),
        apiRequest('GET', `/users/${currentUser.userId}`)
      ]);
      
      setPatientData(patientData);
      setUserData(userData);
      
      // Initialize edit form with current data
      setEditForm({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        dateOfBirth: patientData.dateOfBirth ? new Date(patientData.dateOfBirth) : null,
        gender: patientData.gender || '',
        bloodType: patientData.bloodType || '',
        address: patientData.address || '',
        allergies: patientData.allergies || '',
        emergencyContact: patientData.emergencyContact || '',
        emergencyPhone: patientData.emergencyPhone || ''
      });
    } catch (error) {
      console.error('Failed to fetch patient data:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  }, [currentUser.userId]);

  useEffect(() => {
    fetchPatientData();
  }, [fetchPatientData]);

  const handleEditToggle = () => {
    if (editing) {
      // Reset form if cancelling
      setEditForm({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        dateOfBirth: patientData.dateOfBirth ? new Date(patientData.dateOfBirth) : null,
        gender: patientData.gender || '',
        bloodType: patientData.bloodType || '',
        address: patientData.address || '',
        allergies: patientData.allergies || '',
        emergencyContact: patientData.emergencyContact || '',
        emergencyPhone: patientData.emergencyPhone || ''
      });
    }
    setEditing(!editing);
    setError('');
    setSuccess('');
  };

  const handlePasswordChange = async () => {
    try {
      setError('');
      setSuccess('');

      // Validate form
      if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
        setError('Please fill in all fields');
        return;
      }

      if (passwordForm.newPassword.length < 6) {
        setError('New password must be at least 6 characters long');
        return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setError('New passwords do not match');
        return;
      }

      // Call API to change password
      await apiRequest('PUT', `/users/${currentUser.userId}/password`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      // Reset form and show success message
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setSuccess('Password changed successfully');
      setOpenPasswordDialog(false);
    } catch (error) {
      console.error('Error changing password:', error);
      setError(error.response?.data?.message || 'Failed to change password. Please try again.');
    }
  };

  const handleSaveProfile = async () => {
    try {
      setError('');
      
      // Create complete patient update request with both user and patient data
      const patientUpdateData = {
        // User fields (required by PatientRegistrationRequest)
        username: userData.username, // Keep existing username
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        phone: editForm.phone,
        password: '', // Empty password for updates (backend handles this)
        
        // Patient fields
        dateOfBirth: editForm.dateOfBirth ? editForm.dateOfBirth.toISOString().split('T')[0] : null,
        gender: editForm.gender,
        bloodType: editForm.bloodType,
        address: editForm.address,
        allergies: editForm.allergies,
        emergencyContact: editForm.emergencyContact,
        emergencyPhone: editForm.emergencyPhone
      };

      // Update both user and patient data in a single request
      await apiRequest('PUT', `/patients/${patientData.patientId}`, patientUpdateData);

      setSuccess('Profile updated successfully');
      setEditing(false);
      fetchPatientData(); // Refresh data
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError(error.response?.data || 'Failed to update profile');
    }
  };


  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'Unknown';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!patientData || !userData) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error">Failed to load profile data</Alert>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            My Profile
          </Typography>
          <Box>
            <Button
              variant="outlined"
              onClick={() => setOpenPasswordDialog(true)}
              sx={{ mr: 2 }}
            >
              Change Password
            </Button>
            <Button
              variant={editing ? "outlined" : "contained"}
              startIcon={editing ? <CancelIcon /> : <EditIcon />}
              onClick={handleEditToggle}
              sx={{ mr: 1 }}
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </Button>
            {editing && (
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveProfile}
                color="success"
              >
                Save Changes
              </Button>
            )}
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
          {/* Personal Information */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  Personal Information
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={editing ? editForm.firstName : userData.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      disabled={!editing}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={editing ? editForm.lastName : userData.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      disabled={!editing}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={editing ? editForm.email : userData.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      disabled={!editing}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={editing ? editForm.phone : userData.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      disabled={!editing}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <DatePicker
                      label="Date of Birth"
                      value={editing ? editForm.dateOfBirth : (patientData.dateOfBirth ? new Date(patientData.dateOfBirth) : null)}
                      onChange={(newValue) => setEditForm({ ...editForm, dateOfBirth: newValue })}
                      disabled={!editing}
                      slotProps={{
                        textField: {
                          fullWidth: true
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth disabled={!editing}>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        value={editing ? editForm.gender || '' : patientData.gender || ''}
                        onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                        label="Gender"
                      >
                        {genderOptions.map((gender) => (
                          <MenuItem key={gender} value={gender}>
                            {gender}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Address"
                      value={editing ? editForm.address : patientData.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      disabled={!editing}
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Profile Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}
                >
                  <PersonIcon sx={{ fontSize: 60 }} />
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  {userData.firstName} {userData.lastName}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Patient ID: {patientData.patientNumber}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Age: {calculateAge(patientData.dateOfBirth)} years
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ textAlign: 'left' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EmailIcon sx={{ mr: 1, fontSize: 18 }} />
                    <Typography variant="body2">{userData.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PhoneIcon sx={{ mr: 1, fontSize: 18 }} />
                    <Typography variant="body2">{userData.phone || 'Not provided'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <BirthdayIcon sx={{ mr: 1, fontSize: 18 }} />
                    <Typography variant="body2">{formatDate(patientData.dateOfBirth)}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Medical Information */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <MedicalIcon sx={{ mr: 1 }} />
                  Medical Information
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth disabled={!editing}>
                      <InputLabel>Blood Type</InputLabel>
                      <Select
                        value={editing ? editForm.bloodType : patientData.bloodType}
                        onChange={(e) => setEditForm({ ...editForm, bloodType: e.target.value })}
                        label="Blood Type"
                      >
                        {bloodTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Emergency Contact"
                      value={editing ? editForm.emergencyContact : patientData.emergencyContact}
                      onChange={(e) => setEditForm({ ...editForm, emergencyContact: e.target.value })}
                      disabled={!editing}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Emergency Phone"
                      value={editing ? editForm.emergencyPhone : patientData.emergencyPhone}
                      onChange={(e) => setEditForm({ ...editForm, emergencyPhone: e.target.value })}
                      disabled={!editing}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Allergies"
                      value={editing ? editForm.allergies : patientData.allergies}
                      onChange={(e) => setEditForm({ ...editForm, allergies: e.target.value })}
                      disabled={!editing}
                      multiline
                      rows={3}
                      helperText="Please list any known allergies or medical conditions"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Password Change Dialog */}
        <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                type="password"
                label="Current Password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                type="password"
                label="New Password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                sx={{ mb: 3 }}
                helperText="Password must be at least 6 characters long"
              />
              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
            <Button onClick={handlePasswordChange} variant="contained">
              Change Password
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default PatientMyProfile;