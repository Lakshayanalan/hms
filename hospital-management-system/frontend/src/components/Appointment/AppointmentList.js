import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import api from '../../utils/api';

// Chip `color` prop only accepts MUI palette keys (not arbitrary hex), so this
// maps to the closest palette key for each status — kept semantically aligned
// with the canonical appointmentStatusColors in theme/tokens.js (used by the
// calendar views) so a status reads the same way across the app.
const appointmentStatusColors = {
  REQUESTED: 'default',
  PENDING_APPROVAL: 'warning',
  APPROVED: 'info',
  REJECTED: 'error',
  RESCHEDULED: 'secondary',
  CONFIRMED: 'success',
  IN_PROGRESS: 'success',
  COMPLETED: 'success',
  CANCELLED: 'error',
  NO_SHOW: 'default'
};

const appointmentTypeLabels = {
  CONSULTATION: 'General Consultation',
  FOLLOW_UP: 'Follow-up Visit',
  CHECKUP: 'Regular Checkup',
  EMERGENCY: 'Emergency',
  VACCINATION: 'Vaccination',
  SURGERY: 'Surgery',
  THERAPY: 'Therapy Session',
  DIAGNOSTIC: 'Diagnostic Test'
};

const AppointmentList = ({ patientId, doctorId, showActions = true }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [statusDialog, setStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const loadAppointments = async () => {
    setLoading(true);
    setError('');
    
    try {
      let url = '/appointments';
      
      if (patientId) {
        url = `/appointments/patient/${patientId}`;
      } else if (doctorId) {
        url = `/appointments/doctor/${doctorId}`;
      } else if (searchTerm) {
        url = `/appointments/search?searchTerm=${encodeURIComponent(searchTerm)}&page=${page}&size=${rowsPerPage}`;
      } else {
        url = `/appointments?page=${page}&size=${rowsPerPage}`;
      }
      
      const response = await api.get(url);
      
      if (response.data.content) {
        // Paginated response
        setAppointments(response.data.content);
        setTotalCount(response.data.totalElements);
      } else {
        // Direct array response
        setAppointments(response.data);
        setTotalCount(response.data.length);
      }
    } catch (err) {
      setError('Failed to load appointments');
      console.error('Error loading appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, searchTerm, patientId, doctorId]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event, appointment) => {
    setAnchorEl(event.currentTarget);
    setSelectedAppointment(appointment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAppointment(null);
  };

  const handleStatusChange = async () => {
    if (!selectedAppointment || !newStatus) return;

    try {
      await api.put(`/appointments/${selectedAppointment.appointmentId}/status?status=${newStatus}`);
      setStatusDialog(false);
      setNewStatus('');
      loadAppointments(); // Reload the list
    } catch (err) {
      setError('Failed to update appointment status');
    }
    handleMenuClose();
  };

  const handleQuickStatusChange = async (action) => {
    if (!selectedAppointment) return;

    try {
      let endpoint;
      switch (action) {
        case 'APPROVED':
          endpoint = `/appointments/${selectedAppointment.appointmentId}/approve`;
          break;
        case 'REJECTED':
          endpoint = `/appointments/${selectedAppointment.appointmentId}/reject?reason=Rejected by doctor`;
          break;
        case 'COMPLETED':
          endpoint = `/appointments/${selectedAppointment.appointmentId}/complete-workflow`;
          break;
        case 'CANCELLED':
          endpoint = `/appointments/${selectedAppointment.appointmentId}/cancel`;
          break;
        default:
          // For other statuses, use the status endpoint if available
          endpoint = `/appointments/${selectedAppointment.appointmentId}/status?status=${action}`;
      }
      
      await api.put(endpoint);
      loadAppointments(); // Reload the list
      setError(''); // Clear any previous errors
    } catch (err) {
      setError(`Failed to ${action.toLowerCase()} appointment: ${err.response?.data || err.message}`);
    }
    handleMenuClose();
  };

  const formatDateTime = (dateTimeString) => {
    try {
      return format(parseISO(dateTimeString), 'MMM dd, yyyy hh:mm a');
    } catch (error) {
      return dateTimeString;
    }
  };

  const getStatusChip = (status) => {
    return (
      <Chip
        label={status.replace('_', ' ')}
        color={appointmentStatusColors[status] || 'default'}
        size="small"
      />
    );
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading appointments...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1">
            Appointments
          </Typography>
          <TextField
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={handleSearch}
            size="small"
            sx={{ minWidth: 300 }}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Reason</TableCell>
                {showActions && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.appointmentId} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {appointment.patientName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {appointment.patientNumber}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {appointment.doctorName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDateTime(appointment.appointmentDateTime)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {appointmentTypeLabels[appointment.appointmentType] || appointment.appointmentType}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {appointment.durationMinutes} min
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getStatusChip(appointment.status)}
                      {appointment.status === 'REQUESTED' && (
                        <Typography variant="caption" color="warning.main" sx={{ fontWeight: 'bold' }}>
                          🔔 Action Required
                        </Typography>
                      )}
                      {appointment.status === 'APPROVED' && (
                        <Typography variant="caption" color="info.main">
                          Ready to Confirm
                        </Typography>
                      )}
                      {appointment.status === 'CONFIRMED' && (
                        <Typography variant="caption" color="success.main">
                          Ready to Start
                        </Typography>
                      )}
                      {appointment.status === 'IN_PROGRESS' && (
                        <Typography variant="caption" color="warning.main">
                          In Session
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {appointment.reason || 'N/A'}
                    </Typography>
                  </TableCell>
                  {showActions && (
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, appointment)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {appointments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={showActions ? 8 : 7} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No appointments found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {!patientId && !doctorId && (
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        )}

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {/* Show appropriate actions based on appointment status */}
          {selectedAppointment?.status === 'REQUESTED' && [
              <MenuItem key="approve" onClick={() => handleQuickStatusChange('APPROVED')}>
                <CheckCircleIcon sx={{ mr: 1 }} fontSize="small" color="success" />
                ✅ Approve Appointment
              </MenuItem>,
              <MenuItem key="reject" onClick={() => handleQuickStatusChange('REJECTED')}>
                <CancelIcon sx={{ mr: 1 }} fontSize="small" color="error" />
                ❌ Reject Appointment
              </MenuItem>
          ]}
          
          {selectedAppointment?.status === 'APPROVED' && [
              <MenuItem key="confirm" onClick={() => handleQuickStatusChange('CONFIRMED')}>
                <CheckCircleIcon sx={{ mr: 1 }} fontSize="small" color="primary" />
                ✔️ Confirm Appointment
              </MenuItem>,
              <MenuItem key="cancel" onClick={() => handleQuickStatusChange('CANCELLED')}>
                <CancelIcon sx={{ mr: 1 }} fontSize="small" color="error" />
                ❌ Cancel Appointment
              </MenuItem>
          ]}
          
          {selectedAppointment?.status === 'CONFIRMED' && [
              <MenuItem key="start" onClick={() => handleQuickStatusChange('IN_PROGRESS')}>
                <VisibilityIcon sx={{ mr: 1 }} fontSize="small" color="warning" />
                🏥 Start Appointment
              </MenuItem>,
              <MenuItem key="cancel" onClick={() => handleQuickStatusChange('CANCELLED')}>
                <CancelIcon sx={{ mr: 1 }} fontSize="small" color="error" />
                ❌ Cancel Appointment
              </MenuItem>
          ]}
          
          {selectedAppointment?.status === 'IN_PROGRESS' && (
            <MenuItem onClick={() => handleQuickStatusChange('COMPLETED')}>
              <CheckCircleIcon sx={{ mr: 1 }} fontSize="small" color="success" />
              ✅ Complete Appointment
            </MenuItem>
          )}
          
          {/* Always show manual status change option */}
          <MenuItem onClick={() => {
            setStatusDialog(true);
            handleMenuClose();
          }}>
            <EditIcon sx={{ mr: 1 }} fontSize="small" />
            🔄 Change Status Manually...
          </MenuItem>
        </Menu>

        {/* Status Update Dialog */}
        <Dialog open={statusDialog} onClose={() => setStatusDialog(false)}>
          <DialogTitle>Update Appointment Status</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="REQUESTED">Requested</MenuItem>
                <MenuItem value="PENDING_APPROVAL">Pending Approval</MenuItem>
                <MenuItem value="APPROVED">Approved</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
                <MenuItem value="RESCHEDULED">Rescheduled</MenuItem>
                <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
                <MenuItem value="NO_SHOW">No Show</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
            <Button onClick={handleStatusChange} variant="contained">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default AppointmentList;