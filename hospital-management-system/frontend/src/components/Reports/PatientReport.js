import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Bloodtype as BloodtypeIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import api from '../../utils/api';

const PatientReport = ({ patientId, onClose }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (patientId) {
      fetchPatientReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const fetchPatientReport = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/reports/patient/${patientId}`);
      setReportData(response.data);
    } catch (err) {
      setError('Failed to generate patient report');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'no_show': return 'warning';
      case 'scheduled': return 'primary';
      case 'confirmed': return 'info';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'partial': return 'info';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!reportData) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No report data available
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" color="primary">
          Patient Report
        </Typography>
        {onClose && (
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Patient Information */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Patient Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="h6">{reportData.patientName}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Patient ID: {reportData.patientNumber}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography>{reportData.email || 'Not provided'}</Typography>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography>{reportData.phone || 'Not provided'}</Typography>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="textSecondary">Date of Birth</Typography>
                <Typography>
                  {reportData.dateOfBirth ? 
                    format(new Date(reportData.dateOfBirth), 'MMM dd, yyyy') : 
                    'Not provided'
                  }
                </Typography>
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="textSecondary">Gender</Typography>
                <Typography>{reportData.gender || 'Not specified'}</Typography>
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BloodtypeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="textSecondary">Blood Type</Typography>
                    <Typography>{reportData.bloodType || 'Not specified'}</Typography>
                  </Box>
                </Box>
              </Grid>
              
              {reportData.allergies && (
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <WarningIcon sx={{ mr: 1, color: 'warning.main', mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2" color="textSecondary">Allergies</Typography>
                      <Typography color="warning.main">{reportData.allergies}</Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
              
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <HomeIcon sx={{ mr: 1, color: 'text.secondary', mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" color="textSecondary">Address</Typography>
                    <Typography>{reportData.address || 'Not provided'}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Summary Statistics */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Summary Statistics
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={1}>
              <Grid size={{ xs: 12 }}>
                <Card variant="outlined" sx={{ p: 1, mb: 1 }}>
                  <Typography variant="body2" color="textSecondary">Total Appointments</Typography>
                  <Typography variant="h5" color="primary">
                    {reportData.totalAppointments}
                  </Typography>
                </Card>
              </Grid>
              
              <Grid size={{ xs: 6 }}>
                <Card variant="outlined" sx={{ p: 1, mb: 1 }}>
                  <Typography variant="caption" color="textSecondary">Completed</Typography>
                  <Typography variant="h6" color="success.main">
                    {reportData.completedAppointments}
                  </Typography>
                </Card>
              </Grid>
              
              <Grid size={{ xs: 6 }}>
                <Card variant="outlined" sx={{ p: 1, mb: 1 }}>
                  <Typography variant="caption" color="textSecondary">Cancelled</Typography>
                  <Typography variant="h6" color="error.main">
                    {reportData.cancelledAppointments}
                  </Typography>
                </Card>
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <Card variant="outlined" sx={{ p: 1, mb: 1 }}>
                  <Typography variant="body2" color="textSecondary">Total Billed</Typography>
                  <Typography variant="h5" color="primary">
                    ${reportData.totalBilled?.toFixed(2) || '0.00'}
                  </Typography>
                </Card>
              </Grid>
              
              <Grid size={{ xs: 6 }}>
                <Card variant="outlined" sx={{ p: 1, mb: 1 }}>
                  <Typography variant="caption" color="textSecondary">Paid</Typography>
                  <Typography variant="body1" color="success.main">
                    ${reportData.totalPaid?.toFixed(2) || '0.00'}
                  </Typography>
                </Card>
              </Grid>
              
              <Grid size={{ xs: 6 }}>
                <Card variant="outlined" sx={{ p: 1, mb: 1 }}>
                  <Typography variant="caption" color="textSecondary">Outstanding</Typography>
                  <Typography variant="body1" color="error.main">
                    ${reportData.outstandingAmount?.toFixed(2) || '0.00'}
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Appointments */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Recent Appointments
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {reportData.recentAppointments?.length > 0 ? (
              <List dense>
                {reportData.recentAppointments.slice(0, 5).map((appointment, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2">
                            {format(new Date(appointment.appointmentDateTime), 'MMM dd, yyyy HH:mm')}
                          </Typography>
                          <Chip 
                            label={appointment.status}
                            color={getStatusColor(appointment.status)}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" display="block" component="span">
                            Dr. {appointment.doctorName}
                          </Typography>
                          <Typography variant="caption" color="textSecondary" component="div">
                            {appointment.appointmentType} - {appointment.reason}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="textSecondary">No appointments found</Typography>
            )}
          </Paper>
        </Grid>

        {/* Recent Invoices */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Recent Invoices
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {reportData.recentInvoices?.length > 0 ? (
              <List dense>
                {reportData.recentInvoices.slice(0, 5).map((invoice, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2">
                            {invoice.invoiceNumber}
                          </Typography>
                          <Chip 
                            label={invoice.paymentStatus}
                            color={getPaymentStatusColor(invoice.paymentStatus)}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" component="span">
                            {format(new Date(invoice.invoiceDate), 'MMM dd, yyyy')}
                          </Typography>
                          <Typography variant="caption" fontWeight="medium" component="span">
                            ${invoice.totalAmount?.toFixed(2)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="textSecondary">No invoices found</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientReport;