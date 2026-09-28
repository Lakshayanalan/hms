import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Tab,
  Tabs,
  Alert,
  Chip
} from '@mui/material';
import {
  List as ListIcon,
  Add as AddIcon,
  PersonSearch as SearchIcon,
  LocalHospital as MedicalIcon
} from '@mui/icons-material';
import PatientList from '../components/Patient/PatientList';
import PatientProfile from '../components/Patient/PatientProfile';
import PatientRegistration from '../components/Patient/PatientRegistration';
import { useAuth } from '../contexts/AuthContext';

const PatientManagement = () => {
  const { userRole } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [refreshList, setRefreshList] = useState(0);

  // Check if user has permission to register new patients
  const canRegisterPatients = ['HOSPITAL_MANAGER', 'RECEPTIONIST'].includes(userRole);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Reset profile state when switching tabs
    setSelectedPatient(null);
    setIsProfileOpen(false);
  };

  // Handle patient selection from list
  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setIsProfileOpen(true);
  };

  // Handle profile close
  const handleProfileClose = () => {
    setIsProfileOpen(false);
    setSelectedPatient(null);
    // Refresh the list to show any updates
    setRefreshList(prev => prev + 1);
  };

  // Handle successful patient registration
  const handlePatientRegistered = () => {
    // Switch to patient list tab and refresh
    setActiveTab(0);
    setRefreshList(prev => prev + 1);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        {/* Header with Role-based Information */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <MedicalIcon sx={{ mr: 2, color: 'primary.main' }} />
              Patient Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {userRole === 'DOCTOR' && 'Access patient records and medical history'}
              {userRole === 'RECEPTIONIST' && 'Manage patient registrations and records'}
              {userRole === 'HOSPITAL_MANAGER' && 'Complete patient management and oversight'}
              {userRole === 'NURSE' && 'View patient information and medical records'}
            </Typography>
          </Box>
          <Chip 
            label={`Logged in as: ${userRole}`}
            color="primary"
            variant="outlined"
            icon={<SearchIcon />}
          />
        </Box>

        {/* Role-based Notice for Doctors */}
        {userRole === 'DOCTOR' && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <strong>Doctor Access:</strong> You can view all patient details, medical history, and manage patient care. 
            Click on any patient to view comprehensive medical information.
          </Alert>
        )}

        {/* Tab Navigation */}
        <Card sx={{ mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab 
              icon={<ListIcon />} 
              label="Patient Directory" 
              iconPosition="start"
            />
            {canRegisterPatients && (
              <Tab 
                icon={<AddIcon />} 
                label="Register New Patient" 
                iconPosition="start"
              />
            )}
          </Tabs>
        </Card>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Box>
            {!isProfileOpen ? (
              <Box>
                <PatientList 
                  onEditPatient={handleEditPatient}
                  onPatientSelect={handleEditPatient} // Allow viewing patient details
                  refreshTrigger={refreshList}
                />
              </Box>
            ) : (
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                      <MedicalIcon sx={{ mr: 1, color: 'primary.main' }} />
                      Patient Profile - {selectedPatient?.fullName || `${selectedPatient?.firstName} ${selectedPatient?.lastName}`}
                    </Typography>
                    <Button 
                      variant="outlined" 
                      onClick={handleProfileClose}
                    >
                      ← Back to Patient Directory
                    </Button>
                  </Box>
                  <PatientProfile 
                    patientId={selectedPatient?.patientId}
                    onClose={handleProfileClose}
                  />
                </CardContent>
              </Card>
            )}
          </Box>
        )}

        {canRegisterPatients && activeTab === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <AddIcon sx={{ mr: 1, color: 'primary.main' }} />
                Register New Patient
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Add a new patient to the hospital management system with complete medical and contact information.
              </Typography>
              <PatientRegistration 
                onPatientRegistered={handlePatientRegistered}
              />
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default PatientManagement;
