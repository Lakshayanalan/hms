import React, { useState } from 'react';
import {
  Container,
  Paper,
  Tabs,
  Tab,
  Box,
  Button,
  Dialog,
  DialogContent,
  Typography
} from '@mui/material';
import {
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  List as ListIcon
} from '@mui/icons-material';
import AppointmentScheduling from '../components/Appointment/AppointmentScheduling';
import AppointmentList from '../components/Appointment/AppointmentList';
import AppointmentCalendar from '../components/Appointment/AppointmentCalendar';

const AppointmentManagement = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [scheduleDialog, setScheduleDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleScheduleSuccess = (appointment) => {
    setScheduleDialog(false);
    setSelectedSlot(null);
    // Optionally show success message or refresh lists
  };

  const handleSlotSelect = (slotInfo) => {
    setSelectedSlot(slotInfo);
    setScheduleDialog(true);
  };

  const handleEventSelect = (appointment) => {
    // Handle appointment selection from calendar
    console.log('Selected appointment:', appointment);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Appointment Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setScheduleDialog(true)}
          >
            Schedule Appointment
          </Button>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab 
              icon={<CalendarIcon />} 
              label="Calendar View" 
              iconPosition="start"
            />
            <Tab 
              icon={<ListIcon />} 
              label="List View" 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {currentTab === 0 && (
          <AppointmentCalendar
            onSelectSlot={handleSlotSelect}
            onSelectEvent={handleEventSelect}
          />
        )}

        {currentTab === 1 && (
          <AppointmentList showActions={true} />
        )}

        {/* Schedule Appointment Dialog */}
        <Dialog 
          open={scheduleDialog} 
          onClose={() => setScheduleDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogContent sx={{ p: 0 }}>
            <AppointmentScheduling
              onSuccess={handleScheduleSuccess}
              onCancel={() => setScheduleDialog(false)}
              selectedSlot={selectedSlot}
            />
          </DialogContent>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default AppointmentManagement;