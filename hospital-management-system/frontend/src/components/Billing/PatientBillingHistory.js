import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Alert,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  Visibility as ViewIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { apiRequest } from '../../utils/api';
import { downloadInvoicePdf } from '../../utils/invoicePdf';

const PatientBillingHistory = ({ patientId, showTitle = true }) => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Always fetch invoices for the current logged-in user (patient)
    // The /my-invoices endpoint handles patient authorization properly
    fetchMyInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const fetchMyInvoices = async () => {
    try {
      const response = await apiRequest('GET', '/invoices/my-invoices');
      setInvoices(Array.isArray(response) ? response : []);
    } catch (err) {
      setError('Failed to fetch your billing history');
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoiceDetails = async (invoiceId) => {
    try {
      const response = await apiRequest('GET', `/invoices/${invoiceId}`);
      setSelectedInvoice(response);
      setDetailsDialog(true);
    } catch (err) {
      setError('Failed to fetch invoice details');
    }
  };

  const downloadPdf = (invoice) => {
    try {
      downloadInvoicePdf(invoice);
    } catch (err) {
      setError(err.message || 'Failed to generate invoice. Please try again or contact support.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID': return 'success';
      case 'PENDING': return 'warning';
      case 'OVERDUE': return 'error';
      default: return 'default';
    }
  };

  const calculateTotalOwed = () => {
    return invoices
      .filter(invoice => invoice.paymentStatus !== 'PAID')
      .reduce((total, invoice) => total + (invoice.totalAmount || 0), 0);
  };

  const calculateTotalPaid = () => {
    return invoices
      .filter(invoice => invoice.paymentStatus === 'PAID')
      .reduce((total, invoice) => total + (invoice.totalAmount || 0), 0);
  };

  if (loading) return <Typography>Loading billing history...</Typography>;

  return (
    <Box>
      {showTitle && (
        <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
          Billing History
        </Typography>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ReceiptIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Invoices</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {invoices.length}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                All medical invoices
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PaymentIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Paid</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                ${calculateTotalPaid().toFixed(2)}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Completed payments
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ReceiptIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Amount Owed</Typography>
              </Box>
              <Typography variant="h4" color="error.main">
                ${calculateTotalOwed().toFixed(2)}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Pending payments
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <HistoryIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Latest Invoice</Typography>
              </Box>
              <Typography variant="h6" color="info.main">
                {invoices.length > 0 
                  ? new Date(Math.max(...invoices.map(inv => new Date(inv.invoiceDate)))).toLocaleDateString()
                  : 'None'
                }
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Most recent billing
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Invoices Table */}
      {invoices.length > 0 ? (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Invoice #</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.invoiceId}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {invoice.invoiceNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(invoice.invoiceDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {invoice.description || 'Medical Services'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        ${invoice.totalAmount?.toFixed(2) || '0.00'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={invoice.paymentStatus}
                        color={getStatusColor(invoice.paymentStatus)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => fetchInvoiceDetails(invoice.invoiceId)}
                        color="primary"
                        title="View Details"
                        size="small"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => downloadPdf(invoice)}
                        color="secondary"
                        title="Download PDF"
                        size="small"
                      >
                        <PdfIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            No billing history found.
          </Typography>
        </Paper>
      )}

      {/* Invoice Details Dialog */}
      <Dialog
        open={detailsDialog}
        onClose={() => setDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Invoice Details - {selectedInvoice?.invoiceNumber}
        </DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2">
                    <strong>Invoice Date:</strong> {new Date(selectedInvoice.invoiceDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Due Date:</strong> {new Date(selectedInvoice.dueDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" component="div">
                    <strong>Status:</strong>{' '}
                    <Chip
                      label={selectedInvoice.paymentStatus}
                      color={getStatusColor(selectedInvoice.paymentStatus)}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2">
                    <strong>Subtotal:</strong> ${selectedInvoice.subtotal?.toFixed(2) || '0.00'}
                  </Typography>
                  {selectedInvoice.discountAmount > 0 && (
                    <Typography variant="body2">
                      <strong>Discount:</strong> -${selectedInvoice.discountAmount?.toFixed(2) || '0.00'}
                    </Typography>
                  )}
                  {selectedInvoice.taxAmount > 0 && (
                    <Typography variant="body2">
                      <strong>Tax:</strong> ${selectedInvoice.taxAmount?.toFixed(2) || '0.00'}
                    </Typography>
                  )}
                  <Typography variant="body2">
                    <strong>Total:</strong> ${selectedInvoice.totalAmount?.toFixed(2) || '0.00'}
                  </Typography>
                </Grid>
              </Grid>

              {selectedInvoice.description && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Description:</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {selectedInvoice.description}
                  </Typography>
                </Box>
              )}

              {selectedInvoice.notes && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Notes:</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {selectedInvoice.notes}
                  </Typography>
                </Box>
              )}

              {selectedInvoice.invoiceItems && selectedInvoice.invoiceItems.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Services</Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Service</TableCell>
                          <TableCell>Qty</TableCell>
                          <TableCell align="right">Unit Price</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedInvoice.invoiceItems.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Typography variant="body2">
                                {item.serviceName}
                              </Typography>
                              {item.serviceCode && (
                                <Typography variant="caption" color="textSecondary">
                                  {item.serviceCode}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell align="right">
                              ${item.unitPrice?.toFixed(2) || '0.00'}
                            </TableCell>
                            <TableCell align="right">
                              ${item.totalAmount?.toFixed(2) || '0.00'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialog(false)}>
            Close
          </Button>
          {selectedInvoice && (
            <Button
              variant="outlined"
              startIcon={<PdfIcon />}
              onClick={() => downloadPdf(selectedInvoice)}
            >
              Download PDF
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientBillingHistory;