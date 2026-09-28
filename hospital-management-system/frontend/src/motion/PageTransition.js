import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from './variants';

// Wraps a route's rendered content for a subtle fade/rise on navigation.
// Used once around the router outlet in App.js.
const PageTransition = ({ children }) => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageTransition}
  >
    {children}
  </motion.div>
);

export default PageTransition;
