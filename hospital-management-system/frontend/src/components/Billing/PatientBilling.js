import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  History as HistoryIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import PatientBillingHistory from './PatientBillingHistory';
import { apiRequest } from '../../utils/api';

const PatientBilling = () => {
  const [paymentHistoryDialog, setPaymentHistoryDialog] = useState(false);
  const [pdfHelperDialog, setPdfHelperDialog] = useState(false);
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [paymentsError, setPaymentsError] = useState('');

  const openPaymentHistory = async () => {
    setPaymentHistoryDialog(true);
    setLoadingPayments(true);
    setPaymentsError('');
    try {
      const response = await apiRequest('GET', '/payments/my-history');
      setPayments(Array.isArray(response) ? response : []);
    } catch (err) {
      setPaymentsError('Failed to load payment history.');
    } finally {
      setLoadingPayments(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        My Bills & Invoices
      </Typography>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center', pb: 1 }}>
              <ReceiptIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h6" component="h2">
                View Invoices
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Access all your medical invoices
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pt: 0 }}>
              <Button size="small" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>
                View All
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center', pb: 1 }}>
              <PaymentIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h6" component="h2">
                Payment History
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Track your payment records
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pt: 0 }}>
              <Button size="small" onClick={openPaymentHistory}>
                View Payments
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center', pb: 1 }}>
              <PdfIcon color="secondary" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h6" component="h2">
                Download Receipts
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Get PDF copies of invoices
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pt: 0 }}>
              <Button size="small" onClick={() => setPdfHelperDialog(true)}>
                Download PDFs
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center', pb: 1 }}>
              <HistoryIcon color="info" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h6" component="h2">
                Billing History
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Complete billing timeline
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pt: 0 }}>
              <Button size="small" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>
                View History
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Billing History */}
      <PatientBillingHistory showTitle={false} />

      {/* Payment History Dialog */}
      <Dialog open={paymentHistoryDialog} onClose={() => setPaymentHistoryDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Payment History</DialogTitle>
        <DialogContent>
          {loadingPayments ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : paymentsError ? (
            <Typography color="error">{paymentsError}</Typography>
          ) : payments.length === 0 ? (
            <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
              No payments recorded yet.
            </Typography>
          ) : (
            <List>
              {payments.map((payment, idx) => (
                <React.Fragment key={payment.paymentId}>
                  <ListItem
                    secondaryAction={
                      <Chip label={payment.paymentMethod?.replace('_', ' ')} size="small" variant="outlined" />
                    }
                  >
                    <ListItemText
                      primary={`$${payment.amount?.toFixed(2)} — Invoice ${payment.invoiceNumber}`}
                      secondary={`${new Date(payment.paymentDate).toLocaleString()}${payment.referenceNumber ? ` • Ref: ${payment.referenceNumber}` : ''}`}
                    />
                  </ListItem>
                  {idx < payments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentHistoryDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* PDF Helper Dialog */}
      <Dialog open={pdfHelperDialog} onClose={() => setPdfHelperDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Download Invoice PDFs</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            To download PDF copies of your invoices and receipts:
          </Typography>
          <Typography variant="body2" component="div" sx={{ mb: 2 }}>
            1. Find the invoice in your billing history below<br />
            2. Click the <PdfIcon sx={{ fontSize: 16, verticalAlign: 'middle' }} /> PDF icon next to the invoice<br />
            3. A print-ready invoice opens in a new tab — use your browser's print dialog to save it as a PDF
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <strong>Note:</strong> If pop-ups are blocked, allow them for this site and try again.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPdfHelperDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientBilling;