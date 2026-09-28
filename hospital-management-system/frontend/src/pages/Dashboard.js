import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  LocalHospital,
  People,
  CalendarMonth,
  Assessment,
  Payment,
  AccountCircle,
  Logout
} from '@mui/icons-material';

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Sample statistics data
  const stats = [
    {
      title: 'Total Patients',
      value: '1,234',
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#1976d2'
    },
    {
      title: 'Today\'s Appointments',
      value: '56',
      icon: <CalendarMonth sx={{ fontSize: 40 }} />,
      color: '#ed6c02'
    },
    {
      title: 'Active Staff',
      value: '89',
      icon: <LocalHospital sx={{ fontSize: 40 }} />,
      color: '#2e7d32'
    },
    {
      title: 'Pending Payments',
      value: '$12,450',
      icon: <Payment sx={{ fontSize: 40 }} />,
      color: '#d32f2f'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Top Navigation Bar */}
      <AppBar position="static">
        <Toolbar>
          <LocalHospital sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hospital Management System
          </Typography>
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <AccountCircle sx={{ mr: 1 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Logout sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Welcome back! Here's what's happening at the hospital today.
        </Typography>
        
        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      <Typography color="textSecondary" gutterBottom variant="overline">
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" component="h2">
                        {stat.value}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                      {stat.icon}
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2, height: '300px' }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Typography color="text.secondary">
                Quick action buttons will be implemented here for common tasks like:
                <br />• Register New Patient
                <br />• Schedule Appointment
                <br />• View Medical Records
                <br />• Generate Reports
              </Typography>
            </Paper>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2, height: '300px' }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Typography color="text.secondary">
                Recent system activity will be displayed here:
                <br />• Patient registrations
                <br />• Completed appointments
                <br />• Payment updates
                <br />• System notifications
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;