import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  MenuItem,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  PictureAsPdf as PdfIcon,
  Calculate as CalculateIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import { apiRequest } from '../../utils/api';
import { downloadInvoicePdf } from '../../utils/invoicePdf';

const BillingManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'create', 'edit', 'calculate'
  const [calculationResult, setCalculationResult] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    patientId: '',
    hasInsurance: false,
    insuranceProvider: '',
    insurancePolicyNumber: '',
    items: [],
    notes: ''
  });
  
  const [newItem, setNewItem] = useState({
    serviceId: '',
    serviceName: '',
    serviceCode: '',
    quantity: 1,
    unitPrice: 0,
    discountAmount: 0,
    isInsuranceCovered: false,
    description: ''
  });

  useEffect(() => {
    fetchInvoices();
    fetchPatients();
    fetchServices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await apiRequest('GET', '/invoices');
      if (response.content) {
        setInvoices(response.content);
      } else if (Array.isArray(response)) {
        setInvoices(response);
      }
    } catch (err) {
      setError('Failed to fetch invoices');
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await apiRequest('GET', '/patients');
      setPatients(response.content || response);
    } catch (err) {
      console.error('Failed to fetch patients', err);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await apiRequest('GET', '/services');
      setServices(response.content || response || []);
    } catch (err) {
      console.error('Failed to fetch services', err);
      setError('Failed to load services. Adding items to an invoice is unavailable until this is fixed.');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = () => {
    setDialogType('create');
    setCalculationResult(null);
    setFormData({
      patientId: '',
      hasInsurance: false,
      insuranceProvider: '',
      insurancePolicyNumber: '',
      items: [],
      notes: ''
    });
    setOpenDialog(true);
  };

  const handleCalculateBill = () => {
    setDialogType('calculate');
    setCalculationResult(null);
    setFormData({
      patientId: '',
      hasInsurance: false,
      insuranceProvider: '',
      insurancePolicyNumber: '',
      items: [],
      notes: ''
    });
    setOpenDialog(true);
  };

  const handleAddItem = () => {
    if (newItem.serviceId && newItem.quantity > 0 && newItem.unitPrice > 0) {
      const selectedService = services.find(s => s.serviceId === parseInt(newItem.serviceId));
      const item = {
        ...newItem,
        serviceName: selectedService ? selectedService.serviceName : newItem.serviceName,
        serviceCode: selectedService ? selectedService.serviceCode : newItem.serviceCode,
        unitPrice: selectedService ? selectedService.basePrice : newItem.unitPrice
      };
      
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, item]
      }));
      
      setNewItem({
        serviceId: '',
        serviceName: '',
        serviceCode: '',
        quantity: 1,
        unitPrice: 0,
        discountAmount: 0,
        isInsuranceCovered: false,
        description: ''
      });
    }
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleServiceChange = (serviceId) => {
    const selectedService = services.find(s => s.serviceId === parseInt(serviceId));
    if (selectedService) {
      setNewItem(prev => ({
        ...prev,
        serviceId: serviceId,
        serviceName: selectedService.serviceName,
        serviceCode: selectedService.serviceCode,
        unitPrice: selectedService.basePrice
      }));
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      const subtotal = item.quantity * item.unitPrice;
      const discounted = subtotal - (item.discountAmount || 0);
      const tax = discounted * 0.08; // 8% tax
      return total + discounted + tax;
    }, 0).toFixed(2);
  };

  const submitCalculation = async () => {
    try {
      const response = await apiRequest('POST', '/invoices/calculate', formData);

      if (dialogType === 'calculate') {
        // Just show the calculation result, inline
        setCalculationResult(response);
        return;
      } else {
        // Create the invoice
        await apiRequest('POST', '/invoices', {
          patientId: formData.patientId,
          invoiceDate: new Date().toISOString().split('T')[0],
          subtotal: response.subtotal,
          taxAmount: response.taxAmount,
          discountAmount: response.discountAmount,
          totalAmount: response.totalAmount,
          description: 'Invoice for services',
          notes: formData.notes
        });
        
        fetchInvoices();
      }
      
      setOpenDialog(false);
    } catch (err) {
      setError('Failed to process request: ' + (err.message || 'Unknown error'));
    }
  };

  const updatePaymentStatus = async (invoiceId, status) => {
    try {
      await apiRequest('PUT', `/invoices/${invoiceId}/status?status=${status}`);
      fetchInvoices();
    } catch (err) {
      setError('Failed to update payment status');
    }
  };

  const downloadPdf = (invoice) => {
    try {
      downloadInvoicePdf(invoice);
    } catch (err) {
      setError(err.message || 'Failed to download PDF');
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

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Billing Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<CalculateIcon />}
            onClick={handleCalculateBill}
            sx={{ mr: 2 }}
          >
            Calculate Bill
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateInvoice}
          >
            Create Invoice
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice #</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.invoiceId}>
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.patientName}</TableCell>
                  <TableCell>{new Date(invoice.invoiceDate).toLocaleDateString()}</TableCell>
                  <TableCell>${invoice.totalAmount}</TableCell>
                  <TableCell>
                    <Chip
                      label={invoice.paymentStatus}
                      color={getStatusColor(invoice.paymentStatus)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => downloadPdf(invoice)}
                      color="primary"
                      title="Download PDF"
                    >
                      <PdfIcon />
                    </IconButton>
                    {invoice.paymentStatus === 'PENDING' && (
                      <IconButton
                        onClick={() => updatePaymentStatus(invoice.invoiceId, 'PAID')}
                        color="success"
                        title="Mark as Paid"
                      >
                        <PaymentIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Bill Calculation/Creation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogType === 'calculate' ? 'Calculate Bill' : 'Create Invoice'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Patient Selection */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                select
                label="Patient"
                value={formData.patientId}
                onChange={(e) => setFormData(prev => ({ ...prev, patientId: e.target.value }))}
              >
                {patients.map((patient) => (
                  <MenuItem key={patient.patientId} value={patient.patientId}>
                    {patient.fullName || `${patient.firstName} ${patient.lastName}`} ({patient.patientNumber})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Insurance Information */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.hasInsurance}
                    onChange={(e) => setFormData(prev => ({ ...prev, hasInsurance: e.target.checked }))}
                  />
                }
                label="Has Insurance"
              />
            </Grid>

            {formData.hasInsurance && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Insurance Provider"
                    value={formData.insuranceProvider}
                    onChange={(e) => setFormData(prev => ({ ...prev, insuranceProvider: e.target.value }))}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Policy Number"
                    value={formData.insurancePolicyNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, insurancePolicyNumber: e.target.value }))}
                  />
                </Grid>
              </>
            )}

            {/* Add Service Item */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Add Services</Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    fullWidth
                    select
                    label="Service"
                    value={newItem.serviceId}
                    onChange={(e) => handleServiceChange(e.target.value)}
                  >
                    {services.map((service) => (
                      <MenuItem key={service.serviceId} value={service.serviceId}>
                        {service.serviceName} - ${service.basePrice}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 6, md: 2 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Quantity"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 2 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Unit Price"
                    value={newItem.unitPrice}
                    onChange={(e) => setNewItem(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 2 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Discount"
                    value={newItem.discountAmount}
                    onChange={(e) => setNewItem(prev => ({ ...prev, discountAmount: parseFloat(e.target.value) || 0 }))}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={newItem.isInsuranceCovered}
                        onChange={(e) => setNewItem(prev => ({ ...prev, isInsuranceCovered: e.target.checked }))}
                      />
                    }
                    label="Insurance Covered"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 1 }}>
                  <Button
                    variant="contained"
                    onClick={handleAddItem}
                    disabled={!newItem.serviceId || newItem.quantity < 1}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            {/* Items Table */}
            {formData.items.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>Items</Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Service</TableCell>
                        <TableCell>Qty</TableCell>
                        <TableCell>Unit Price</TableCell>
                        <TableCell>Discount</TableCell>
                        <TableCell>Insurance</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.items.map((item, index) => {
                        const subtotal = item.quantity * item.unitPrice;
                        const discounted = subtotal - (item.discountAmount || 0);
                        const tax = discounted * 0.08;
                        const total = discounted + tax;
                        
                        return (
                          <TableRow key={index}>
                            <TableCell>{item.serviceName}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>${item.unitPrice}</TableCell>
                            <TableCell>${item.discountAmount || 0}</TableCell>
                            <TableCell>
                              <Chip
                                label={item.isInsuranceCovered ? 'Yes' : 'No'}
                                color={item.isInsuranceCovered ? 'success' : 'default'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>${total.toFixed(2)}</TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() => handleRemoveItem(index)}
                                color="error"
                                size="small"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Box sx={{ mt: 2, textAlign: 'right' }}>
                  <Typography variant="h6">
                    Total: ${calculateTotal()}
                  </Typography>
                </Box>
              </Grid>
            )}

            {/* Notes */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </Grid>

            {dialogType === 'calculate' && calculationResult && (
              <Grid size={{ xs: 12 }}>
                <Alert severity="success" sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    Subtotal: ${calculationResult.subtotal} &nbsp;|&nbsp;
                    Tax: ${calculationResult.taxAmount} &nbsp;|&nbsp;
                    Discount: ${calculationResult.discountAmount}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 0.5 }}>
                    Total: ${calculationResult.totalAmount}
                  </Typography>
                </Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={submitCalculation}
            disabled={!formData.patientId || formData.items.length === 0}
          >
            {dialogType === 'calculate' ? 'Calculate' : 'Create Invoice'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BillingManagement;