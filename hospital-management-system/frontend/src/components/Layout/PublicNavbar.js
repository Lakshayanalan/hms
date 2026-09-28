import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Container,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  PhoneInTalk,
  Login,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { glass } from '../../theme/tokens';
import { fadeSlideUp } from '../../motion/variants';

// Shared brand mark — one image, sized per context, circle-cropped via CSS
// so the source photo's square edges never show.
const Logo = ({ size = 40 }) => (
  <Box
    component="img"
    src="/logo-mark.jpg"
    alt="HealthCore"
    sx={{
      width: size,
      height: size,
      borderRadius: '50%',
      objectFit: 'cover',
      objectPosition: 'center',
      boxShadow: 2,
      flexShrink: 0,
    }}
  />
);

const PublicNavbar = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Features', path: '/services' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'left', width: 280, height: '100%', bgcolor: 'background.paper' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2.5,
          bgcolor: 'background.default',
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Logo size={32} />
          <Typography variant="h6" component="span" sx={{ fontWeight: 700, color: 'text.primary', fontFamily: 'Outfit' }}>
            HealthCore
          </Typography>
        </Stack>
        <IconButton onClick={handleDrawerToggle} size="small" aria-label="Close menu">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ px: 2, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                borderRadius: '8px',
                mb: 0.5,
                minHeight: 44,
                color: isActive(item.path) ? 'primary.main' : 'text.secondary',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive(item.path) ? 700 : 500,
                  fontSize: '1rem',
                  fontFamily: 'Outfit',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ p: 4, position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <Button
          fullWidth
          component={Link}
          to="/login"
          variant="contained"
          color="primary"
          startIcon={<Login />}
          sx={{ py: 1.5, minHeight: 44, fontWeight: 700, fontFamily: 'Outfit' }}
        >
          Portal Login
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: scrolled ? glass.surfaceStrong : 'transparent',
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
          borderBottom: scrolled ? '1px solid' : '1px solid transparent',
          borderColor: 'divider',
          boxShadow: 'none',
          transition: `all ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut}`,
          color: 'text.primary',
        }}
      >
        {/* Top Utility Bar (Desktop Only) */}
        {!isMobile && (
          <Box sx={{ bgcolor: 'text.primary', py: 0.7, px: 4 }}>
            <Container maxWidth="lg">
              <Stack direction="row" justifyContent="flex-end" spacing={4}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PhoneInTalk sx={{ fontSize: 14, color: 'primary.light' }} />
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 500 }}>24/7 Patient Support</Typography>
                </Stack>
                <Typography
                  variant="caption"
                  component={Link}
                  to="/"
                  sx={{ color: 'white', textDecoration: 'none', fontWeight: 500, '&:hover': { color: 'primary.light' } }}
                >
                  Help Center
                </Typography>
              </Stack>
            </Container>
          </Box>
        )}

        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: scrolled ? 64 : 70, transition: `height ${theme.transitions.duration.standard}ms ease` }}>
            {/* Logo */}
            <Box
              component={motion.div}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              sx={{ display: 'inline-flex' }}
            >
              <Box
                component={Link}
                to="/"
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none' }}
              >
                <Logo size={44} />
                <Typography
                  variant="h5"
                  component="span"
                  sx={{
                    fontWeight: 800,
                    color: 'text.primary',
                    fontFamily: 'Outfit',
                    letterSpacing: '-0.5px',
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  HealthCore
                </Typography>
              </Box>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 1 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    sx={{
                      color: isActive(item.path) ? 'primary.main' : 'text.secondary',
                      fontWeight: isActive(item.path) ? 700 : 500,
                      fontFamily: 'Outfit',
                      px: 2.5,
                      py: 1,
                      fontSize: '1rem',
                      '&:hover': { color: 'primary.main', bgcolor: 'action.hover' },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* Action Buttons */}
            {!isMobile && (
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  component={Link}
                  to="/login"
                  variant="text"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    fontFamily: 'Outfit',
                    '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
                  }}
                >
                  Log In
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  sx={{
                    bgcolor: 'text.primary',
                    color: 'white',
                    px: 3,
                    py: 1.2,
                    fontWeight: 700,
                    fontFamily: 'Outfit',
                    backdropFilter: 'none',
                    backgroundImage: 'none',
                    border: 'none',
                    boxShadow: 2,
                    '&:hover': { bgcolor: '#334155', boxShadow: 4 },
                  }}
                >
                  Get Started
                </Button>
              </Stack>
            )}

            {/* Mobile Menu Icon */}
            {isMobile && (
              <IconButton
                onClick={handleDrawerToggle}
                aria-label="Open menu"
                sx={{ ml: 'auto', color: 'text.primary', bgcolor: 'action.hover', borderRadius: '10px', minWidth: 44, minHeight: 44 }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        elevation={0}
        transitionDuration={theme.transitions.duration.standard}
        sx={{ '& .MuiDrawer-paper': { border: 'none', boxShadow: 4, backdropFilter: 'none', backgroundColor: 'background.paper' } }}
      >
        <motion.div initial="hidden" animate="visible" variants={fadeSlideUp} style={{ height: '100%' }}>
          {drawer}
        </motion.div>
      </Drawer>
    </>
  );
};

export default PublicNavbar;
