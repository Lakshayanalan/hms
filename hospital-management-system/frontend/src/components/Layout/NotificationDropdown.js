import React, { useState } from 'react';
import {
  Badge,
  IconButton,
  Menu,
  Typography,
  Box,
  Divider,
  Button,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Event as EventIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { formatDistanceToNow } from 'date-fns';
import api from '../../utils/api';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'APPOINTMENT_CREATED':
    case 'APPOINTMENT_APPROVED':
    case 'APPOINTMENT_REJECTED':
    case 'APPOINTMENT_RESCHEDULED':
    case 'APPOINTMENT_CANCELLED':
    case 'APPOINTMENT_REMINDER':
    case 'APPOINTMENT_COMPLETED':
      return <EventIcon />;
    case 'INVOICE_GENERATED':
    case 'INVOICE_PAID':
    case 'INVOICE_OVERDUE':
      return <ReceiptIcon />;
    case 'USER_CREATED':
    case 'USER_UPDATED':
      return <PersonIcon />;
    case 'SYSTEM_ALERT':
      return <WarningIcon />;
    default:
      return <InfoIcon />;
  }
};

const getNotificationColor = (type, priority) => {
  if (priority === 'URGENT') return 'error';
  if (priority === 'HIGH') return 'warning';
  
  switch (type) {
    case 'APPOINTMENT_APPROVED':
    case 'APPOINTMENT_COMPLETED':
    case 'INVOICE_PAID':
      return 'success';
    case 'APPOINTMENT_REJECTED':
    case 'APPOINTMENT_CANCELLED':
    case 'INVOICE_OVERDUE':
      return 'error';
    case 'APPOINTMENT_CREATED':
    case 'APPOINTMENT_REMINDER':
    case 'INVOICE_GENERATED':
      return 'info';
    default:
      return 'default';
  }
};

const NotificationDropdown = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, connected, requestNotificationPermission } = useWebSocket();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [detailDialog, setDetailDialog] = useState(false);
  const [permissionState, setPermissionState] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await api.put(`/notifications/${notification.notificationId}/read`);
        markAsRead(notification.notificationId);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
    
    setSelectedNotification(notification);
    setDetailDialog(true);
    handleClose();
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      markAllAsRead();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
    handleClose();
  };

  // Only ever requested from an explicit click below — browsers ignore or
  // block permission prompts that aren't triggered by a user gesture, and
  // auto-prompting on every login is intrusive.
  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setPermissionState(granted ? 'granted' : 'denied');
  };

  const formatNotificationTime = (createdAt) => {
    try {
      return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
    } catch (error) {
      return 'Recently';
    }
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        aria-label="Notifications"
        sx={{
          color: connected ? 'text.secondary' : 'text.disabled',
          '&:hover': { backgroundColor: 'action.hover' }
        }}
      >
        <Badge badgeContent={unreadCount} color="error" max={99}>
          {unreadCount > 0 ? <NotificationsActiveIcon /> : <NotificationsIcon />}
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 600,
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Notifications
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              size="small"
              label={connected ? 'Live' : 'Offline'}
              color={connected ? 'success' : 'default'}
              variant="outlined"
            />
            {unreadCount > 0 && (
              <Button size="small" onClick={handleMarkAllRead}>
                Mark all read
              </Button>
            )}
          </Box>
        </Box>

        <Divider />

        {!connected && (
          <Alert severity="warning" sx={{ m: 1 }}>
            Real-time notifications are offline
          </Alert>
        )}

        {permissionState === 'default' && (
          <Alert
            severity="info"
            sx={{ m: 1 }}
            action={
              <Button size="small" onClick={handleRequestPermission}>
                Enable
              </Button>
            }
          >
            Get desktop alerts for new notifications
          </Alert>
        )}

        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <NotificationsIcon sx={{ color: 'text.secondary', fontSize: 48, mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <List sx={{ py: 0, maxHeight: 400, overflow: 'auto' }}>
            {notifications.map((notification, index) => (
              <ListItem
                key={notification.notificationId || index}
                disablePadding
                sx={{
                  borderLeft: `4px solid ${
                    notification.isRead ? 'transparent' :
                    getNotificationColor(notification.type, notification.priority) === 'error' ? 'error.main' :
                    getNotificationColor(notification.type, notification.priority) === 'warning' ? 'warning.main' :
                    getNotificationColor(notification.type, notification.priority) === 'success' ? 'success.main' :
                    'info.main'
                  }`,
                }}
              >
                <ListItemButton
                  onClick={() => handleNotificationClick(notification)}
                  sx={{ backgroundColor: notification.isRead ? 'transparent' : 'action.hover' }}
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: notification.isRead ? 'normal' : 'bold',
                            flexGrow: 1,
                            mr: 1
                          }}
                        >
                          {notification.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatNotificationTime(notification.createdAt)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        component="span"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {notification.message}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Menu>

      {/* Notification Detail Dialog */}
      <Dialog
        open={detailDialog}
        onClose={() => setDetailDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedNotification && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getNotificationIcon(selectedNotification.type)}
                <Typography variant="h6">
                  {selectedNotification.title}
                </Typography>
              </Box>
              <IconButton onClick={() => setDetailDialog(false)}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={selectedNotification.type.replace('_', ' ')}
                  color={getNotificationColor(selectedNotification.type, selectedNotification.priority)}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={selectedNotification.priority}
                  variant="outlined"
                  size="small"
                />
              </Box>
              <Typography variant="body1" paragraph>
                {selectedNotification.message}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Received {formatNotificationTime(selectedNotification.createdAt)}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailDialog(false)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default NotificationDropdown;