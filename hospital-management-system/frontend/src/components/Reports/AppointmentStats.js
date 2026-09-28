import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';
import { format, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import api from '../../utils/api';
import { primary, info, warning, error as errorToken } from '../../theme/tokens';

const AppointmentStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('month');

  const COLORS = [primary[500], info.main, warning.main, errorToken.main, primary[300], primary[700]];

  useEffect(() => {
    fetchAppointmentStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const fetchAppointmentStats = async () => {
    try {
      setLoading(true);
      setError('');
      
      let params = {};
      const now = new Date();
      
      switch (dateRange) {
        case 'week':
          params.startDate = format(subDays(now, 7), 'yyyy-MM-dd');
          params.endDate = format(now, 'yyyy-MM-dd');
          break;
        case 'month':
          params.startDate = format(startOfMonth(now), 'yyyy-MM-dd');
          params.endDate = format(endOfMonth(now), 'yyyy-MM-dd');
          break;
        case 'quarter':
          params.startDate = format(subMonths(now, 3), 'yyyy-MM-dd');
          params.endDate = format(now, 'yyyy-MM-dd');
          break;
        case 'year':
          params.startDate = format(subMonths(now, 12), 'yyyy-MM-dd');
          params.endDate = format(now, 'yyyy-MM-dd');
          break;
        default:
          params.startDate = format(startOfMonth(now), 'yyyy-MM-dd');
          params.endDate = format(endOfMonth(now), 'yyyy-MM-dd');
      }

      const response = await api.get('/reports/appointments/stats', { params });
      setStats(response.data);
    } catch (err) {
      setError('Failed to fetch appointment statistics');
    } finally {
      setLoading(false);
    }
  };

  const renderStatCard = (title, value, icon, color = 'primary') => (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" color={color}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ color: `${color}.main` }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No statistics data available
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" color="primary">
          Appointment Statistics
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={dateRange}
              label="Date Range"
              onChange={(e) => setDateRange(e.target.value)}
            >
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="quarter">Last 3 Months</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
            </Select>
          </FormControl>
          
          <Tooltip title="Refresh Data">
            <IconButton onClick={fetchAppointmentStats} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {renderStatCard(
            'Total Appointments',
            stats.totalAppointments || 0,
            <CalendarIcon fontSize="large" />,
            'primary'
          )}
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {renderStatCard(
            'Completed',
            stats.completedAppointments || 0,
            <CheckCircleIcon fontSize="large" />,
            'success'
          )}
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {renderStatCard(
            'Cancelled',
            stats.cancelledAppointments || 0,
            <CancelIcon fontSize="large" />,
            'error'
          )}
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {renderStatCard(
            'No Shows',
            stats.noShowAppointments || 0,
            <ScheduleIcon fontSize="large" />,
            'warning'
          )}
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Appointments by Status Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Appointments by Status
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {stats.statusBreakdown && stats.statusBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.statusBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill={primary[500]}
                    dataKey="count"
                  >
                    {stats.statusBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
                No status breakdown data available
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Appointments by Type Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Appointments by Type
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {stats.typeBreakdown && stats.typeBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.typeBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="count" fill={primary[500]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
                No type breakdown data available
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Daily Appointments Trend */}
        <Grid size={{ xs: 12 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Daily Appointments Trend
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {stats.dailyTrend && stats.dailyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.dailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(new Date(date), 'MMM dd')}
                  />
                  <YAxis />
                  <RechartsTooltip 
                    labelFormatter={(date) => format(new Date(date), 'MMM dd, yyyy')}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke={primary[500]}
                    strokeWidth={2}
                    name="Appointments"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
                No trend data available
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Doctor Performance */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Doctor Performance
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {stats.doctorStats && stats.doctorStats.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Doctor</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="right">Completed</TableCell>
                      <TableCell align="right">Cancelled</TableCell>
                      <TableCell align="right">Completion Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.doctorStats.map((doctor, index) => (
                      <TableRow key={index}>
                        <TableCell>Dr. {doctor.doctorName}</TableCell>
                        <TableCell align="right">{doctor.totalAppointments}</TableCell>
                        <TableCell align="right">{doctor.completedAppointments}</TableCell>
                        <TableCell align="right">{doctor.cancelledAppointments}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${doctor.completionRate}%`}
                            color={doctor.completionRate >= 80 ? 'success' : 
                                   doctor.completionRate >= 60 ? 'warning' : 'error'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
                No doctor performance data available
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Peak Hours */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Peak Hours
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {stats.hourlyStats && stats.hourlyStats.length > 0 ? (
              <Box>
                {stats.hourlyStats.slice(0, 5).map((hour, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        {hour.hour}:00 - {hour.hour + 1}:00
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {hour.count} appointments
                      </Typography>
                    </Box>
                    <Box 
                      sx={{ 
                        height: 6,
                        bgcolor: 'grey.200',
                        borderRadius: 1,
                        overflow: 'hidden'
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          width: `${(hour.count / Math.max(...stats.hourlyStats.map(h => h.count))) * 100}%`,
                          bgcolor: 'primary.main',
                          borderRadius: 1
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography color="textSecondary">
                No hourly data available
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AppointmentStats;