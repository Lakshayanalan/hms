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
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon
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
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { format, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import api from '../../utils/api';
import { primary, info, warning, error as errorToken } from '../../theme/tokens';

const FinancialReports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('month');

  const COLORS = [primary[500], info.main, warning.main, errorToken.main, primary[300], primary[700]];

  useEffect(() => {
    fetchFinancialReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const fetchFinancialReports = async () => {
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

      const response = await api.get('/reports/financial', { params });
      setReports(response.data);
    } catch (err) {
      setError('Failed to fetch financial reports');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    try {
      // Implementation for exporting financial reports
      console.log('Exporting financial report...');
    } catch (err) {
      console.error('Failed to export report:', err);
    }
  };

  const renderFinancialCard = (title, value, subtitle, icon, color = 'primary') => (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" color={color}>
              ${typeof value === 'number' ? value.toFixed(2) : '0.00'}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="textSecondary">
                {subtitle}
              </Typography>
            )}
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

  if (!reports) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No financial data available
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" color="primary">
          Financial Reports
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
          
          <Tooltip title="Export Report">
            <IconButton onClick={handleExportReport} color="primary">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Refresh Data">
            <IconButton onClick={fetchFinancialReports} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Financial Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {renderFinancialCard(
            'Total Revenue',
            reports.totalRevenue,
            'Invoices issued',
            <MoneyIcon fontSize="large" />,
            'success'
          )}
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {renderFinancialCard(
            'Collected',
            reports.totalCollected,
            'Payments received',
            <AccountBalanceIcon fontSize="large" />,
            'primary'
          )}
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {renderFinancialCard(
            'Outstanding',
            reports.totalOutstanding,
            'Pending payments',
            <WarningIcon fontSize="large" />,
            'warning'
          )}
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {renderFinancialCard(
            'Collection Rate',
            reports.collectionRate,
            '%',
            <TrendingUpIcon fontSize="large" />,
            reports.collectionRate >= 80 ? 'success' : 
            reports.collectionRate >= 60 ? 'warning' : 'error'
          )}
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Revenue vs Collections Chart */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Revenue vs Collections Trend
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {reports.revenueCollectionTrend && reports.revenueCollectionTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={reports.revenueCollectionTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(new Date(date), 'MMM dd')}
                  />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <RechartsTooltip 
                    labelFormatter={(date) => format(new Date(date), 'MMM dd, yyyy')}
                    formatter={(value, name) => [`$${value.toFixed(2)}`, name]}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke={primary[700]}
                    fill={primary[700]}
                    name="Revenue Generated"
                  />
                  <Area
                    type="monotone"
                    dataKey="collections"
                    stackId="2"
                    stroke={primary[400]}
                    fill={primary[400]}
                    name="Collections"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
                No trend data available
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Payment Methods Breakdown */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Payment Methods
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {reports.paymentMethodBreakdown && reports.paymentMethodBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={reports.paymentMethodBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill={primary[500]}
                    dataKey="amount"
                  >
                    {reports.paymentMethodBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
                No payment method data available
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Monthly Revenue Comparison */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Monthly Revenue Comparison
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {reports.monthlyComparison && reports.monthlyComparison.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reports.monthlyComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={(month) => format(new Date(month), 'MMM yyyy')}
                  />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <RechartsTooltip 
                    labelFormatter={(month) => format(new Date(month), 'MMMM yyyy')}
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill={primary[500]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
                No monthly comparison data available
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Outstanding Invoices */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Outstanding Invoices
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {reports.outstandingInvoices && reports.outstandingInvoices.length > 0 ? (
              <TableContainer sx={{ maxHeight: 300 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Invoice #</TableCell>
                      <TableCell>Patient</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Days Overdue</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reports.outstandingInvoices.slice(0, 10).map((invoice, index) => (
                      <TableRow key={index}>
                        <TableCell>{invoice.invoiceNumber}</TableCell>
                        <TableCell>{invoice.patientName}</TableCell>
                        <TableCell align="right">${invoice.amount.toFixed(2)}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${invoice.daysOverdue} days`}
                            color={invoice.daysOverdue > 30 ? 'error' : 
                                   invoice.daysOverdue > 15 ? 'warning' : 'info'}
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
                No outstanding invoices
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Top Revenue Sources */}
        <Grid size={{ xs: 12 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Revenue by Service Type
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {reports.revenueByService && reports.revenueByService.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reports.revenueByService} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `$${value}`} />
                  <YAxis dataKey="serviceType" type="category" width={120} />
                  <RechartsTooltip 
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill={primary[400]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
                No service revenue data available
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Key Financial Metrics */}
        <Grid size={{ xs: 12 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Key Financial Metrics
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary">
                    {reports.averageInvoiceAmount?.toFixed(2) || '0.00'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Avg Invoice Amount
                  </Typography>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="info.main">
                    {reports.averagePaymentTime || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Avg Payment Days
                  </Typography>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="success.main">
                    {reports.totalInvoices || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Invoices
                  </Typography>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="warning.main">
                    {reports.overdueInvoicesCount || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Overdue Invoices
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinancialReports;