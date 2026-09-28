import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  CalendarMonth as CalendarIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import PatientReport from './PatientReport';
import AppointmentStats from './AppointmentStats';
import FinancialReports from './FinancialReports';

const ReportsDashboard = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const tabConfig = [
    {
      label: 'Appointment Statistics',
      icon: <CalendarIcon />,
      component: <AppointmentStats />
    },
    {
      label: 'Financial Reports',
      icon: <MoneyIcon />,
      component: <FinancialReports />
    },
    {
      label: 'Patient Reports',
      icon: <PeopleIcon />,
      component: <PatientReport />
    }
  ];

  return (
    <Box sx={{ width: '100%', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper elevation={1} sx={{ mb: 2 }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AssessmentIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h4" color="primary">
              Reports & Analytics
            </Typography>
          </Box>
          
          <Typography variant="body1" color="textSecondary">
            Comprehensive reporting dashboard for appointments, financials, and patient analytics
          </Typography>
        </Box>
        
        <Divider />
        
        {/* Navigation Tabs */}
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 2 }}
        >
          {tabConfig.map((tab, index) => (
            <Tab
              key={index}
              icon={tab.icon}
              label={tab.label}
              iconPosition="start"
              sx={{ minHeight: 48 }}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {tabConfig[currentTab]?.component}
      </Box>
    </Box>
  );
};

export default ReportsDashboard;