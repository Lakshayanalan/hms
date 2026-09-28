import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  InputAdornment,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  MedicalServices as MedicalIcon
} from '@mui/icons-material';
import api from '../../utils/api';

const PatientList = ({ onPatientSelect, onEditPatient, onNewPatient, refreshTrigger }) => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPatients, setTotalPatients] = useState(0);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Fetch patients data
  const fetchPatients = async (searchQuery = '', pageNum = 0, pageSize = 10) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.get('/patients/search', {
        params: {
          searchTerm: searchQuery,
          page: pageNum,
          size: pageSize
        }
      });
      
      setPatients(response.data.content);
      setTotalPatients(response.data.totalElements);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         'Failed to fetch patients. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchPatients();
  }, []);

  // Refresh when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchPatients(searchTerm, page, rowsPerPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  // Handle search
  const handleSearch = () => {
    setPage(0);
    fetchPatients(searchTerm, 0, rowsPerPage);
  };

  // Handle search on Enter key
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchPatients(searchTerm, newPage, rowsPerPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    fetchPatients(searchTerm, 0, newRowsPerPage);
  };

  // Handle view patient details
  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setViewDialogOpen(true);
  };

  // Handle refresh
  const handleRefresh = () => {
    setSearchTerm('');
    setPage(0);
    fetchPatients('', 0, rowsPerPage);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Get age from date of birth
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

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Card>
        <CardHeader 
          title="Patient Management"
          subheader={`Total Patients: ${totalPatients}`}
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={handleRefresh} color="primary">
                <RefreshIcon />
              </IconButton>
              {onNewPatient && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={onNewPatient}
                >
                  New Patient
                </Button>
              )}
            </Box>
          }
        />
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {/* Search Bar */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search by name, patient number, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      onClick={handleSearch}
                      disabled={loading}
                      sx={{ ml: 1 }}
                    >
                      Search
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Patients Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient</TableCell>
                  <TableCell>Patient Number</TableCell>
                  <TableCell>Age/Gender</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Blood Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography>Loading patients...</Typography>
                    </TableCell>
                  </TableRow>
                ) : patients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography>No patients found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  patients.map((patient) => (
                    <TableRow key={patient.patientId} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                            <PersonIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {patient.fullName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {patient.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {patient.patientNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {getAge(patient.dateOfBirth)} years
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {patient.gender}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {patient.phone || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={patient.bloodType || 'Unknown'} 
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={patient.isActive ? 'Active' : 'Inactive'} 
                          size="small"
                          color={patient.isActive ? 'success' : 'error'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleViewPatient(patient)}
                            color="info"
                            title="Quick View Details"
                          >
                            <ViewIcon />
                          </IconButton>
                          {(onEditPatient || onPatientSelect) && (
                            <IconButton 
                              size="small" 
                              onClick={() => {
                                if (onPatientSelect) {
                                  onPatientSelect(patient);
                                } else if (onEditPatient) {
                                  onEditPatient(patient);
                                }
                              }}
                              color="primary"
                              title="View Complete Profile"
                            >
                              <EditIcon />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalPatients}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      {/* Patient Details Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 48, height: 48 }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="h6">Patient Details</Typography>
                <Typography variant="body2" color="text.secondary">
                  Complete patient information overview
                </Typography>
              </Box>
            </Box>
            <Box>
              {selectedPatient && (
                <Chip 
                  label={selectedPatient.isActive ? 'Active Patient' : 'Inactive'} 
                  color={selectedPatient.isActive ? 'success' : 'error'}
                />
              )}
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPatient && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Full Name
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedPatient.fullName}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Patient Number
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedPatient.patientNumber}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedPatient.email}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedPatient.phone || 'N/A'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Date of Birth
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formatDate(selectedPatient.dateOfBirth)} ({getAge(selectedPatient.dateOfBirth)} years)
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Gender
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedPatient.gender}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedPatient.address || 'N/A'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Emergency Contact
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedPatient.emergencyContact || 'N/A'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Emergency Phone
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedPatient.emergencyPhone || 'N/A'}
                </Typography>
              </Grid>
              
              {/* Medical Information Section */}
              <Grid size={{ xs: 12 }}>
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <MedicalIcon sx={{ mr: 1, color: 'primary.main' }} />
                    Medical Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Blood Type
                      </Typography>
                      <Chip 
                        label={selectedPatient.bloodType || 'Unknown'} 
                        color="error" 
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Registration Date
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(selectedPatient.createdAt)}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Patient Number
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {selectedPatient.patientNumber}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              
              {selectedPatient.allergies && (
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1, border: '1px solid', borderColor: 'warning.main' }}>
                    <Typography variant="subtitle2" color="warning.dark" sx={{ fontWeight: 'bold', mb: 1 }}>
                      ⚠️ Allergies & Medical Notes
                    </Typography>
                    <Typography variant="body1" color="warning.dark">
                      {selectedPatient.allergies}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          {(onEditPatient || onPatientSelect) && selectedPatient && (
            <Button 
              variant="contained" 
              onClick={() => {
                setViewDialogOpen(false);
                if (onPatientSelect) {
                  onPatientSelect(selectedPatient);
                } else if (onEditPatient) {
                  onEditPatient(selectedPatient);
                }
              }}
            >
              View Complete Profile
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PatientList;