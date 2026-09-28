import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People,
  CalendarMonth,
  LocalHospital,
  Assessment,
  Payment,
  ExitToApp,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NotificationDropdown from './NotificationDropdown';

export const DRAWER_WIDTH = 240;

const roleLabels = {
  HOSPITAL_MANAGER: 'Hospital Manager',
  DOCTOR: 'Doctor',
  NURSE: 'Nurse',
  RECEPTIONIST: 'Receptionist',
  IT_OFFICER: 'IT Officer',
  PATIENT: 'Patient',
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { userRole, currentUser, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Use userRole from AuthContext, fallback to HOSPITAL_MANAGER
  const currentUserRole = userRole || 'HOSPITAL_MANAGER';
  const displayName = currentUser?.username || roleLabels[currentUserRole] || 'User';

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      roles: ['HOSPITAL_MANAGER', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'IT_OFFICER', 'PATIENT']
    },
    {
      text: 'Patient Management',
      icon: <People />,
      path: '/patients',
      roles: ['HOSPITAL_MANAGER', 'DOCTOR', 'NURSE', 'RECEPTIONIST']
    },
    {
      text: 'User Management',
      icon: <LocalHospital />,
      path: '/users',
      roles: ['HOSPITAL_MANAGER', 'IT_OFFICER']
    },
    {
      text: 'Appointments',
      icon: <CalendarMonth />,
      path: '/appointments',
      roles: ['HOSPITAL_MANAGER', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PATIENT']
    },
    {
      text: 'Medical Records',
      icon: <Assessment />,
      path: '/medical-records',
      roles: ['HOSPITAL_MANAGER', 'DOCTOR', 'NURSE']
    },
    {
      text: 'Billing',
      icon: <Payment />,
      path: '/billing',
      roles: ['HOSPITAL_MANAGER', 'RECEPTIONIST']
    },
    {
      text: 'Reports & Analytics',
      icon: <Assessment />,
      path: '/reports',
      roles: ['HOSPITAL_MANAGER', 'DOCTOR']
    },
    // Patient-specific menu items
    {
      text: 'My Appointments',
      icon: <CalendarMonth />,
      path: '/my-appointments',
      roles: ['PATIENT']
    },
    {
      text: 'My Profile',
      icon: <People />,
      path: '/my-profile',
      roles: ['PATIENT']
    },
    {
      text: 'My Bills',
      icon: <Payment />,
      path: '/my-billing',
      roles: ['PATIENT']
    }
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(currentUserRole)
  );

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const itemSx = {
    mx: 1,
    my: 0.25,
    borderRadius: '10px',
    color: 'text.secondary',
    transition: `background-color ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeInOut}`,
    '&.Mui-selected': {
      backgroundColor: 'primary.50',
      color: 'primary.dark',
      '& .MuiListItemIcon-root': { color: 'primary.main' },
      '&:hover': { backgroundColor: 'primary.100' },
    },
    '&:hover': { backgroundColor: 'action.hover' },
  };

  const drawerContent = (
    <>
      {/* Header */}
      <Box sx={{ p: 2.5, textAlign: 'center', position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
          <NotificationDropdown />
        </Box>
        <Box
          component="img"
          src="/logo-mark.jpg"
          alt="HealthCore"
          sx={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', mb: 1, boxShadow: 2 }}
        />
        <Typography variant="h6" component="div" sx={{ fontFamily: 'Outfit', fontWeight: 700, color: 'text.primary' }}>
          HealthCore
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Management System
        </Typography>
      </Box>

      <Divider />

      {/* User Info */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Avatar sx={{ mx: 'auto', mb: 1, bgcolor: 'primary.100', color: 'primary.dark', fontWeight: 700 }}>
          {displayName.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }} noWrap>
          {displayName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {roleLabels[currentUserRole] || currentUserRole}
        </Typography>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ flexGrow: 1, pt: 1 }}>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={itemSx}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Bottom Menu */}
      <List sx={{ pb: 1 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={itemSx}>
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );

  if (isMobile) {
    return (
      <>
        <IconButton
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          sx={{
            position: 'fixed',
            top: 12,
            left: 12,
            zIndex: theme.zIndex.drawer + 1,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 1,
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none',
              backgroundColor: 'background.paper',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;