package com.hospital.management.service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;

import com.hospital.management.entity.Invoice;
import com.hospital.management.entity.InvoiceItem;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;

@Service
public class PdfGenerationService {
    
    /**
     * Generate PDF invoice
     */
    public byte[] generateInvoicePdf(Invoice invoice) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);
            
            // Header
            document.add(new Paragraph("HOSPITAL MANAGEMENT SYSTEM")
                    .setFontSize(20)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBold());
            
            document.add(new Paragraph("INVOICE")
                    .setFontSize(16)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBold());
            
            // Invoice Information
            Table infoTable = new Table(UnitValue.createPercentArray(new float[]{1, 1}));
            infoTable.setWidth(UnitValue.createPercentValue(100));
            
            infoTable.addCell(new Cell().add(new Paragraph("Invoice Number: " + invoice.getInvoiceNumber())));
            infoTable.addCell(new Cell().add(new Paragraph("Invoice Date: " + 
                    invoice.getInvoiceDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))));
            
            infoTable.addCell(new Cell().add(new Paragraph("Patient: " + invoice.getPatient().getFullName())));
            infoTable.addCell(new Cell().add(new Paragraph("Due Date: " + 
                    invoice.getDueDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))));
            
            infoTable.addCell(new Cell().add(new Paragraph("Patient Number: " + invoice.getPatient().getPatientNumber())));
            infoTable.addCell(new Cell().add(new Paragraph("Payment Status: " + invoice.getPaymentStatus())));
            
            // Insurance Information
            if (invoice.getHasInsurance()) {
                infoTable.addCell(new Cell().add(new Paragraph("Insurance Provider: " + 
                        (invoice.getInsuranceProvider() != null ? invoice.getInsuranceProvider() : "N/A"))));
                infoTable.addCell(new Cell().add(new Paragraph("Policy Number: " + 
                        (invoice.getInsurancePolicyNumber() != null ? invoice.getInsurancePolicyNumber() : "N/A"))));
            }
            
            document.add(infoTable);
            document.add(new Paragraph("\n"));
            
            // Items Table
            if (invoice.getInvoiceItems() != null && !invoice.getInvoiceItems().isEmpty()) {
                Table itemsTable = new Table(UnitValue.createPercentArray(new float[]{3, 1, 2, 2, 2, 2}));
                itemsTable.setWidth(UnitValue.createPercentValue(100));
                
                // Headers
                itemsTable.addHeaderCell(new Cell().add(new Paragraph("Description").setBold()));
                itemsTable.addHeaderCell(new Cell().add(new Paragraph("Qty").setBold()));
                itemsTable.addHeaderCell(new Cell().add(new Paragraph("Unit Price").setBold()));
                itemsTable.addHeaderCell(new Cell().add(new Paragraph("Discount").setBold()));
                itemsTable.addHeaderCell(new Cell().add(new Paragraph("Tax").setBold()));
                itemsTable.addHeaderCell(new Cell().add(new Paragraph("Total").setBold()));
                
                // Items
                for (InvoiceItem item : invoice.getInvoiceItems()) {
                    itemsTable.addCell(new Cell().add(new Paragraph(item.getServiceName())));
                    itemsTable.addCell(new Cell().add(new Paragraph(String.valueOf(item.getQuantity()))));
                    itemsTable.addCell(new Cell().add(new Paragraph("$" + item.getUnitPrice().toString())));
                    itemsTable.addCell(new Cell().add(new Paragraph("$" + item.getDiscountAmount().toString())));
                    itemsTable.addCell(new Cell().add(new Paragraph("$" + item.getTaxAmount().toString())));
                    itemsTable.addCell(new Cell().add(new Paragraph("$" + item.getTotalAmount().toString())));
                }
                
                document.add(itemsTable);
            }
            
            document.add(new Paragraph("\n"));
            
            // Totals
            Table totalsTable = new Table(UnitValue.createPercentArray(new float[]{3, 1}));
            totalsTable.setWidth(UnitValue.createPercentValue(50));
            totalsTable.setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.RIGHT);
            
            totalsTable.addCell(new Cell().add(new Paragraph("Subtotal:")));
            totalsTable.addCell(new Cell().add(new Paragraph("$" + invoice.getSubtotal().toString())
                    .setTextAlignment(TextAlignment.RIGHT)));
            
            if (invoice.getDiscountAmount().compareTo(BigDecimal.ZERO) > 0) {
                totalsTable.addCell(new Cell().add(new Paragraph("Discount:")));
                totalsTable.addCell(new Cell().add(new Paragraph("-$" + invoice.getDiscountAmount().toString())
                        .setTextAlignment(TextAlignment.RIGHT)));
            }
            
            if (invoice.getInsuranceCoverageAmount().compareTo(BigDecimal.ZERO) > 0) {
                totalsTable.addCell(new Cell().add(new Paragraph("Insurance Coverage:")));
                totalsTable.addCell(new Cell().add(new Paragraph("-$" + invoice.getInsuranceCoverageAmount().toString())
                        .setTextAlignment(TextAlignment.RIGHT)));
            }
            
            if (invoice.getTaxAmount().compareTo(BigDecimal.ZERO) > 0) {
                totalsTable.addCell(new Cell().add(new Paragraph("Tax:")));
                totalsTable.addCell(new Cell().add(new Paragraph("$" + invoice.getTaxAmount().toString())
                        .setTextAlignment(TextAlignment.RIGHT)));
            }
            
            totalsTable.addCell(new Cell().add(new Paragraph("Total Amount:").setBold()));
            totalsTable.addCell(new Cell().add(new Paragraph("$" + invoice.getTotalAmount().toString()).setBold()
                    .setTextAlignment(TextAlignment.RIGHT)));
            
            document.add(totalsTable);
            
            // Notes
            if (invoice.getNotes() != null && !invoice.getNotes().trim().isEmpty()) {
                document.add(new Paragraph("\n"));
                document.add(new Paragraph("Notes:").setBold());
                document.add(new Paragraph(invoice.getNotes()));
            }
            
            // Footer
            document.add(new Paragraph("\n\nThank you for choosing our hospital services!")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setItalic());
            
            document.close();
            return baos.toByteArray();
            
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF: " + e.getMessage(), e);
        }
    }
}