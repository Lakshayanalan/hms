import React, { useState } from 'react';
import {
    Box,
    Container,
    TextField,
    Button,
    Typography,
    InputAdornment,
    IconButton,
    Checkbox,
    FormControlLabel,
    Link,
    Alert,
    CircularProgress,
    Divider,
    Stack,
    Chip,
    alpha,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    PersonOutline,
    LockOutlined,
    CalendarMonthOutlined,
    DescriptionOutlined,
    HealthAndSafetyOutlined,
    SupportAgentOutlined,
    VerifiedUserOutlined,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { primary, neutral } from '../theme/tokens';
import { fadeSlideUp, staggerContainer, staggerItem } from '../motion/variants';

const BACKGROUND_IMAGE = '/assets/images/service-nurse.png';

const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Features', to: '/services' },
    { label: 'About Us', to: '/about' },
    { label: 'Contact', to: '/contact' },
];

const highlights = [
    { icon: CalendarMonthOutlined, title: 'Appointments', text: 'Book with ease' },
    { icon: DescriptionOutlined, title: 'Medical Records', text: 'Access anytime' },
    { icon: HealthAndSafetyOutlined, title: 'Expert Doctors', text: 'Trusted professionals' },
    { icon: SupportAgentOutlined, title: '24/7 Support', text: 'Always here to help' },
];

const demoAccounts = [
    { role: 'Admin', username: 'admin', password: 'admin123' },
    { role: 'Doctor', username: 'doctor', password: 'doctor123' },
    { role: 'Patient', username: 'patient', password: 'patient123' },
    { role: 'Nurse', username: 'nurse', password: 'nurse123' },
    { role: 'Receptionist', username: 'receptionist', password: 'receptionist123' },
    { role: 'IT Officer', username: 'it_officer', password: 'it123' },
];

const onDark = {
    strong: neutral.white,
    muted: alpha(neutral.white, 0.82),
    subtle: alpha(neutral.white, 0.68),
};

const fieldSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '14px',
        bgcolor: neutral.surface,
        minHeight: 52,
    },
};

const FieldLabel = ({ htmlFor, children }) => (
    <Typography component="label" htmlFor={htmlFor} variant="body2" sx={{ display: 'block', mb: 0.75, fontWeight: 600, color: 'text.primary' }}>
        {children}
    </Typography>
);

