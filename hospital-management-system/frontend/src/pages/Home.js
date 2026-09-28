import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  alpha,
  Stack,
  Avatar,
  AvatarGroup,
  Divider,
} from '@mui/material';
import {
  People,
  TrendingUp,
  MedicalServices,
  CalendarMonth,
  HealthAndSafety,
  SupportAgent,
  Insights,
  AccessTime,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/Layout/PublicNavbar';
import { primary, neutral } from '../theme/tokens';
import { staggerContainer, staggerItem } from '../motion/variants';

const HERO_IMAGE = '/assets/images/hero-doctor.png';

const ArrowForward = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4.16699 10H15.8337M15.8337 10L10.0003 4.16667M15.8337 10L10.0003 15.8333" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FloatingCard = ({ sx, children }) => (
  <Box
    component={motion.div}
    variants={staggerItem}
    whileHover={{ y: -4 }}
    sx={{
      position: 'absolute',
      zIndex: 2,
      bgcolor: alpha(neutral.white, 0.92),
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid',
      borderColor: alpha(primary[500], 0.16),
      borderRadius: 3,
      boxShadow: '0 12px 32px rgba(15, 23, 42, 0.10)',
      ...sx,
    }}
  >
    {children}
  </Box>
);

const heroHighlights = [
  { icon: MedicalServices, label: 'Expert Doctors' },
  { icon: CalendarMonth, label: 'Smart Scheduling' },
  { icon: SupportAgent, label: '24/7 Support' },
];

const trustAvatars = [
  { initials: 'AK', color: primary[500] },
  { initials: 'RM', color: primary[700] },
  { initials: 'JL', color: primary[400] },
  { initials: 'SP', color: primary[800] },
];

