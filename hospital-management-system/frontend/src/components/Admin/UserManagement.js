import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import api from '../../utils/api';
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
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
  PersonAdd as PersonAddIcon,
  Block as BlockIcon,
  CheckCircle as ActivateIcon
} from '@mui/icons-material';

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
  role: yup.string()
    .required('Role is required'),
});

const roleOptions = [
  { value: 'PATIENT', label: 'Patient' },
  { value: 'RECEPTIONIST', label: 'Receptionist' },
  { value: 'DOCTOR', label: 'Doctor' },
  { value: 'NURSE', label: 'Nurse' },
  { value: 'IT_OFFICER', label: 'IT Officer' },
  { value: 'HOSPITAL_MANAGER', label: 'Hospital Manager' }
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      role: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      setSuccess('');
      
      try {
        if (editingUser) {
          // Update existing user
          const updateData = { ...values };
          if (!updateData.password.trim()) {
            delete updateData.password;
          }
          
          await api.put(`/users/${editingUser.userId}`, updateData);
          setSuccess('User updated successfully!');
        } else {
          // Create new user
          await api.post('/users', values);
          setSuccess('User created successfully!');
        }
        
        handleCloseDialog();
        // Force refresh user list with a small delay to ensure backend has processed the change
        setTimeout(() => {
          fetchUsers(searchTerm, page, rowsPerPage);
        }, 500);
        
      } catch (err) {
        const errorMessage = err.response?.data?.message || 
                           err.response?.data || 
                           'Operation failed. Please try again.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  // Fetch users data
  const fetchUsers = async (searchQuery = '', pageNum = 0, pageSize = 10) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.get('/users/search', {
        params: {
          searchTerm: searchQuery,
          page: pageNum,
          size: pageSize
        }
      });
      
      setUsers(response.data.content);
      setTotalUsers(response.data.totalElements);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         'Failed to fetch users. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle search
  const handleSearch = () => {
    setPage(0);
    fetchUsers(searchTerm, 0, rowsPerPage);
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
    fetchUsers(searchTerm, newPage, rowsPerPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    fetchUsers(searchTerm, 0, newRowsPerPage);
  };

  // Handle refresh
  const handleRefresh = () => {
    setSearchTerm('');
    setPage(0);
    fetchUsers('', 0, rowsPerPage);
  };

  // Handle new user dialog
  const handleNewUser = () => {
    setEditingUser(null);
    formik.resetForm();
    setDialogOpen(true);
    setError('');
    setSuccess('');
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setEditingUser(user);
    formik.setValues({
      username: user.username || '',
      email: user.email || '',
      password: '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      role: user.role || ''
    });
    setDialogOpen(true);
    setError('');
    setSuccess('');
  };

  // Handle close dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
    formik.resetForm();
    setError('');
    setSuccess('');
  };

  // Handle user activation/deactivation
  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      if (currentStatus) {
        await api.delete(`/users/${userId}`);
        setSuccess('User deactivated successfully!');
      } else {
        await api.put(`/users/${userId}/activate`);
        setSuccess('User activated successfully!');
      }
      // Force refresh user list
      setTimeout(() => {
        fetchUsers(searchTerm, page, rowsPerPage);
      }, 500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         'Operation failed. Please try again.';
      setError(errorMessage);
    }
  };

  // Get role color
  const getRoleColor = (role) => {
    const colors = {
      'HOSPITAL_MANAGER': 'error',
      'DOCTOR': 'primary',
      'NURSE': 'info',
      'RECEPTIONIST': 'warning',
      'IT_OFFICER': 'secondary',
      'PATIENT': 'success'
    };
    return colors[role] || 'default';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Card>
        <CardHeader 
          title="User Management"
          subheader={`Total Users: ${totalUsers}`}
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={handleRefresh} color="primary">
                <RefreshIcon />
              </IconButton>
              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={handleNewUser}
              >
                New User
              </Button>
            </Box>
          }
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
          
          {/* Search Bar */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search by name, username, or email..."
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

          {/* Users Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography>Loading users...</Typography>
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography>No users found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.userId} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                            <PersonIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {user.firstName} {user.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {user.username}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={user.role} 
                          size="small"
                          color={getRoleColor(user.role)}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {user.phone || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={user.isActive ? 'Active' : 'Inactive'} 
                          size="small"
                          color={user.isActive ? 'success' : 'error'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditUser(user)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleToggleUserStatus(user.userId, user.isActive)}
                            color={user.isActive ? 'error' : 'success'}
                          >
                            {user.isActive ? <BlockIcon /> : <ActivateIcon />}
                          </IconButton>
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
            count={totalUsers}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      {/* Create/Edit User Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingUser ? 'Edit User' : 'Create New User'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
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
                  label={editingUser ? "New Password (leave blank to keep current)" : "Password"}
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth error={formik.touched.role && Boolean(formik.errors.role)}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    id="role"
                    name="role"
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    label="Role"
                  >
                    {roleOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.role && formik.errors.role && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                      {formik.errors.role}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
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
              <Grid size={{ xs: 12 }}>
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
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={formik.handleSubmit}
            disabled={loading}
          >
            {loading ? 'Saving...' : (editingUser ? 'Update User' : 'Create User')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;