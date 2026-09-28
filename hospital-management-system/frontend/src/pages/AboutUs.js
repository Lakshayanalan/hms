import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  useTheme,
  useMediaQuery,
  Button,
  Avatar,
  Stack,
  Card,
  CardContent,
} from '@mui/material';
import {
  LocalHospital as HospitalIcon,
  People as PeopleIcon,
  EmojiPeople as EmojiPeopleIcon,
  MedicalServices as MedicalIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Group as GroupIcon,
  Healing as HealingIcon,
  AccessTime as AccessTimeIcon,
  Star as StarIcon,
  LocalHospitalOutlined,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import PublicNavbar from '../components/Layout/PublicNavbar';
import { fadeSlideUp, staggerContainer, staggerItem } from '../motion/variants';

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
  color: 'white',
  paddingTop: theme.spacing(24),
  paddingBottom: theme.spacing(12),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.06\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
    opacity: 1,
    zIndex: 1,
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  '& .MuiSvgIcon-root': {
    fontSize: '3rem',
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
}));

const StatItem = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(3),
  '& .MuiSvgIcon-root': {
    fontSize: '2.5rem',
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(1),
  },
}));

const TeamMember = styled(Card)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(3, 2),
  '& .MuiAvatar-root': {
    width: 120,
    height: 120,
    margin: '0 auto',
    marginBottom: theme.spacing(2),
    fontSize: '2rem',
    fontWeight: 700,
  },
}));

const initials = (name) => name.replace('Dr. ', '').split(' ').map((n) => n[0]).join('');

