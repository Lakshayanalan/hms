import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Tabs,
  Tab,
  Box,
  Button,
  Dialog,
  DialogContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  History as HistoryIcon,
  Search as SearchIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import MedicalRecordForm from '../components/MedicalRecord/MedicalRecordForm';
import PatientMedicalHistory from '../components/MedicalRecord/PatientMedicalHistory';
import api from '../utils/api';

const MedicalRecordsManagement = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [createDialog, setCreateDialog] = useState(false);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentRecords, setRecentRecords] = useState([]);

  useEffect(() => {
    loadPatients();
    loadRecentRecords();
  }, []);

  const loadPatients = async () => {
    try {
      const response = await api.get('/patients');
      setPatients(response.data);
    } catch (err) {
      setError('Failed to load patients');
    }
  };

  const loadRecentRecords = async () => {
    setLoading(true);
    try {
      const response = await api.get('/medical-records/recent');
      setRecentRecords(response.data.slice(0, 5)); // Show only latest 5
    } catch (err) {
      console.error('Failed to load recent records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleCreateSuccess = (record) => {
    setCreateDialog(false);
    loadRecentRecords(); // Refresh recent records
  };

  const formatDateTime = (dateTimeString) => {
    try {
      return new Date(dateTimeString).toLocaleDateString();
    } catch (error) {
      return dateTimeString;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Medical Records Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialog(true)}
          >
            Create Medical Record
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab 
              icon={<SearchIcon />} 
              label="Browse Records" 
              iconPosition="start"
            />
            <Tab 
              icon={<HistoryIcon />} 
              label="Patient History" 
              iconPosition="start"
            />
            <Tab 
              icon={<PersonIcon />} 
              label="Recent Records" 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {currentTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Browse Medical Records
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Select a patient to view their complete medical history.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Select Patient</InputLabel>
                  <Select
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    label="Select Patient"
                  >
                    {patients.map((patient) => (
                      <MenuItem key={patient.patientId} value={patient.patientId}>
                        {patient.fullName} ({patient.patientNumber})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            {selectedPatient && (
              <Box sx={{ mt: 3 }}>
                <PatientMedicalHistory patientId={selectedPatient} />
              </Box>
            )}
          </Box>
        )}

        {currentTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Patient Medical History
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              View comprehensive medical history for a specific patient.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Select Patient</InputLabel>
                  <Select
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    label="Select Patient"
                  >
                    {patients.map((patient) => (
                      <MenuItem key={patient.patientId} value={patient.patientId}>
                        {patient.fullName} ({patient.patientNumber})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            {selectedPatient && (
              <Box sx={{ mt: 3 }}>
                <PatientMedicalHistory patientId={selectedPatient} showActions={true} />
              </Box>
            )}
          </Box>
        )}

        {currentTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Recent Medical Records
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Recently created or updated medical records (last 30 days).
            </Typography>
            
            <Grid container spacing={2}>
              {recentRecords.map((record) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={record.recordId}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {record.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Patient: {record.patientName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Doctor: {record.doctorName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Date: {formatDateTime(record.recordDate)}
                      </Typography>
                      {record.diagnosis && (
                        <Typography variant="body2" sx={{ mt: 1, fontWeight: 'medium' }}>
                          Diagnosis: {record.diagnosis}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {!loading && recentRecords.length === 0 && (
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body1" color="text.secondary" textAlign="center">
                    No recent medical records found.
                  </Typography>
                </Grid>
              )}
              {loading && (
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* Create Medical Record Dialog */}
        <Dialog 
          open={createDialog} 
          onClose={() => setCreateDialog(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogContent sx={{ p: 0 }}>
            <MedicalRecordForm
              onSuccess={handleCreateSuccess}
              onCancel={() => setCreateDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default MedicalRecordsManagement;