import React, { useState } from 'react';
import {
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

// Error Context for global error handling
export const ErrorContext = React.createContext();

// Error Handler Hook
export const useErrorHandler = () => {
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [success, setSuccess] = useState([]);
  const [loading, setLoading] = useState(false);

  const addError = (error, details = null) => {
    const errorObj = {
      id: Date.now() + Math.random(),
      message: typeof error === 'string' ? error : error.message || 'An error occurred',
      details,
      timestamp: new Date(),
      type: 'error'
    };
    setErrors(prev => [...prev, errorObj]);
  };

  const addWarning = (warning, details = null) => {
    const warningObj = {
      id: Date.now() + Math.random(),
      message: typeof warning === 'string' ? warning : warning.message || 'Warning',
      details,
      timestamp: new Date(),
      type: 'warning'
    };
    setWarnings(prev => [...prev, warningObj]);
  };

  const addSuccess = (success, details = null) => {
    const successObj = {
      id: Date.now() + Math.random(),
      message: typeof success === 'string' ? success : success.message || 'Success',
      details,
      timestamp: new Date(),
      type: 'success'
    };
    setSuccess(prev => [...prev, successObj]);
  };

  const removeError = (id) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  };

  const removeWarning = (id) => {
    setWarnings(prev => prev.filter(warning => warning.id !== id));
  };

  const removeSuccess = (id) => {
    setSuccess(prev => prev.filter(success => success.id !== id));
  };

  const clearAll = () => {
    setErrors([]);
    setWarnings([]);
    setSuccess([]);
  };

  const handleAxiosError = (error) => {
    if (error.response) {
      // Server responded with error
      const status = error.response.status;
      const data = error.response.data;
      
      let message = 'An error occurred';
      let details = null;

      if (status === 400) {
        message = 'Bad Request - Please check your input';
        details = data.message || data;
      } else if (status === 401) {
        message = 'Unauthorized - Please log in again';
      } else if (status === 403) {
        message = 'Access Denied - You don\'t have permission';
      } else if (status === 404) {
        message = 'Not Found - The requested resource was not found';
      } else if (status === 409) {
        message = 'Conflict - Resource already exists';
        details = data.message || data;
      } else if (status === 422) {
        message = 'Validation Error';
        details = data.message || data;
      } else if (status >= 500) {
        message = 'Server Error - Please try again later';
        details = 'Internal server error occurred';
      }

      addError(message, details);
    } else if (error.request) {
      // Network error
      addError('Network Error - Please check your connection');
    } else {
      // Other error
      addError(error.message || 'An unexpected error occurred');
    }
  };

  return {
    errors,
    warnings,
    success,
    loading,
    setLoading,
    addError,
    addWarning,
    addSuccess,
    removeError,
    removeWarning,
    removeSuccess,
    clearAll,
    handleAxiosError
  };
};

// Global Error Boundary Component
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo: errorInfo || {}
    });
    
    // Log error to console or external service
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            An unexpected error occurred. Please refresh the page or try again later.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Reload Page
          </Button>
          {process.env.NODE_ENV === 'development' && (
            <Box sx={{ mt: 3, textAlign: 'left' }}>
              <Typography variant="h6" color="error">
                Error Details (Development Mode):
              </Typography>
              <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo?.componentStack || 'No component stack available'}
              </pre>
            </Box>
          )}
        </Box>
      );
    }

    return this.props.children;
  }
}

// Error Display Component
export const ErrorDisplay = ({ errors, onClose, showDetails = false }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpanded = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!errors || errors.length === 0) return null;

  return (
    <Box sx={{ mb: 2 }}>
      {errors.map((error) => (
        <Alert
          key={error.id}
          severity={error.type || 'error'}
          action={
            <Box>
              {error.details && showDetails && (
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={() => toggleExpanded(error.id)}
                >
                  {expanded[error.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              )}
              <IconButton
                color="inherit"
                size="small"
                onClick={() => onClose && onClose(error.id)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            </Box>
          }
          sx={{ mb: 1 }}
        >
          <Typography variant="body2">
            {error.message}
          </Typography>
          {error.details && showDetails && (
            <Collapse in={expanded[error.id]}>
              <Box sx={{ mt: 1, p: 1, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 1 }}>
                <Typography variant="caption">
                  Details: {typeof error.details === 'string' ? error.details : JSON.stringify(error.details)}
                </Typography>
              </Box>
            </Collapse>
          )}
        </Alert>
      ))}
    </Box>
  );
};

// Toast Notification Component
export const NotificationToast = ({ notifications, onClose }) => {
  return (
    <>
      {notifications.map((notification, index) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={6000}
          onClose={() => onClose(notification.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ mt: index * 7 }} // Stack multiple toasts
        >
          <Alert
            onClose={() => onClose(notification.id)}
            severity={notification.type}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

// Validation Error Dialog
export const ValidationErrorDialog = ({ open, onClose, errors }) => {
  if (!errors || errors.length === 0) return null;

  const groupedErrors = errors.reduce((acc, error) => {
    const field = error.field || 'General';
    if (!acc[field]) acc[field] = [];
    acc[field].push(error);
    return acc;
  }, {});

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <WarningIcon color="warning" sx={{ mr: 1 }} />
          Validation Errors
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary" paragraph>
          Please correct the following errors before proceeding:
        </Typography>
        {Object.entries(groupedErrors).map(([field, fieldErrors]) => (
          <Box key={field} sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" color="primary">
              {field}:
            </Typography>
            <List dense>
              {fieldErrors.map((error, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <ErrorIcon color="error" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={error.message}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Form Validation Utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[+]?[0-9\-\s()]*$/;
  return phoneRegex.test(phone);
};

export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateMinLength = (value, minLength, fieldName = 'Field') => {
  if (value && value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long`;
  }
  return null;
};

export const validateMaxLength = (value, maxLength, fieldName = 'Field') => {
  if (value && value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return null;
};

export const validateDate = (date, fieldName = 'Date') => {
  if (!date) return `${fieldName} is required`;
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return `${fieldName} is not a valid date`;
  }
  
  if (dateObj > new Date()) {
    return `${fieldName} cannot be in the future`;
  }
  
  return null;
};

// Input Sanitization Utilities
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove HTML tags and potentially dangerous characters
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>?/gm, '')
    .trim();
};

export const sanitizeNumeric = (input) => {
  return input.replace(/[^0-9]/g, '');
};

export const sanitizeAlphanumeric = (input) => {
  return input.replace(/[^a-zA-Z0-9\s]/g, '');
};

export const sanitizePhone = (input) => {
  return input.replace(/[^0-9+\-\s()]/g, '');
};

// Loading State Hook
export const useLoadingState = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const execute = async (asyncFunction) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await asyncFunction();
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, execute };
};