const Home = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <People sx={{ fontSize: 48 }} />, title: 'Patient Management', description: 'Complete patient records, history, and seamless appointment scheduling.', color: primary[500] },
    { icon: <CalendarMonth sx={{ fontSize: 48 }} />, title: 'Appointment System', description: 'Efficient scheduling and management of doctor appointments with real-time updates.', color: primary[600] },
    { icon: <MedicalServices sx={{ fontSize: 48 }} />, title: 'Medical Records', description: 'Secure digital storage and easy access to complete medical history.', color: primary[700] },
    { icon: <TrendingUp sx={{ fontSize: 48 }} />, title: 'Analytics & Reports', description: 'Comprehensive insights and data visualization for better decision making.', color: primary[400] },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <PublicNavbar />

      {/* Hero Section */}
      <Box
        component="section"
        aria-labelledby="hero-heading"
        sx={{
          position: 'relative',
          overflowX: 'clip',
          pt: { xs: 16, md: 20 },
          pb: { xs: 10, md: 14 },
          background: `radial-gradient(55% 45% at 85% 25%, ${alpha(primary[100], 0.55)} 0%, transparent 70%), linear-gradient(180deg, ${neutral.white} 0%, ${neutral.surface} 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 8, lg: 6 }} alignItems="center">
            {/* Copy */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Stack
                component={motion.div}
                initial="hidden"
                animate="visible"
                variants={staggerContainer(0.1)}
                spacing={3.5}
                alignItems="flex-start"
              >
                <Box
                  component={motion.div}
                  variants={staggerItem}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.75,
                    py: 0.75,
                    borderRadius: 999,
                    bgcolor: primary[50],
                    border: '1px solid',
                    borderColor: primary[200],
                    color: primary[700],
                  }}
                >
                  <HealthAndSafety sx={{ fontSize: 18 }} aria-hidden="true" />
                  <Typography variant="body2" component="span" sx={{ fontWeight: 600 }}>
                    Smart Healthcare, Built for Your Facility
                  </Typography>
                </Box>

                <Typography
                  id="hero-heading"
                  component={motion.h1}
                  variants={staggerItem}
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.25rem', md: '3rem' },
                    lineHeight: 1.1,
                    letterSpacing: '-0.03em',
                    fontWeight: 700,
                    color: 'text.primary',
                    maxWidth: 560,
                  }}
                >
                  Transform Healthcare{' '}
                  <Box component="span" sx={{ color: 'primary.main' }}>Efficiency</Box>
                </Typography>

                <Typography
                  component={motion.p}
                  variants={staggerItem}
                  variant="body1"
                  sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, color: 'text.secondary', maxWidth: 480, lineHeight: 1.7 }}
                >
                  Cutting-edge technology for patients, staff, appointments and billing, brought together in one comprehensive, easy-to-use system.
                </Typography>

                <Stack
                  component={motion.div}
                  variants={staggerItem}
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  <Button
                    variant="contained"
                    onClick={() => navigate('/login')}
                    endIcon={
                      <Box
                        component="span"
                        sx={{ width: 34, height: 34, borderRadius: '50%', bgcolor: 'white', color: 'primary.main', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <ArrowForward />
                      </Box>
                    }
                    sx={{
                      borderRadius: 999,
                      pl: 3,
                      pr: 0.75,
                      py: 0.75,
                      minHeight: 48,
                      bgcolor: 'primary.main',
                      color: 'white',
                      backdropFilter: 'none',
                      backgroundImage: 'none',
                      border: 'none',
                      boxShadow: `0 8px 20px ${alpha(primary[500], 0.28)}`,
                      '& .MuiButton-endIcon': { ml: 1.5, mr: 0 },
                      '&:hover': { bgcolor: 'primary.dark', boxShadow: `0 10px 24px ${alpha(primary[500], 0.34)}` },
                    }}
                  >
                    Get Started
                  </Button>

                  <Button
                    variant="outlined"
                    component={Link}
                    to="/services"
                    sx={{
                      borderRadius: 999,
                      px: 3,
                      minHeight: 48,
                      color: 'text.primary',
                      borderColor: 'divider',
                      bgcolor: 'background.paper',
                      '&:hover': { borderColor: 'primary.main', color: 'primary.main', bgcolor: 'background.paper' },
                    }}
                  >
                    Explore Features
                  </Button>
                </Stack>

                <Stack component={motion.div} variants={staggerItem} direction="row" spacing={2} alignItems="center" sx={{ pt: 1 }}>
                  <AvatarGroup
                    aria-hidden="true"
                    sx={{ '& .MuiAvatar-root': { width: 40, height: 40, fontSize: '0.875rem', fontWeight: 600, border: `2px solid ${neutral.white}` } }}
                  >
                    {trustAvatars.map(({ initials, color }) => (
                      <Avatar key={initials} sx={{ bgcolor: color }}>{initials}</Avatar>
                    ))}
                  </AvatarGroup>
                  <Box>
                    <Typography variant="h5" component="p" sx={{ fontWeight: 700, color: 'primary.main', lineHeight: 1.2 }}>
                      4K+
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Trusted by healthcare teams
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Grid>

            {/* Visual */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Box
                component={motion.div}
                initial="hidden"
                animate="visible"
                variants={staggerContainer(0.12, 0.2)}
                sx={{ position: 'relative', maxWidth: 580, mx: 'auto', px: { sm: 4 } }}
              >
                {/* Decorative dotted panel */}
                <Box
                  aria-hidden="true"
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: { xs: -8, sm: 8 },
                    width: '55%',
                    height: '55%',
                    borderRadius: '32px',
                    backgroundImage: `radial-gradient(${alpha(primary[500], 0.25)} 1.5px, transparent 1.5px)`,
                    backgroundSize: '16px 16px',
                    zIndex: 0,
                  }}
                />

                <Box
                  component={motion.div}
                  variants={staggerItem}
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    p: 1.5,
                    borderRadius: '32px',
                    background: `linear-gradient(160deg, ${primary[50]} 0%, ${neutral.white} 55%, ${alpha(primary[100], 0.7)} 100%)`,
                    border: '1px solid',
                    borderColor: primary[100],
                    boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)',
                  }}
                >
                  <Box
                    component="img"
                    src={HERO_IMAGE}
                    alt="Physician in a white coat using a laptop in a modern hospital corridor"
                    sx={{ display: 'block', width: '100%', aspectRatio: { xs: '1 / 1', lg: '4 / 5' }, objectFit: 'cover', objectPosition: '35% center', borderRadius: '24px' }}
                  />
                </Box>

                {/* Highlights */}
                <FloatingCard sx={{ top: '12%', left: 0, p: 1.5, width: 176, display: { xs: 'none', sm: 'block' } }}>
                  <Stack divider={<Divider flexItem sx={{ borderColor: alpha(primary[500], 0.12) }} />} spacing={1.25}>
                    {heroHighlights.map(({ icon: Icon, label }) => (
                      <Stack key={label} direction="row" spacing={1.25} alignItems="center">
                        <Box sx={{ width: 36, height: 36, flexShrink: 0, borderRadius: '50%', border: '1px solid', borderColor: primary[200], color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon sx={{ fontSize: 18 }} aria-hidden="true" />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1.3 }}>
                          {label}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </FloatingCard>

                {/* Appointment preview */}
                <FloatingCard sx={{ top: { sm: '46%', lg: '38%' }, right: 0, p: 2, width: 232, display: { xs: 'none', sm: 'block' } }}>
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <Avatar
                        src={HERO_IMAGE}
                        alt=""
                        sx={{ width: 40, height: 40, '& img': { objectPosition: '40% 18%', transform: 'scale(2.4)', transformOrigin: '40% 20%' } }}
                      />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }} noWrap>
                          Dr. Daniel Carter
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          General Physician
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.secondary' }}>
                        <AccessTime sx={{ fontSize: 16 }} aria-hidden="true" />
                        <Typography variant="caption">Today, 10:30 AM</Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.dark' }}>Confirmed</Typography>
                      </Stack>
                    </Stack>
                    <Button
                      size="small"
                      fullWidth
                      variant="contained"
                      onClick={() => navigate('/login')}
                      sx={{ borderRadius: 999, bgcolor: 'primary.main', color: 'white', backdropFilter: 'none', backgroundImage: 'none', border: 'none', boxShadow: 'none', '&:hover': { bgcolor: 'primary.dark' } }}
                    >
                      Book Appointment
                    </Button>
                  </Stack>
                </FloatingCard>

                {/* Insights */}
                <FloatingCard
                  sx={{
                    bottom: { xs: 16, sm: '6%' },
                    left: { xs: 16, sm: 0 },
                    right: { xs: 16, sm: 'auto' },
                    maxWidth: { sm: 260 },
                    p: 1.5,
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ width: 40, height: 40, flexShrink: 0, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Insights sx={{ fontSize: 20 }} aria-hidden="true" />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        Real-time Patient Insights
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        Records, billing and scheduling in one place
                      </Typography>
                    </Box>
                  </Stack>
                </FloatingCard>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 12, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Stack spacing={6}>
            <Stack alignItems="center" spacing={2}>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 700, fontSize: { xs: '1.875rem', md: '2.25rem' }, color: 'text.primary', textAlign: 'center' }}>
                Comprehensive Healthcare Solutions
              </Typography>
              <Typography variant="h6" component="p" sx={{ color: 'text.secondary', textAlign: 'center', maxWidth: 600 }}>
                Everything you need to manage your healthcare facility efficiently
              </Typography>
            </Stack>

            <Grid
              container
              spacing={4}
              component={motion.div}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer(0.1)}
            >
              {features.map((feature, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                  {/* Entrance stagger via Framer Motion; hover lift comes from
                      MuiCard's own theme-level :hover (see modernTheme.js) —
                      no need to duplicate it here. */}
                  <Card component={motion.div} variants={staggerItem} sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 4, height: '100%' }}>
                      <Box sx={{ width: 64, height: 64, borderRadius: 2, bgcolor: alpha(feature.color, 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                        {React.cloneElement(feature.icon, { sx: { fontSize: 32, color: feature.color } })}
                      </Box>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1.5, color: 'text.primary' }}>{feature.title}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>{feature.description}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 12, background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)' }}>
        <Container maxWidth="md">
          <Stack alignItems="center" spacing={4}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 700, fontSize: { xs: '1.875rem', md: '2.25rem' }, color: 'white', textAlign: 'center' }}>
              Ready to Transform Your Healthcare Management?
            </Typography>
            <Typography variant="h6" component="p" sx={{ color: '#CBD5E1', textAlign: 'center', maxWidth: 600 }}>
              Join thousands of healthcare providers who trust HealthCore for their daily operations
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                bgcolor: 'primary.light',
                color: '#0A2E22',
                px: 6,
                py: 2,
                fontWeight: 700,
                fontSize: '18px',
                backdropFilter: 'none',
                backgroundImage: 'none',
                border: 'none',
                '&:hover': { bgcolor: primary[300] },
              }}
            >
              Get Started Now
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6, bgcolor: 'background.default', borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" useFlexGap spacing={2}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              © 2026 HealthCore. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Button component="a" href="/services" sx={{ color: 'text.secondary' }}>Privacy Policy</Button>
              <Button component="a" href="/services" sx={{ color: 'text.secondary' }}>Terms of Service</Button>
              <Button component="a" href="/contact" sx={{ color: 'text.secondary' }}>Contact</Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