const Heartbeat = () => (
    <svg width="96" height="24" viewBox="0 0 96 24" fill="none" aria-hidden="true">
        <path d="M0 12h30l5-9 7 18 6-14 4 5h44" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ModernLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const fillDemoAccount = ({ username, password }) => {
        setFormData({ username, password });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', formData);
            const { token, userId, username, role, email } = response.data;
            const userInfo = { userId, username, role, email };
            login(token, role, userInfo);
            navigate('/dashboard');
        } catch (err) {
            const errorMessage = err.response?.data || 'Login failed. Please check your credentials.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            component="main"
            sx={{
                position: 'relative',
                minHeight: '100vh',
                overflow: 'hidden',
                bgcolor: primary[900],
                color: onDark.strong,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Background photo + brand-tinted overlay */}
            <Box
                component={motion.img}
                src={BACKGROUND_IMAGE}
                alt=""
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                sx={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: { xs: '50% 15%', lg: 'center 20%' },
                }}
            />
            <Box
                aria-hidden="true"
                sx={{
                    position: 'absolute',
                    inset: 0,
                    background: {
                        xs: `linear-gradient(180deg, ${alpha(primary[900], 0.78)} 0%, ${alpha(primary[900], 0.9)} 45%, ${alpha(primary[900], 0.96)} 100%)`,
                        lg: `linear-gradient(90deg, ${alpha(primary[900], 0.94)} 0%, ${alpha(primary[900], 0.78)} 32%, ${alpha(primary[800], 0.3)} 55%, ${alpha(primary[900], 0.55)} 78%, ${alpha(primary[900], 0.75)} 100%)`,
                    },
                }}
            />

            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', py: { xs: 3, md: 4 } }}>
                {/* Brand header */}
                <Stack
                    component={motion.header}
                    initial="hidden"
                    animate="visible"
                    variants={fadeSlideUp}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', color: 'inherit' }}>
                        <Box
                            component="img"
                            src="/logo-mark.jpg"
                            alt=""
                            sx={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', boxShadow: `0 8px 20px ${alpha(primary[900], 0.5)}` }}
                        />
                        <Box>
                            <Typography component="span" sx={{ display: 'block', fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.1 }}>
                                HealthCore
                            </Typography>
                            <Typography component="span" variant="caption" sx={{ display: 'block', color: onDark.muted }}>
                                Healthier Today, Brighter Tomorrow
                            </Typography>
                        </Box>
                    </Box>

                    <Stack
                        component="nav"
                        aria-label="Site"
                        direction="row"
                        alignItems="center"
                        divider={<Box component="span" aria-hidden="true" sx={{ width: '1px', height: 14, bgcolor: alpha(neutral.white, 0.35) }} />}
                        spacing={2}
                        sx={{ display: { xs: 'none', md: 'flex' } }}
                    >
                        {navLinks.map(({ label, to }) => (
                            <Link
                                key={to}
                                component={RouterLink}
                                to={to}
                                underline="hover"
                                variant="body2"
                                sx={{ color: onDark.muted, fontWeight: 500, '&:hover': { color: onDark.strong } }}
                            >
                                {label}
                            </Link>
                        ))}
                    </Stack>

                    <Link
                        component={RouterLink}
                        to="/"
                        variant="body2"
                        underline="hover"
                        sx={{ display: { xs: 'inline-flex', md: 'none' }, color: onDark.muted, fontWeight: 600 }}
                    >
                        Back to Home
                    </Link>
                </Stack>

                {/* Main layout */}
                <Box
                    sx={{
                        flex: 1,
                        display: 'grid',
                        alignItems: 'center',
                        alignContent: { xs: 'start', lg: 'center' },
                        columnGap: 8,
                        rowGap: { xs: 4, lg: 5 },
                        py: { xs: 5, lg: 4 },
                        gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 460px' },
                        gridTemplateAreas: {
                            xs: '"intro" "card" "highlights"',
                            lg: '"intro card" "highlights card"',
                        },
                    }}
                >
                    {/* Intro copy */}
                    <Stack
                        component={motion.div}
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer(0.1, 0.1)}
                        spacing={3}
                        sx={{
                            gridArea: 'intro',
                            alignSelf: { lg: 'end' },
                            justifySelf: { xs: 'center', lg: 'start' },
                            alignItems: { xs: 'center', lg: 'flex-start' },
                            textAlign: { xs: 'center', lg: 'left' },
                            maxWidth: 520,
                        }}
                    >
                        <Typography
                            component={motion.p}
                            variants={staggerItem}
                            sx={{
                                fontFamily: 'Outfit',
                                fontWeight: 700,
                                fontSize: { xs: '2.25rem', md: '3rem' },
                                lineHeight: 1.1,
                                letterSpacing: '-0.02em',
                                color: onDark.strong,
                            }}
                        >
                            Smarter Care,
                            <Box component="span" sx={{ display: 'block', color: primary[200] }}>
                                Healthier Lives
                            </Box>
                        </Typography>

                        <Stack
                            component={motion.ul}
                            variants={staggerItem}
                            direction="row"
                            flexWrap="wrap"
                            useFlexGap
                            columnGap={1.5}
                            rowGap={0.5}
                            sx={{ listStyle: 'none', p: 0, m: 0, justifyContent: { xs: 'center', lg: 'flex-start' } }}
                        >
                            {['Trusted Care', 'Smart Scheduling', 'Secure Records'].map((item, index) => (
                                <Box component="li" key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    {index > 0 && <Box component="span" aria-hidden="true" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: primary[200] }} />}
                                    <Typography variant="body2" component="span" sx={{ color: onDark.muted, fontWeight: 500 }}>
                                        {item}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>

                        <Typography
                            component={motion.p}
                            variants={staggerItem}
                            sx={{
                                display: { xs: 'none', lg: 'block' },
                                fontSize: '1.125rem',
                                fontStyle: 'italic',
                                lineHeight: 1.6,
                                color: onDark.muted,
                                borderLeft: `2px solid ${primary[300]}`,
                                pl: 2,
                                maxWidth: 360,
                            }}
                        >
                            Every patient, every shift, every record — managed in one secure place.
                        </Typography>
                    </Stack>

                    {/* Highlights strip */}
                    <Box
                        component={motion.ul}
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer(0.08, 0.35)}
                        aria-label="Platform highlights"
                        sx={{
                            gridArea: 'highlights',
                            alignSelf: { lg: 'start' },
                            justifySelf: { xs: 'stretch', sm: 'center', lg: 'start' },
                            width: { sm: '100%' },
                            listStyle: 'none',
                            m: 0,
                            p: { xs: 2, sm: 2.5 },
                            maxWidth: 640,
                            display: 'grid',
                            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
                            gap: { xs: 2, sm: 1 },
                            borderRadius: '20px',
                            bgcolor: alpha(neutral.white, 0.1),
                            border: `1px solid ${alpha(neutral.white, 0.22)}`,
                            backdropFilter: 'blur(14px)',
                            WebkitBackdropFilter: 'blur(14px)',
                        }}
                    >
                        {highlights.map(({ icon: Icon, title, text }) => (
                            <Box
                                component={motion.li}
                                variants={staggerItem}
                                key={title}
                                sx={{ textAlign: 'center', px: 1 }}
                            >
                                <Icon sx={{ fontSize: 28, color: primary[200], mb: 0.75 }} aria-hidden="true" />
                                <Typography variant="body2" sx={{ fontWeight: 700, color: onDark.strong, lineHeight: 1.3 }}>
                                    {title}
                                </Typography>
                                <Typography variant="caption" sx={{ display: 'block', color: onDark.subtle }}>
                                    {text}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Login card */}
                    <Box
                        component={motion.section}
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer(0.06, 0.15)}
                        aria-labelledby="login-heading"
                        sx={{
                            gridArea: 'card',
                            width: '100%',
                            maxWidth: 460,
                            justifySelf: { xs: 'center', lg: 'end' },
                            color: 'text.primary',
                            bgcolor: alpha(neutral.white, 0.95),
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: `1px solid ${alpha(neutral.white, 0.7)}`,
                            borderRadius: '28px',
                            boxShadow: `0 30px 80px ${alpha(primary[900], 0.45)}`,
                            p: { xs: 3, sm: 4.5 },
                        }}
                    >
                        <Box component={motion.div} variants={staggerItem} sx={{ textAlign: 'center', mb: 3 }}>
                            <Box
                                component="img"
                                src="/logo-mark.jpg"
                                alt=""
                                sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    display: 'inline-block',
                                    mb: 1.5,
                                    boxShadow: `0 10px 24px ${alpha(primary[500], 0.3)}`,
                                }}
                            />
                            <Typography id="login-heading" component="h1" sx={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.875rem', lineHeight: 1.2, color: 'text.primary', mb: 0.75 }}>
                                Welcome Back
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Log in to your HealthCore account
                            </Typography>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        <Box component={motion.form} variants={staggerItem} onSubmit={handleSubmit} noValidate={false}>
                            <Box sx={{ mb: 2 }}>
                                <FieldLabel htmlFor="login-username">Username or email</FieldLabel>
                                <TextField
                                    id="login-username"
                                    fullWidth
                                    name="username"
                                    placeholder="Enter your username or email"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    autoComplete="username"
                                    sx={fieldSx}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonOutline sx={{ color: 'text.secondary' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                            <Box sx={{ mb: 1.5 }}>
                                <FieldLabel htmlFor="login-password">Password</FieldLabel>
                                <TextField
                                    id="login-password"
                                    fullWidth
                                    name="password"
                                    placeholder="Enter your password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="current-password"
                                    sx={fieldSx}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockOutlined sx={{ color: 'text.secondary' }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                    sx={{ color: 'text.secondary' }}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                            <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 2.5 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label={<Typography variant="body2">Remember me</Typography>}
                                />
                                <Link href="#" underline="hover" variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                                    Forgot password?
                                </Link>
                            </Stack>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                endIcon={!loading && (
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                                        <path d="M4.167 10h11.666m0 0L10 4.167M15.833 10 10 15.833" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                                sx={{
                                    minHeight: 52,
                                    borderRadius: 999,
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    fontWeight: 700,
                                    backdropFilter: 'none',
                                    backgroundImage: 'none',
                                    border: 'none',
                                    boxShadow: `0 10px 24px ${alpha(primary[500], 0.3)}`,
                                    '&:hover': { bgcolor: 'primary.dark', boxShadow: `0 12px 28px ${alpha(primary[500], 0.36)}` },
                                    '&.Mui-disabled': { bgcolor: 'primary.main', color: 'white', opacity: 0.7 },
                                }}
                            >
                                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} aria-label="Signing in" /> : 'Log In'}
                            </Button>
                        </Box>

                        <Divider sx={{ my: 2.5 }}>
                            <Typography variant="body2" color="text.secondary">
                                New to HealthCore?
                            </Typography>
                        </Divider>

                        <Button
                            component={motion.button}
                            variants={staggerItem}
                            fullWidth
                            variant="outlined"
                            onClick={() => navigate('/register')}
                            sx={{
                                minHeight: 52,
                                borderRadius: 999,
                                fontWeight: 700,
                                borderColor: 'primary.main',
                                color: 'primary.main',
                                bgcolor: 'background.paper',
                                '&:hover': { borderColor: 'primary.dark', color: 'primary.dark', bgcolor: primary[50] },
                            }}
                        >
                            Create Patient Account
                        </Button>

                        {/* Demo accounts */}
                        <Box
                            component={motion.div}
                            variants={staggerItem}
                            sx={{ mt: 2.5, p: 2, borderRadius: '16px', bgcolor: primary[50], border: `1px solid ${primary[100]}` }}
                        >
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5, color: primary[600] }}>
                                <Box>
                                    <Typography variant="body2" component="h2" sx={{ fontWeight: 700, color: primary[800] }}>
                                        Try a demo account
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        Select a role to fill in its credentials
                                    </Typography>
                                </Box>
                                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                    <Heartbeat />
                                </Box>
                            </Stack>
                            <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
                                {demoAccounts.map((account) => (
                                    <Chip
                                        key={account.role}
                                        label={account.role}
                                        onClick={() => fillDemoAccount(account)}
                                        variant={formData.username === account.username ? 'filled' : 'outlined'}
                                        color="primary"
                                        sx={{
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            bgcolor: formData.username === account.username ? 'primary.main' : 'background.paper',
                                            borderColor: primary[200],
                                        }}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    </Box>
                </Box>

                {/* Footer line */}
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1.5}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="body2" sx={{ fontStyle: 'italic', color: onDark.muted }}>
                            Because every life matters
                        </Typography>
                        <Box aria-hidden="true" sx={{ width: 120, height: '1px', bgcolor: alpha(neutral.white, 0.35) }} />
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.75} sx={{ color: onDark.muted }}>
                        <VerifiedUserOutlined sx={{ fontSize: 16 }} aria-hidden="true" />
                        <Typography variant="caption">Safe • Secure • Confidential</Typography>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
};

export default ModernLogin;
