import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Pagination
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Print as PrintIcon,
  FileDownload as FileDownloadIcon,
  AttachFile as AttachFileIcon,
  InsertDriveFile as FileIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import api from '../../utils/api';
import MedicalRecordForm from './MedicalRecordForm';

const PatientMedicalHistory = ({ patientId, showActions = true }) => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewDialog, setViewDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [documents, setDocuments] = useState({});
  
  const loadMedicalRecords = async () => {
    if (!patientId) {
      setMedicalRecords([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await api.get(`/medical-records/patient/${patientId}/history`);
      setMedicalRecords(response.data);
      setFilteredRecords(response.data);
      
      // Load documents for each record
      const documentPromises = response.data.map(record => 
        api.get(`/medical-documents/medical-record/${record.recordId}`)
          .then(docResponse => ({ recordId: record.recordId, documents: docResponse.data }))
          .catch(() => ({ recordId: record.recordId, documents: [] }))
      );
      
      const documentResults = await Promise.all(documentPromises);
      const documentMap = {};
      documentResults.forEach(result => {
        documentMap[result.recordId] = result.documents;
      });
      setDocuments(documentMap);
    } catch (err) {
      setError('Failed to load medical history');
      console.error('Error loading medical records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicalRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  useEffect(() => {
    // Filter records based on search term
    const filtered = medicalRecords.filter(record =>
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecords(filtered);
    setPage(1); // Reset to first page when searching
  }, [searchTerm, medicalRecords]);

  const formatDateTime = (dateTimeString) => {
    try {
      return format(parseISO(dateTimeString), 'MMM dd, yyyy hh:mm a');
    } catch (error) {
      return dateTimeString;
    }
  };

  const handleMenuOpen = (event, record) => {
    setAnchorEl(event.currentTarget);
    setSelectedRecord(record);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRecord(null);
  };

  const handleView = () => {
    setViewDialog(true);
    handleMenuClose();
  };

  const handleEdit = () => {
    setEditDialog(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (selectedRecord && window.confirm('Are you sure you want to delete this medical record?')) {
      try {
        await api.delete(`/medical-records/${selectedRecord.recordId}`);
        loadMedicalRecords(); // Reload the list
      } catch (err) {
        setError('Failed to delete medical record');
      }
    }
    handleMenuClose();
  };

  const handlePrint = () => {
    // Implement print functionality
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Medical Record - ${selectedRecord.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .section { margin-bottom: 15px; }
            .label { font-weight: bold; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${selectedRecord.title}</h1>
            <p>Date: ${formatDateTime(selectedRecord.recordDate)}</p>
            <p>Doctor: ${selectedRecord.doctorName}</p>
          </div>
          ${selectedRecord.chiefComplaint ? `<div class="section"><div class="label">Chief Complaint:</div><p>${selectedRecord.chiefComplaint}</p></div>` : ''}
          ${selectedRecord.diagnosis ? `<div class="section"><div class="label">Diagnosis:</div><p>${selectedRecord.diagnosis}</p></div>` : ''}
          ${selectedRecord.treatmentPlan ? `<div class="section"><div class="label">Treatment Plan:</div><p>${selectedRecord.treatmentPlan}</p></div>` : ''}
          ${selectedRecord.medications ? `<div class="section"><div class="label">Medications:</div><p>${selectedRecord.medications}</p></div>` : ''}
          ${selectedRecord.followUpInstructions ? `<div class="section"><div class="label">Follow-up Instructions:</div><p>${selectedRecord.followUpInstructions}</p></div>` : ''}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    handleMenuClose();
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleDownloadDocument = async (documentId, fileName) => {
    try {
      const response = await api.get(`/medical-documents/${documentId}/download`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download document');
    }
  };

  // Paginate filtered records
  const startIndex = (page - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const RecordSummaryCard = ({ record }) => (
    <Card sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h3">
            {record.title}
          </Typography>
          {showActions && (
            <IconButton
              size="small"
              onClick={(e) => handleMenuOpen(e, record)}
            >
              <MoreVertIcon />
            </IconButton>
          )}
        </Box>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {formatDateTime(record.recordDate)} • Dr. {record.doctorName}
        </Typography>
        
        {record.diagnosis && (
          <Chip
            label={record.diagnosis}
            variant="outlined"
            size="small"
            sx={{ mb: 1 }}
          />
        )}
        
        {record.chiefComplaint && (
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Chief Complaint:</strong> {record.chiefComplaint}
          </Typography>
        )}
        
        {/* Show document attachments */}
        {documents[record.recordId] && documents[record.recordId].length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <AttachFileIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {documents[record.recordId].length} document{documents[record.recordId].length > 1 ? 's' : ''} attached
            </Typography>
          </Box>
        )}
      </CardContent>
      
      <CardActions>
        <Button
          size="small"
          startIcon={<VisibilityIcon />}
          onClick={() => {
            setSelectedRecord(record);
            setViewDialog(true);
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );

  if (loading) {
    return (
      <Container>
        <Typography>Loading medical history...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1">
            Medical History
          </Typography>
          <TextField
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ minWidth: 300 }}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {filteredRecords.length === 0 && !loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No medical records found
            </Typography>
            {searchTerm && (
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search terms
              </Typography>
            )}
          </Box>
        ) : (
          <>
            {paginatedRecords.map((record) => (
              <RecordSummaryCard key={record.recordId} record={record} />
            ))}
            
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleView}>
            <VisibilityIcon sx={{ mr: 1 }} fontSize="small" />
            View Details
          </MenuItem>
          <MenuItem onClick={handleEdit}>
            <EditIcon sx={{ mr: 1 }} fontSize="small" />
            Edit Record
          </MenuItem>
          <MenuItem onClick={handlePrint}>
            <PrintIcon sx={{ mr: 1 }} fontSize="small" />
            Print Record
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
            Delete Record
          </MenuItem>
        </Menu>

        {/* View Details Dialog */}
        <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            Medical Record Details
            <Typography variant="subtitle2" color="text.secondary">
              {selectedRecord && formatDateTime(selectedRecord.recordDate)}
            </Typography>
          </DialogTitle>
          <DialogContent>
            {selectedRecord && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="primary">Title</Typography>
                  <Typography variant="body2" gutterBottom>{selectedRecord.title}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="primary">Doctor</Typography>
                  <Typography variant="body2" gutterBottom>{selectedRecord.doctorName}</Typography>
                </Grid>
                
                {selectedRecord.chiefComplaint && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" color="primary">Chief Complaint</Typography>
                    <Typography variant="body2" gutterBottom>{selectedRecord.chiefComplaint}</Typography>
                  </Grid>
                )}
                
                {selectedRecord.historyPresentIllness && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" color="primary">History of Present Illness</Typography>
                    <Typography variant="body2" gutterBottom>{selectedRecord.historyPresentIllness}</Typography>
                  </Grid>
                )}
                
                {selectedRecord.physicalExamination && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" color="primary">Physical Examination</Typography>
                    <Typography variant="body2" gutterBottom>{selectedRecord.physicalExamination}</Typography>
                  </Grid>
                )}
                
                {selectedRecord.vitalSigns && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" color="primary">Vital Signs</Typography>
                    <Typography variant="body2" gutterBottom>{selectedRecord.vitalSigns}</Typography>
                  </Grid>
                )}
                
                {selectedRecord.diagnosis && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" color="primary">Diagnosis</Typography>
                    <Typography variant="body2" gutterBottom>{selectedRecord.diagnosis}</Typography>
                  </Grid>
                )}
                
                {selectedRecord.treatmentPlan && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" color="primary">Treatment Plan</Typography>
                    <Typography variant="body2" gutterBottom>{selectedRecord.treatmentPlan}</Typography>
                  </Grid>
                )}
                
                {selectedRecord.medications && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" color="primary">Medications</Typography>
                    <Typography variant="body2" gutterBottom>{selectedRecord.medications}</Typography>
                  </Grid>
                )}
                
                {selectedRecord.labResults && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" color="primary">Lab Results</Typography>
                    <Typography variant="body2" gutterBottom>{selectedRecord.labResults}</Typography>
                  </Grid>
                )}
                
                {selectedRecord.followUpInstructions && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" color="primary">Follow-up Instructions</Typography>
                    <Typography variant="body2" gutterBottom>{selectedRecord.followUpInstructions}</Typography>
                  </Grid>
                )}
                
                {selectedRecord.notes && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" color="primary">Additional Notes</Typography>
                    <Typography variant="body2" gutterBottom>{selectedRecord.notes}</Typography>
                  </Grid>
                )}
                
                {/* Show attached documents */}
                {documents[selectedRecord.recordId] && documents[selectedRecord.recordId].length > 0 && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                      Attached Documents ({documents[selectedRecord.recordId].length})
                    </Typography>
                    {documents[selectedRecord.recordId].map((document) => (
                      <Card key={document.documentId} variant="outlined" sx={{ mb: 1, p: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FileIcon fontSize="small" />
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {document.originalFileName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {document.fileSize ? `${Math.round(document.fileSize / 1024)} KB` : ''} • 
                                Uploaded {new Date(document.uploadedAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                          <Button
                            size="small"
                            startIcon={<FileDownloadIcon />}
                            onClick={() => handleDownloadDocument(document.documentId, document.originalFileName)}
                          >
                            Download
                          </Button>
                        </Box>
                      </Card>
                    ))}
                  </Grid>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialog(false)}>Close</Button>
            <Button onClick={handlePrint} startIcon={<PrintIcon />}>
              Print
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="lg" fullWidth>
          <DialogContent sx={{ p: 0 }}>
            {selectedRecord && (
              <MedicalRecordForm
                existingRecord={selectedRecord}
                onSuccess={() => {
                  setEditDialog(false);
                  loadMedicalRecords();
                }}
                onCancel={() => setEditDialog(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default PatientMedicalHistory;