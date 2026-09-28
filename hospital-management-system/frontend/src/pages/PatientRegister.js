import React, { useState } from 'react';
import {
    Box,
    Container,
    TextField,
    Button,
    Typography,
    Paper,
    InputAdornment,
    IconButton,
    Alert,
    CircularProgress,
    Grid,
    MenuItem,
    useTheme,
    useMediaQuery,
    Stepper,
    Step,
    StepLabel,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    PersonOutline,
    LockOutlined,
    EmailOutlined,
    PhoneOutlined,
    HomeOutlined,
    CalendarTodayOutlined,
    LocalHospitalOutlined,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import PublicNavbar from '../components/Layout/PublicNavbar';

const PatientRegister = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        // Account Info
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        
        // Personal Info
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        phoneNumber: '',
        
        // Address Info
        address: '',
        city: '',
        state: '',
        zipCode: '',
        
        // Medical Info
        bloodGroup: '',
        allergies: '',
        emergencyContact: '',
        emergencyPhone: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const steps = ['Account Details', 'Personal Information', 'Medical Information'];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const validateStep = (step) => {
        switch (step) {
            case 0:
                if (!formData.username || !formData.password || !formData.email) {
                    setError('Please fill in all required fields');
                    return false;
                }
                if (formData.password.length < 6) {
                    setError('Password must be at least 6 characters');
                    return false;
                }
                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match');
                    return false;
                }
                if (!/\S+@\S+\.\S+/.test(formData.email)) {
                    setError('Please enter a valid email address');
                    return false;
                }
                break;
            case 1:
                if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.gender || !formData.phoneNumber) {
                    setError('Please fill in all required fields');
                    return false;
                }
                break;
            case 2:
                if (!formData.emergencyContact || !formData.emergencyPhone) {
                    setError('Please provide emergency contact information');
                    return false;
                }
                break;
            default:
                break;
        }
        setError('');
        return true;
    };

    const handleNext = () => {
        if (validateStep(activeStep)) {
            setActiveStep((prevStep) => prevStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateStep(activeStep)) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Prepare patient registration data
            const registrationData = {
                username: formData.username,
                password: formData.password,
                email: formData.email,
                role: 'PATIENT',
                patientData: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    dateOfBirth: formData.dateOfBirth,
                    gender: formData.gender,
                    phoneNumber: formData.phoneNumber,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode,
                    bloodGroup: formData.bloodGroup,
                    allergies: formData.allergies,
                    emergencyContact: formData.emergencyContact,
                    emergencyPhone: formData.emergencyPhone,
                }
            };

            console.log('Registering patient:', registrationData);

            // Make API call to register patient
            await api.post('/auth/register/patient', registrationData);

            setSuccess(true);
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login', { state: { message: 'Registration successful! Please login with your credentials.' } });
            }, 2000);

        } catch (err) {
            console.error('Registration error:', err);
            const errorMessage = err.response?.data?.message || err.response?.data || 'Registration failed. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                required
                                name="username"
                                label="Username"
                                value={formData.username}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonOutline color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                required
                                name="email"
                                label="Email Address"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailOutlined color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                required
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlined color="primary" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                required
                                name="confirmPassword"
                                label="Confirm Password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlined color="primary" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                );
            case 1:
                return (
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                required
                                name="firstName"
                                label="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                required
                                name="lastName"
                                label="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                required
                                name="dateOfBirth"
                                label="Date of Birth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarTodayOutlined color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                required
                                select
                                name="gender"
                                label="Gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <MenuItem value="MALE">Male</MenuItem>
                                <MenuItem value="FEMALE">Female</MenuItem>
                                <MenuItem value="OTHER">Other</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                required
                                name="phoneNumber"
                                label="Phone Number"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PhoneOutlined color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                name="address"
                                label="Street Address"
                                value={formData.address}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <HomeOutlined color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                fullWidth
                                name="city"
                                label="City"
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                fullWidth
                                name="state"
                                label="State"
                                value={formData.state}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                fullWidth
                                name="zipCode"
                                label="ZIP Code"
                                value={formData.zipCode}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                );
            case 2:
                return (
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                select
                                name="bloodGroup"
                                label="Blood Group"
                                value={formData.bloodGroup}
                                onChange={handleChange}
                            >
                                <MenuItem value="A+">A+</MenuItem>
                                <MenuItem value="A-">A-</MenuItem>
                                <MenuItem value="B+">B+</MenuItem>
                                <MenuItem value="B-">B-</MenuItem>
                                <MenuItem value="AB+">AB+</MenuItem>
                                <MenuItem value="AB-">AB-</MenuItem>
                                <MenuItem value="O+">O+</MenuItem>
                                <MenuItem value="O-">O-</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                name="allergies"
                                label="Allergies (if any)"
                                value={formData.allergies}
                                onChange={handleChange}
                                placeholder="e.g., Penicillin, Peanuts"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                required
                                name="emergencyContact"
                                label="Emergency Contact Name"
                                value={formData.emergencyContact}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                required
                                name="emergencyPhone"
                                label="Emergency Contact Phone"
                                value={formData.emergencyPhone}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PhoneOutlined color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                );
            default:
                return null;
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#FFFFFF' }}>
            <PublicNavbar />
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, rgba(0, 184, 212, 0.05) 0%, rgba(255, 255, 255, 1) 100%)',
                    pt: { xs: 12, md: 15 },
                    pb: 8,
                }}
            >
                <Container maxWidth="md">
                    <Paper
                        elevation={8}
                        sx={{
                            p: { xs: 3, md: 5 },
                            borderRadius: 4,
                            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 1))',
                        }}
                    >
                        {/* Header */}
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 70,
                                    height: 70,
                                    borderRadius: '50%',
                                    bgcolor: 'primary.main',
                                    mb: 2,
                                }}
                            >
                                <LocalHospitalOutlined sx={{ fontSize: 40, color: 'white' }} />
                            </Box>
                            <Typography
                                variant="h4"
                                gutterBottom
                                sx={{
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #1976d2, #00b8d4)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Patient Registration
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Create your account to access our healthcare services
                            </Typography>
                        </Box>

                        {/* Stepper */}
                        <Stepper activeStep={activeStep} orientation={isMobile ? 'vertical' : 'horizontal'} sx={{ mb: 4 }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        {/* Error Message */}
                        {error && (
                            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {/* Success Message */}
                        {success && (
                            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                                Registration successful! Redirecting to login...
                            </Alert>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <Box sx={{ mb: 4 }}>
                                {renderStepContent(activeStep)}
                            </Box>

                            {/* Navigation Buttons */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                                <Button
                                    onClick={handleBack}
                                    disabled={activeStep === 0 || loading}
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 2,
                                        px: 4,
                                        py: 1.5,
                                        fontWeight: 600,
                                        textTransform: 'none',
                                    }}
                                >
                                    Back
                                </Button>
                                <Box sx={{ flex: 1 }} />
                                {activeStep === steps.length - 1 ? (
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={loading}
                                        sx={{
                                            borderRadius: 2,
                                            px: 4,
                                            py: 1.5,
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            background: 'linear-gradient(135deg, #1976d2, #00b8d4)',
                                            minWidth: 150,
                                        }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleNext}
                                        variant="contained"
                                        sx={{
                                            borderRadius: 2,
                                            px: 4,
                                            py: 1.5,
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            background: 'linear-gradient(135deg, #1976d2, #00b8d4)',
                                        }}
                                    >
                                        Next
                                    </Button>
                                )}
                            </Box>
                        </form>

                        {/* Login Link */}
                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                                Already have an account?{' '}
                                <Button
                                    onClick={() => navigate('/login')}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        color: 'primary.main',
                                    }}
                                >
                                    Login here
                                </Button>
                            </Typography>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </Box>
    );
};

export default PatientRegister;
