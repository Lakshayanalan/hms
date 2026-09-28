import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Paper,
  useTheme,
  useMediaQuery,
  IconButton,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import PublicNavbar from '../components/Layout/PublicNavbar';
import { fadeSlideUp, staggerContainer, staggerItem } from '../motion/variants';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
  color: 'white',
  padding: theme.spacing(15, 0, 10, 0),
  position: 'relative',
  overflow: 'hidden',
}));

const ContactCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.spacing(2),
}));

const InfoIconWrapper = styled(Box)(({ theme }) => ({
  width: 70,
  height: 70,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
  '& .MuiSvgIcon-root': {
    color: 'white',
    fontSize: '2rem',
  },
}));

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOpenSnackbar(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const contactInfo = [
    { icon: <LocationOnIcon />, title: 'Visit Us', info: '123 Healthcare Street', subInfo: 'Medical District, NY 10001, USA' },
    { icon: <PhoneIcon />, title: 'Call Us', info: '+1 (555) 123-4567', subInfo: 'Mon - Fri: 8AM - 8PM' },
    { icon: <EmailIcon />, title: 'Email Us', info: 'info@healthcore.example', subInfo: 'support@healthcore.example' },
    { icon: <AccessTimeIcon />, title: 'Working Hours', info: 'Mon - Fri: 9:00 AM - 6:00 PM', subInfo: 'Sat - Sun: 10:00 AM - 4:00 PM' },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <PublicNavbar />

      {/* Hero */}
      <HeroSection>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box component={motion.div} initial="hidden" animate="visible" variants={fadeSlideUp} textAlign="center" maxWidth="800px" mx="auto">
            <Typography variant={isMobile ? 'h3' : 'h2'} component="h1" gutterBottom sx={{ fontWeight: 800, lineHeight: 1.2, mb: 3, fontFamily: 'Outfit' }}>
              Get in Touch with Us
            </Typography>
            <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ opacity: 0.9, mb: 2, fontWeight: 400 }}>
              We're Here to Help You 24/7
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: '600px', mx: 'auto' }}>
              Have questions? Need to schedule an appointment? Our dedicated team is ready to assist you.
            </Typography>
          </Box>
        </Container>
      </HeroSection>

      {/* Contact Info Cards */}
      <Container maxWidth="lg" sx={{ mt: -5, mb: 8, position: 'relative', zIndex: 3 }}>
        <Grid
          container
          spacing={3}
          component={motion.div}
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.08, 0.2)}
        >
          {contactInfo.map((info, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <ContactCard component={motion.div} variants={staggerItem} elevation={4}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <InfoIconWrapper>{info.icon}</InfoIconWrapper>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                    {info.title}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main', mb: 0.5 }}>
                    {info.info}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {info.subInfo}
                  </Typography>
                </CardContent>
              </ContactCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Contact Form & Map */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 1, color: 'primary.dark' }}>
                Send Us a Message
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Fill out the form below and we'll get back to you as soon as possible.
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Your Name" name="name" value={formData.name} onChange={handleChange} required variant="outlined" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required variant="outlined" />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} variant="outlined" />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth label="Subject" name="subject" value={formData.subject} onChange={handleChange} required variant="outlined" />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth label="Your Message" name="message" value={formData.message} onChange={handleChange} required multiline rows={6} variant="outlined" />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button type="submit" variant="contained" color="primary" size="large" fullWidth endIcon={<SendIcon />} sx={{ py: 1.8, fontWeight: 700, fontSize: '1.1rem' }}>
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          {/* Map & Social */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  overflow: 'hidden',
                  minHeight: 400,
                  border: '1px solid',
                  borderColor: 'divider',
                  background: (t) => `linear-gradient(135deg, ${t.palette.primary[50]} 0%, ${t.palette.primary[100]} 100%)`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <LocationOnIcon sx={{ fontSize: 80, color: 'primary.main', opacity: 0.6, mb: 2 }} />
                <Typography variant="h5" color="text.secondary" fontWeight={600}>
                  Map Location
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Interactive map will be displayed here
                </Typography>
              </Paper>

              <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                  Connect With Us
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  {[
                    { icon: <FacebookIcon />, color: '#1877F2' },
                    { icon: <TwitterIcon />, color: '#1DA1F2' },
                    { icon: <InstagramIcon />, color: '#E4405F' },
                    { icon: <LinkedInIcon />, color: '#0A66C2' },
                  ].map((social, index) => (
                    <IconButton
                      key={index}
                      aria-label="social link"
                      sx={{
                        bgcolor: social.color,
                        color: 'white',
                        width: 50,
                        height: 50,
                        '&:hover': { bgcolor: social.color, transform: 'translateY(-3px)', boxShadow: 3 },
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  ))}
                </Box>
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 3 }}>
                  Follow us on social media for health tips and updates
                </Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Emergency Contact — red is intentional here: this is the one
          genuinely critical/emergency banner on the site. */}
      <Box sx={{ py: 6, background: (t) => `linear-gradient(135deg, ${t.palette.error.dark} 0%, ${t.palette.error.main} 100%)`, color: 'white' }}>
        <Container maxWidth="lg">
          <Box textAlign="center">
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Medical Emergency?
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
              Call our 24/7 Emergency Hotline
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: 2, mb: 2 }}>
              911 or +1 (555) 999-0000
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.85 }}>
              Our emergency team is always ready to help you
            </Typography>
          </Box>
        </Container>
      </Box>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%', fontWeight: 500 }} elevation={6}>
          Thank you for contacting us! We'll get back to you within 24 hours.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact;
