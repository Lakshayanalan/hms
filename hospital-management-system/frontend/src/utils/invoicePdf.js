// The backend's /invoices/{id}/pdf endpoint doesn't generate real PDFs yet —
// it always returns a "PDF generation not yet implemented" placeholder. Until
// that's built, we generate a print-ready HTML invoice client-side and hand
// it to the browser's native print-to-PDF, which every browser already does
// well. Shared by BillingManagement (staff) and PatientBillingHistory
// (patient) so both produce the same result instead of two separate,
// partially-broken attempts at calling the fake backend endpoint.

const money = (value) => (value || 0).toFixed(2);

export function downloadInvoicePdf(invoice) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Pop-up blocked. Please allow pop-ups for this site to download invoices.');
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #1E293B; }
        .header { text-align: center; margin-bottom: 30px; }
        .invoice-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .details { width: 48%; }
        .items-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .items-table th { background-color: #f2f2f2; }
        .total { text-align: right; margin-top: 20px; font-weight: bold; }
        .status { display: inline-block; padding: 4px 8px; border-radius: 4px; }
        .status.PAID { background-color: #d4edda; color: #155724; }
        .status.PENDING { background-color: #fff3cd; color: #856404; }
        .status.OVERDUE { background-color: #f8d7da; color: #721c24; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>HOSPITAL MANAGEMENT SYSTEM</h1>
        <h2>INVOICE</h2>
      </div>

      <div class="invoice-info">
        <div class="details">
          <h3>Invoice Information</h3>
          <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
          <p><strong>Invoice Date:</strong> ${new Date(invoice.invoiceDate).toLocaleDateString()}</p>
          <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> <span class="status ${invoice.paymentStatus}">${invoice.paymentStatus}</span></p>
        </div>
        <div class="details">
          <h3>Patient Information</h3>
          <p><strong>Patient ID:</strong> ${invoice.patientId || 'N/A'}</p>
          ${invoice.patientName ? `<p><strong>Name:</strong> ${invoice.patientName}</p>` : ''}
        </div>
      </div>

      ${invoice.description ? `
        <div>
          <h3>Description</h3>
          <p>${invoice.description}</p>
        </div>
      ` : ''}

      ${invoice.invoiceItems && invoice.invoiceItems.length > 0 ? `
        <table class="items-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.invoiceItems.map((item) => `
              <tr>
                <td>
                  ${item.serviceName}
                  ${item.serviceCode ? `<br><small>${item.serviceCode}</small>` : ''}
                </td>
                <td>${item.quantity}</td>
                <td>$${money(item.unitPrice)}</td>
                <td>$${money(item.totalAmount)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : ''}

      <div class="total">
        ${invoice.subtotal ? `<p>Subtotal: $${money(invoice.subtotal)}</p>` : ''}
        ${invoice.discountAmount > 0 ? `<p>Discount: -$${money(invoice.discountAmount)}</p>` : ''}
        ${invoice.taxAmount > 0 ? `<p>Tax: $${money(invoice.taxAmount)}</p>` : ''}
        <p style="font-size: 18px; border-top: 2px solid #333; padding-top: 10px;">
          <strong>Total Amount: $${money(invoice.totalAmount)}</strong>
        </p>
      </div>

      ${invoice.notes ? `
        <div style="margin-top: 30px;">
          <h3>Notes</h3>
          <p>${invoice.notes}</p>
        </div>
      ` : ''}

      <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px;">
        <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        <p>For questions about this invoice, please contact the hospital reception.</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  setTimeout(() => {
    printWindow.print();
    setTimeout(() => printWindow.close(), 1000);
  }, 500);
}