const AboutUs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    { icon: <HealingIcon />, title: 'Advanced Medical Care', description: 'State-of-the-art facilities with cutting-edge technology for accurate diagnosis and effective treatment.' },
    { icon: <GroupIcon />, title: 'Expert Specialists', description: 'Our team of board-certified physicians and healthcare professionals provide exceptional care.' },
    { icon: <AccessTimeIcon />, title: '24/7 Emergency', description: 'Round-the-clock emergency services with immediate attention to critical conditions.' },
    { icon: <StarIcon />, title: 'Patient Satisfaction', description: 'Consistently high patient satisfaction scores and quality care metrics.' },
  ];

  const stats = [
    { value: '500+', label: 'Expert Doctors', icon: <MedicalIcon /> },
    { value: '50+', label: 'Specialties', icon: <HospitalIcon /> },
    { value: '1M+', label: 'Patients Treated', icon: <PeopleIcon /> },
    { value: '98%', label: 'Satisfaction Rate', icon: <EmojiPeopleIcon /> },
  ];

  const team = [
    { name: 'Dr. Sarah Johnson', role: 'Chief Medical Officer', bio: 'Board certified with over 15 years of experience in cardiology.' },
    { name: 'Dr. Michael Chen', role: 'Head of Surgery', bio: 'Specialized in minimally invasive procedures with 12+ years of experience.' },
    { name: 'Dr. Emily Wilson', role: 'Pediatrics Director', bio: "Dedicated to children's healthcare with a focus on preventive medicine." },
  ];

  return (
    <Box>
      <PublicNavbar />
      {/* Hero */}
      <HeroSection>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box component={motion.div} initial="hidden" animate="visible" variants={fadeSlideUp} textAlign="center" maxWidth="800px" mx="auto">
            <Typography variant={isMobile ? 'h3' : 'h2'} component="h1" gutterBottom sx={{ fontWeight: 800, lineHeight: 1.2, mb: 3, fontFamily: 'Outfit' }}>
              Excellence in Healthcare, Close to You
            </Typography>
            <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ opacity: 0.85, mb: 4, fontWeight: 400 }}>
              Committed to providing compassionate, high-quality healthcare services with a patient-first approach.
            </Typography>
            <Stack direction={isMobile ? 'column' : 'row'} spacing={2} justifyContent="center" sx={{ '& > *': { width: isMobile ? '100%' : 'auto' } }}>
              <Button variant="contained" color="primary" size="large" endIcon={<ArrowForwardIcon />} sx={{ py: 1.5, px: 4, fontWeight: 600 }}>
                Our Services
              </Button>
              <Button variant="outlined" color="inherit" size="large" sx={{ py: 1.5, px: 4, fontWeight: 600, borderWidth: 2, '&:hover': { borderWidth: 2 } }}>
                Contact Us
              </Button>
            </Stack>
          </Box>
        </Container>
      </HeroSection>

      {/* About Section */}
      <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4 }}
                sx={{
                  position: 'relative',
                  aspectRatio: '4 / 3',
                  borderRadius: 2,
                  background: (t) => `linear-gradient(135deg, ${t.palette.primary[50]} 0%, ${t.palette.primary[100]} 100%)`,
                  border: '2px solid',
                  borderColor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LocalHospitalOutlined sx={{ fontSize: 96, color: 'primary.main', opacity: 0.6 }} />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="overline" color="primary" sx={{ fontWeight: 600, letterSpacing: 1, mb: 2, display: 'inline-block' }}>
                About Us
              </Typography>
              <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700, mb: 3, lineHeight: 1.2 }}>
                We Provide the Best Medical Services
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.8 }}>
                Established in 2010, HealthCore has grown to become a leading healthcare provider,
                offering comprehensive medical services with a focus on patient-centered care.
                Our state-of-the-art facilities and expert medical professionals ensure that
                you receive the highest quality healthcare.
              </Typography>
              <Box sx={{ '& > * + *': { mt: 2 } }}>
                {['Board-certified physicians', '24/7 emergency care', 'Advanced diagnostic services', 'Personalized treatment plans'].map((item, index) => (
                  <Box key={index} display="flex" alignItems="center">
                    <CheckCircleIcon color="primary" sx={{ mr: 1.5 }} />
                    <Typography variant="body1">{item}</Typography>
                  </Box>
                ))}
              </Box>
              <Button variant="contained" color="primary" size="large" endIcon={<ArrowForwardIcon />} sx={{ mt: 4, py: 1.5, px: 4, fontWeight: 600 }}>
                Learn More
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Grid
            container
            spacing={3}
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer(0.1)}
          >
            {stats.map((stat, index) => (
              <Grid size={{ xs: 6, sm: 3 }} key={index}>
                <StatItem component={motion.div} variants={staggerItem}>
                  {stat.icon}
                  <Typography variant="h3" component="div" sx={{ fontWeight: 700, mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </StatItem>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" maxWidth="700px" mx="auto" mb={8}>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 600, letterSpacing: 1, mb: 2, display: 'inline-block' }}>
              Our Services
            </Typography>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
              Comprehensive Healthcare Solutions
            </Typography>
            <Typography variant="body1" color="text.secondary">
              We offer a wide range of medical services to meet all your healthcare needs,
              from routine check-ups to advanced surgical procedures.
            </Typography>
          </Box>
          <Grid
            container
            spacing={4}
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer(0.08)}
          >
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <FeatureCard component={motion.div} variants={staggerItem} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    {feature.icon}
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team */}
      <Box sx={{ py: 10, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" maxWidth="700px" mx="auto" mb={8}>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 600, letterSpacing: 1, mb: 2, display: 'inline-block' }}>
              Our Team
            </Typography>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
              Meet Our Expert Doctors
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Our team of highly skilled healthcare professionals is dedicated to providing
              the best possible care to our patients.
            </Typography>
          </Box>
          <Grid
            container
            spacing={4}
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer(0.1)}
          >
            {team.map((member, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <TeamMember component={motion.div} variants={staggerItem} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                  <Avatar sx={{ bgcolor: 'primary.100', color: 'primary.dark', border: '3px solid', borderColor: 'primary.main' }}>
                    {initials(member.name)}
                  </Avatar>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {member.name}
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 600, mb: 2 }}>
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.bio}
                  </Typography>
                </TeamMember>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Box sx={{ py: 12, background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)' }}>
        <Container maxWidth="md">
          <Box textAlign="center" color="white">
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700, mb: 3, color: 'white' }}>
              Ready to Experience Better Healthcare?
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.85, mb: 4, fontWeight: 400 }}>
              Schedule an appointment today and take the first step towards better health.
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{ bgcolor: 'primary.light', color: '#0A2E22', py: 1.5, px: 6, fontWeight: 700, backdropFilter: 'none', backgroundImage: 'none', border: 'none' }}
            >
              Book an Appointment
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutUs;
