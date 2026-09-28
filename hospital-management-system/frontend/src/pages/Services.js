import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  alpha,
  Stack,
  Button,
} from '@mui/material';
import {
  MonitorHeart,
  Security,
  Assignment,
  NotificationsActive,
  Group,
  VpnKey,
  SupportAgent,
  ArrowForward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import PublicNavbar from '../components/Layout/PublicNavbar';
import { primary } from '../theme/tokens';
import { fadeSlideUp, staggerContainer, staggerItem } from '../motion/variants';

const Services = () => {
  const services = [
    { icon: <Assignment />, title: 'Shift Management', description: 'Organize shifts, view availability, and fill gaps in the schedule in seconds.' },
    { icon: <MonitorHeart />, title: 'Real-Time Monitoring', description: 'Track who is currently on duty and receive instant alerts for absences or delays.' },
    { icon: <Security />, title: 'Security & Compliance', description: 'Full compliance with data protection laws and secure workflows for document exchange.' },
    { icon: <Assignment />, title: 'Smart Reporting', description: 'Productivity KPIs, costs, and coverage reports for data-driven decision making.' },
    { icon: <NotificationsActive />, title: 'Intelligent Alerts', description: 'Push and SMS notifications to ensure no shift is forgotten or left vacant.' },
    { icon: <Group />, title: 'Talent Pool', description: 'Access to thousands of qualified and verified doctors ready to take on new demands.' },
    { icon: <VpnKey />, title: 'Robust Authentication', description: 'Granular access control based on profiles (Manager, Doctor, Clinical Director).' },
    { icon: <SupportAgent />, title: '24/7 Support', description: 'Our Customer Success team is ready to assist hospitals and doctors at any time.' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.paper' }}>
      <PublicNavbar />

      {/* Header */}
      <Box
        sx={{
          position: 'relative',
          pt: { xs: 20, md: 25 },
          pb: { xs: 10, md: 15 },
          background: `linear-gradient(180deg, ${alpha(primary[500], 0.08)} 0%, rgba(255,255,255,1) 100%)`,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: '-10%', right: '-10%', width: '40%', height: '60%', bgcolor: alpha(primary[500], 0.1), borderRadius: '40% 60% 70% 30% / 40% 40% 60% 60%', zIndex: 0, filter: 'blur(50px)' }} />
        <Box sx={{ position: 'absolute', bottom: '10%', left: '-5%', width: '30%', height: '40%', bgcolor: alpha(primary[500], 0.05), borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', zIndex: 0, filter: 'blur(40px)' }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Box component={motion.div} initial="hidden" animate="visible" variants={fadeSlideUp}>
            <Typography variant="h1" sx={{ fontWeight: 800, mb: 3, fontSize: { xs: '2.5rem', md: '4rem' }, color: 'text.primary', fontFamily: 'Outfit', lineHeight: 1.1 }}>
              Powerful <Box component="span" sx={{ color: 'primary.main' }}>Features</Box> for <br />
              Modern Healthcare
            </Typography>
            <Typography variant="h5" sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto', fontWeight: 400, lineHeight: 1.6, mb: 4 }}>
              Everything you need to manage medical shifts, track productivity, and ensure
              seamless communication between hospitals and doctors.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Features Grid */}
      <Box sx={{ py: { xs: 10, md: 15 }, bgcolor: 'background.paper', position: 'relative' }}>
        <Container maxWidth="lg">
          <Grid
            container
            spacing={4}
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer(0.08)}
          >
            {services.map((service, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Card
                  component={motion.div}
                  variants={staggerItem}
                  sx={{
                    height: '100%',
                    borderRadius: '24px',
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      borderColor: 'primary.main',
                      '& .icon-box': { bgcolor: 'primary.main', color: 'white', transform: 'scale(1.1) rotate(5deg)' },
                    },
                  }}
                >
                  <CardContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Box
                      className="icon-box"
                      sx={{ width: 60, height: 60, borderRadius: '16px', bgcolor: alpha(primary[500], 0.1), color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, transition: 'all 0.2s ease' }}
                    >
                      {React.cloneElement(service.icon, { sx: { fontSize: 32 } })}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: 'text.primary', fontFamily: 'Outfit', fontSize: '1.25rem' }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, fontSize: '0.95rem' }}>
                      {service.description}
                    </Typography>

                    <Box sx={{ mt: 'auto', pt: 3 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'primary.main', cursor: 'pointer', opacity: 0.85, '&:hover': { opacity: 1 } }}>
                        <Typography variant="button" sx={{ fontWeight: 700, fontSize: '0.75rem', fontFamily: 'Outfit' }}>Learn More</Typography>
                        <ArrowForward sx={{ fontSize: 14 }} />
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Integration/Productivity Section */}
      <Box sx={{ py: { xs: 10, md: 15 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center" justifyContent="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h2" fontWeight={800} color="text.primary" mb={3} sx={{ fontFamily: 'Outfit' }}>
                Seamless Integration with your Workflow
              </Typography>
              <Typography color="text.secondary" fontSize="1.1rem" mb={4}>
                HealthCore isn't just a tool; it's a productivity multiplier. Our platform
                integrates with your existing hospital ERP to provide real-time updates without
                disrupting your daily routine.
              </Typography>
              <Stack
                spacing={2}
                component={motion.div}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={staggerContainer(0.08)}
              >
                {[
                  'Auto-sync with hospital calendars',
                  'Real-time payroll data generation',
                  'One-click shift replacements',
                  'Global compliance monitoring',
                ].map((text, i) => (
                  <Stack component={motion.div} variants={staggerItem} direction="row" spacing={2} key={i} alignItems="center">
                    <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Typography color="white" fontWeight={700} fontSize="0.75rem">✓</Typography>
                    </Box>
                    <Typography color="text.primary" fontWeight={500}>{text}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: '24px', boxShadow: 3, border: '1px solid', borderColor: 'divider', position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', bgcolor: 'primary.main' }} />
                <Typography variant="h6" fontWeight={800} mb={3} color="text.primary">Platform Analytics</Typography>
                <Stack spacing={3}>
                  {[85, 92, 78].map((val, i) => (
                    <Box key={i}>
                      <Stack direction="row" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color="text.secondary">{['Shift Coverage', 'User Satisfaction', 'Response Time'][i]}</Typography>
                        <Typography variant="body2" fontWeight={700} color="primary.main">{val}%</Typography>
                      </Stack>
                      <Box sx={{ width: '100%', height: 8, bgcolor: 'primary.50', borderRadius: 4 }}>
                        <Box
                          component={motion.div}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${val}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                          sx={{ height: '100%', bgcolor: 'primary.main', borderRadius: 4 }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ p: { xs: 6, md: 10 }, borderRadius: '32px', background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', color: 'white', position: 'relative', overflow: 'hidden', textAlign: 'center', boxShadow: 4 }}>
            <Box sx={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: '50%', background: alpha(primary[400], 0.2), filter: 'blur(100px)' }} />

            <Typography variant="h3" fontWeight={800} mb={3} sx={{ fontFamily: 'Outfit', fontSize: { xs: '2rem', md: '3rem' } }}>
              Ready to Upgrade your <br /> <Box component="span" sx={{ color: 'primary.light' }}>Medical Operations?</Box>
            </Typography>
            <Typography variant="h6" mb={5} sx={{ opacity: 0.8, maxWidth: 700, mx: 'auto', fontWeight: 400 }}>
              Join the growing network of hospitals and doctors who have optimized their
              entire shift management lifecycle with HealthCore.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                sx={{ bgcolor: 'primary.light', color: '#0A2E22', py: 2, px: 6, borderRadius: '100px', fontWeight: 800, fontSize: '1rem', backdropFilter: 'none', backgroundImage: 'none', border: 'none', '&:hover': { bgcolor: primary[300] } }}
              >
                Schedule Demo
              </Button>
              <Button
                variant="outlined"
                sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', py: 2, px: 6, borderRadius: '100px', fontWeight: 800, fontSize: '1rem', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' } }}
              >
                Talk to Sales
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6, textAlign: 'center', bgcolor: 'background.default', borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography color="text.disabled" variant="body2">© {new Date().getFullYear()} HealthCore. All rights reserved.</Typography>
      </Box>
    </Box>
  );
};

export default Services;
