import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  Divider,
  IconButton
} from '@mui/material';
import { apiRequest } from '../../utils/api';
import {
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  PersonAdd as PersonAddIcon,
  Event as EventIcon,
  MedicalServices as MedicalIcon,
  Refresh as RefreshIcon,
  AdminPanelSettings as AdminIcon,
  BusinessCenter as BusinessIcon,
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { staggerContainer, staggerItem, hoverLift } from '../../motion/variants';

const appointmentStatusChipColor = (status) => {
  switch (status) {
    case 'COMPLETED': return 'success';
    case 'CANCELLED': case 'REJECTED': case 'NO_SHOW': return 'error';
    case 'APPROVED': case 'CONFIRMED': return 'primary';
    case 'IN_PROGRESS': return 'info';
    default: return 'warning';
  }
};

const formatApptTime = (dateTimeStr) => {
  try {
    return new Date(dateTimeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await api.get('/activity/recent');
      setActivities(response.data || []);
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const getActivityIcon = (activityType) => {
    switch (activityType) {
      case 'USER_CREATED':
        return <PeopleIcon color="primary" />;
      case 'PATIENT_REGISTERED':
        return <PersonAddIcon color="success" />;
      case 'APPOINTMENT_SCHEDULED':
        return <CalendarIcon color="info" />;
      case 'INVOICE_GENERATED':
        return <BusinessIcon color="warning" />;
      default:
        return <AssessmentIcon color="info" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">
              Recent Activity
            </Typography>
            <IconButton size="small" disabled>
              <RefreshIcon />
            </IconButton>
          </Box>
          <LinearProgress />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">
            Recent Activity
          </Typography>
          <IconButton size="small" onClick={fetchActivities}>
            <RefreshIcon />
          </IconButton>
        </Box>
        <List>
          {activities.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="No recent activity"
                secondary="System activity will appear here"
              />
            </ListItem>
          ) : (
            activities.map((activity, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemIcon>
                    {getActivityIcon(activity.activityType)}
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.title}
                    secondary={`${activity.description} • ${activity.formattedTime}`}
                  />
                </ListItem>
                {index < activities.length - 1 && <Divider />}
              </React.Fragment>
            ))
          )}
        </List>
      </CardContent>
    </Card>
  );
};

const StatCard = ({ title, value, icon, color = 'primary', loading = false }) => (
  <Box component={motion.div} variants={staggerItem}>
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="h2" color={color}>
              {loading ? '...' : value}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: `${color}.main`, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  </Box>
);

const QuickActionCard = ({ title, description, icon, onClick, color = 'primary' }) => (
  <Box component={motion.div} variants={staggerItem}>
    <Card
      component={motion.div}
      variants={hoverLift}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      sx={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: `${color}.main`, mr: 2 }}>
            {icon}
          </Avatar>
          <Typography variant="h6" component="h3">
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  </Box>
);

// Hospital Manager Dashboard (also reused for IT Officer, with a different title)
const HospitalManagerDashboard = ({ onNavigate, title = 'Hospital Manager Dashboard' }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPatients: 0,
    activeStaff: 0,
    monthlyRegistrations: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [usersRes, patientsRes] = await Promise.all([
        api.get('/users/stats/total'),
        api.get('/patients/stats/total')
      ]);

      setStats({
        totalUsers: usersRes.data,
        totalPatients: patientsRes.data,
        activeStaff: usersRes.data - patientsRes.data,
        monthlyRegistrations: Math.floor(patientsRes.data * 0.1) // Mock data
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        <IconButton onClick={fetchStats} aria-label="Refresh">
          <RefreshIcon />
        </IconButton>
      </Box>

      <Grid
        container
        spacing={3}
        sx={{ mb: 4 }}
        component={motion.div}
        variants={staggerContainer()}
        initial="hidden"
        animate="visible"
      >
        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<PeopleIcon />}
            loading={loading}
          />
        </Grid>
        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={<PersonIcon />}
            color="success"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Active Staff"
            value={stats.activeStaff}
            icon={<BusinessIcon />}
            color="info"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Monthly Registrations"
            value={stats.monthlyRegistrations}
            icon={<PersonAddIcon />}
            color="warning"
            loading={loading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <QuickActionCard
                title="Manage Users"
                description="Create, edit, and manage hospital staff accounts"
                icon={<AdminIcon />}
                onClick={() => onNavigate && onNavigate('users')}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <QuickActionCard
                title="Patient Management"
                description="View and manage patient records and registrations"
                icon={<PersonIcon />}
                color="success"
                onClick={() => onNavigate && onNavigate('patients')}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <QuickActionCard
                title="System Reports"
                description="View hospital statistics and generate reports"
                icon={<AssessmentIcon />}
                color="info"
                onClick={() => onNavigate && onNavigate('reports')}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <RecentActivity />
        </Grid>
      </Grid>
    </Container>
  );
};

// Doctor Dashboard (also reused for Nurse, with a different title)
const DoctorDashboard = ({ onNavigate, title = 'Doctor Dashboard' }) => {
  const { currentUser } = useAuth();
  const [doctorStats, setDoctorStats] = useState({
    todaysAppointments: 0,
    totalPatients: 0,
    pendingReviews: 0,
    completedToday: 0
  });
  const [todaysSchedule, setTodaysSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctorData = async () => {
    try {
      setLoading(true);
      const statsPromise = api.get('/appointments/doctor/stats');
      const schedulePromise = currentUser?.userId
        ? api.get(`/appointments/doctor/${currentUser.userId}`, {
            params: { page: 0, size: 50, sortBy: 'appointmentDateTime' },
          })
        : Promise.resolve(null);

      const [statsRes, scheduleRes] = await Promise.all([statsPromise, schedulePromise]);

      setDoctorStats({
        todaysAppointments: statsRes.data.todaysAppointments || 0,
        totalPatients: statsRes.data.totalPatients || 0,
        pendingReviews: statsRes.data.pendingReviews || 0,
        completedToday: statsRes.data.completedToday || 0
      });

      if (scheduleRes) {
        const todayStr = new Date().toDateString();
        const todays = (scheduleRes.data.content || [])
          .filter((apt) => new Date(apt.appointmentDateTime).toDateString() === todayStr)
          .sort((a, b) => new Date(a.appointmentDateTime) - new Date(b.appointmentDateTime))
          .slice(0, 6);
        setTodaysSchedule(todays);
      }
    } catch (error) {
      console.error('Error fetching doctor dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.userId]);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        <IconButton onClick={fetchDoctorData} aria-label="Refresh">
          <RefreshIcon />
        </IconButton>
      </Box>

      <Grid
        container
        spacing={3}
        sx={{ mb: 4 }}
        component={motion.div}
        variants={staggerContainer()}
        initial="hidden"
        animate="visible"
      >
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Today's Appointments"
            value={loading ? '...' : doctorStats.todaysAppointments}
            icon={<CalendarIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="My Patients"
            value={loading ? '...' : doctorStats.totalPatients}
            icon={<PersonIcon />}
            color="success"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Pending Reviews"
            value={loading ? '...' : doctorStats.pendingReviews}
            icon={<MedicalIcon />}
            color="warning"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Completed Today"
            value={loading ? '...' : doctorStats.completedToday}
            icon={<EventIcon />}
            color="info"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Today's Schedule
              </Typography>
              {loading ? (
                <LinearProgress />
              ) : todaysSchedule.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No appointments scheduled for today
                  </Typography>
                </Box>
              ) : (
                <List>
                  {todaysSchedule.map((apt, idx) => (
                    <React.Fragment key={apt.appointmentId}>
                      <ListItem>
                        <ListItemText
                          primary={`${formatApptTime(apt.appointmentDateTime)} - ${apt.patientName}`}
                          secondary={apt.reason || apt.appointmentType}
                        />
                        <Chip
                          label={apt.status?.replace('_', ' ')}
                          color={appointmentStatusChipColor(apt.status)}
                          size="small"
                        />
                      </ListItem>
                      {idx < todaysSchedule.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <QuickActionCard
                title="View Patients"
                description="Access patient records and medical history"
                icon={<PersonIcon />}
                color="success"
                onClick={() => onNavigate && onNavigate('patients')}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <QuickActionCard
                title="Appointments"
                description="Manage appointments and schedule"
                icon={<CalendarIcon />}
                onClick={() => onNavigate && onNavigate('appointments')}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

// Receptionist Dashboard
const ReceptionistDashboard = ({ onNavigate }) => {
  const [receptionistStats, setReceptionistStats] = useState({
    todaysAppointments: 0,
    walkInPatients: 0,
    pendingCheckIns: 0,
    completedToday: 0,
    totalPatients: 0,
    totalStaff: 0,
    pendingInvoices: 0,
    overdueInvoices: 0,
    outstandingAmount: 0,
    todaysRevenue: 0
  });
  const [todaysAppointmentsList, setTodaysAppointmentsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReceptionistStats = async () => {
    try {
      setLoading(true);

      const [stats, todaysListRes] = await Promise.all([
        apiRequest('GET', '/dashboard/receptionist/stats'),
        api.get('/appointments/today'),
      ]);
      setReceptionistStats({
        todaysAppointments: stats.todaysAppointments || 0,
        walkInPatients: stats.walkInPatients || 0,
        pendingCheckIns: stats.pendingCheckIns || 0,
        completedToday: stats.completedToday || 0,
        totalPatients: stats.totalPatients || 0,
        totalStaff: stats.totalStaff || 0,
        pendingInvoices: stats.pendingInvoices || 0,
        overdueInvoices: stats.overdueInvoices || 0,
        outstandingAmount: stats.outstandingAmount || 0,
        todaysRevenue: stats.todaysRevenue || 0
      });
      setTodaysAppointmentsList((todaysListRes.data || []).slice(0, 6));
    } catch (error) {
      console.error('Error fetching receptionist stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceptionistStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Receptionist Dashboard
        </Typography>
        <IconButton onClick={fetchReceptionistStats} aria-label="Refresh">
          <RefreshIcon />
        </IconButton>
      </Box>

      <Grid
        container
        spacing={3}
        sx={{ mb: 4 }}
        component={motion.div}
        variants={staggerContainer()}
        initial="hidden"
        animate="visible"
      >
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Today's Appointments"
            value={receptionistStats.todaysAppointments}
            icon={<CalendarIcon />}
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Walk-in Patients"
            value={receptionistStats.walkInPatients}
            icon={<PersonIcon />}
            color="warning"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Pending Check-ins"
            value={receptionistStats.pendingCheckIns}
            icon={<EventIcon />}
            color="info"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Completed Today"
            value={receptionistStats.completedToday}
            icon={<MedicalIcon />}
            color="success"
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Billing Statistics Section */}
      <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
        Billing Overview
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Pending Invoices"
            value={receptionistStats.pendingInvoices}
            icon={<ReceiptIcon />}
            color="warning"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Overdue Invoices"
            value={receptionistStats.overdueInvoices}
            icon={<WarningIcon />}
            color="error"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Outstanding Amount"
            value={`$${receptionistStats.outstandingAmount.toFixed(2)}`}
            icon={<MoneyIcon />}
            color="info"
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Today's Revenue"
            value={`$${receptionistStats.todaysRevenue.toFixed(2)}`}
            icon={<TrendingUpIcon />}
            color="success"
            loading={loading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <QuickActionCard
                title="Register New Patient"
                description="Add a new patient to the system"
                icon={<PersonAddIcon />}
                color="success"
                onClick={() => onNavigate && onNavigate('patients/register')}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <QuickActionCard
                title="Schedule Appointment"
                description="Book appointments for patients"
                icon={<CalendarIcon />}
                onClick={() => onNavigate && onNavigate('appointments')}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <QuickActionCard
                title="Patient Search"
                description="Find and manage patient records"
                icon={<PersonIcon />}
                color="info"
                onClick={() => onNavigate && onNavigate('patients')}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <QuickActionCard
                title="Billing Management"
                description="Manage invoices and payments"
                icon={<ReceiptIcon />}
                color="success"
                onClick={() => onNavigate && onNavigate('billing')}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Today's Appointments
              </Typography>
              {loading ? (
                <LinearProgress />
              ) : todaysAppointmentsList.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No appointments scheduled for today
                  </Typography>
                </Box>
              ) : (
                <List>
                  {todaysAppointmentsList.map((apt, idx) => (
                    <React.Fragment key={apt.appointmentId}>
                      <ListItem>
                        <ListItemText
                          primary={`${formatApptTime(apt.appointmentDateTime)} - ${apt.patientName}`}
                          secondary={`Dr. ${apt.doctorName}`}
                        />
                        <Chip
                          label={apt.status?.replace('_', ' ')}
                          color={appointmentStatusChipColor(apt.status)}
                          size="small"
                        />
                      </ListItem>
                      {idx < todaysAppointmentsList.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
// Main Dashboard Component
const RoleDashboard = ({ userRole, onNavigate }) => {
  const role = userRole?.toUpperCase();

  switch (role) {
    case 'HOSPITAL_MANAGER':
      return <HospitalManagerDashboard onNavigate={onNavigate} />;
    case 'DOCTOR':
      return <DoctorDashboard onNavigate={onNavigate} />;
    case 'RECEPTIONIST':
      return <ReceptionistDashboard onNavigate={onNavigate} />;
    case 'NURSE':
      return <DoctorDashboard onNavigate={onNavigate} title="Nurse Dashboard" />;
    case 'IT_OFFICER':
      return <HospitalManagerDashboard onNavigate={onNavigate} title="IT Officer Dashboard" />;
    case 'PATIENT':
      return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
            Patient Portal
          </Typography>
          <Grid
            container
            spacing={3}
            component={motion.div}
            variants={staggerContainer()}
            initial="hidden"
            animate="visible"
          >
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <QuickActionCard
                title="My Appointments"
                description="View and manage your appointments"
                icon={<CalendarIcon />}
                onClick={() => onNavigate && onNavigate('my-appointments')}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <QuickActionCard
                title="My Profile"
                description="Update your personal information"
                icon={<PersonIcon />}
                color="success"
                onClick={() => onNavigate && onNavigate('my-profile')}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <QuickActionCard
                title="My Bills & Invoices"
                description="View billing history and download invoices"
                icon={<BusinessIcon />}
                color="warning"
                onClick={() => onNavigate && onNavigate('my-billing')}
              />
            </Grid>
          </Grid>
        </Container>
      );
    default:
      return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Typography variant="h4" component="h1">
            Welcome to Hospital Management System
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Please log in to access your dashboard.
          </Typography>
        </Container>
      );
  }
};

export default RoleDashboard;