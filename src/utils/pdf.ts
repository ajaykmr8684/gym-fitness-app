// Professional invoice generation utility - compact one-page PDF
const BUSINESS_NAME = 'Shree Ram Fitness Centre';
const BUSINESS_ADDRESS = 'Hanuman Chowk, Opposite Degree College Hamirpur, Anu';
const BUSINESS_PHONE = '+91-8580521298';
const BUSINESS_EMAIL = 'shreeramfitnesshamirpur@gmail.com';

// Create compact PDF content
function createPDFContent(bill: any, member: any): string {
  // Ensure all values have defaults and proper formatting
  const billId = bill?.id?.substring(0, 10)?.toUpperCase() || 'INV-0000';
  const billingDate = bill?.billingDate || new Date().toISOString().split('T')[0];
  const dueDate = bill?.dueDate || billingDate;
  const status = bill?.status || 'pending';
  
  // Fix issue: use proper baseAmount fallback
  const baseAmount = typeof bill?.baseAmount === 'number' && bill.baseAmount > 0 ? bill.baseAmount : (bill?.amount || 0);
  const finalAmount = bill?.amount || baseAmount;
  const amountPaid = bill?.amountPaid || 0;
  const dueAmount = Math.max(0, finalAmount - amountPaid);
  const discount = Math.max(0, baseAmount - finalAmount);
  const discountPercent = member?.discountPercentage || (discount > 0 ? Math.round((discount / baseAmount) * 100) : 0);

  const planLabel = bill?.planType === 'quarterly' ? 'Quarterly (3m)' 
                   : bill?.planType === 'halfyear' ? 'Half Year (6m)'
                   : bill?.planType === 'annual' ? 'Annual (12m)'
                   : 'Monthly';
  
  const features = [];
  if (member?.strength) features.push('Strength');
  if (member?.cardio) features.push('Cardio');
  if (member?.training) features.push('Training');
  const featuresText = features.length > 0 ? features.join(' + ') : 'Basic';

  const statusColor = status === 'paid' ? '#10b981' : status === 'overdue' ? '#f97316' : '#0ea5e9';
  const expiryDate = member?.expiryDate || 'N/A';

  // Create compact HTML that fits on one A4 page
  const html = `
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; background: white; }
          .container { width: 100%; max-width: 800px; margin: 0 auto; background: white; padding: 20px; }
          .header { background: #0f172a; color: white; padding: 15px 20px; margin: -20px -20px 15px -20px; border-bottom: 3px solid #0ea5e9; }
          .company-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
          .company-info { font-size: 10px; color: #cbd5e1; line-height: 1.3; }
          .row { display: flex; justify-content: space-between; margin-bottom: 12px; }
          .col-left { flex: 1; }
          .col-right { flex: 1; text-align: right; padding-right: 20px; }
          .invoice-title { font-size: 20px; font-weight: bold; color: #0ea5e9; }
          .label { font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; }
          .value { font-size: 11px; font-weight: bold; color: #1e293b; margin-top: 2px; }
          .section { margin-bottom: 12px; padding: 10px; background: #f8fafc; border-radius: 4px; }
          .section-title { font-size: 10px; font-weight: bold; color: #1e293b; margin-bottom: 6px; text-transform: uppercase; }
          .customer-name { font-size: 12px; font-weight: bold; color: #1e293b; margin-bottom: 4px; }
          .customer-info { font-size: 10px; color: #64748b; line-height: 1.4; }
          .table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 10px; }
          .table th { background: #0f172a; color: white; padding: 8px 6px; text-align: left; font-weight: bold; }
          .table td { padding: 7px 6px; border-bottom: 1px solid #e2e8f0; }
          .table tr:last-child td { border-bottom: none; }
          .table .amount { text-align: right; font-weight: bold; }
          .table .description { text-align: left; }
          .summary-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 10px; border-bottom: 1px solid #e2e8f0; }
          .summary-row.total { border-bottom: none; font-weight: bold; font-size: 12px; padding: 8px 0; }
          .summary-row.paid { color: #10b981; font-weight: 600; }
          .summary-row.due { color: #f97316; font-weight: bold; font-size: 12px; padding: 8px 0; }
          .summary-row .label { font-weight: 600; color: #1e293b; }
          .summary-row .value { font-weight: bold; color: #0ea5e9; }
          .status-badge { display: inline-block; background: ${statusColor}; color: white; padding: 4px 10px; border-radius: 3px; font-weight: bold; font-size: 9px; margin-bottom: 8px; }
          .footer { margin-top: 10px; padding-top: 8px; border-top: 1px solid #e2e8f0; font-size: 9px; color: #94a3b8; text-align: center; line-height: 1.5; }
          @media print {
            body { margin: 0; padding: 0; }
            .container { max-width: 100%; padding: 15px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <div class="company-name">${BUSINESS_NAME}</div>
            <div class="company-info">
              ${BUSINESS_ADDRESS} | Phone: ${BUSINESS_PHONE} | Email: ${BUSINESS_EMAIL}
            </div>
          </div>

          <!-- Invoice Details Row -->
          <div class="row" style="margin-bottom: 15px;">
            <div class="col-left">
              <div class="invoice-title">INVOICE</div>
            </div>
            <div class="col-right" style="text-align: right;">
              <div class="label">Invoice #</div>
              <div class="value">${billId}</div>
              <div class="label" style="margin-top: 4px;">Date</div>
              <div class="value">${billingDate}</div>
              <div class="label" style="margin-top: 4px;">Due</div>
              <div class="value">${dueDate}</div>
            </div>
          </div>

          <!-- Bill To & Membership -->
          <div class="row">
            <div class="col-left">
              <div class="section">
                <div class="section-title">Bill To:</div>
                <div class="customer-name">${member?.name || 'Customer'}</div>
                <div class="customer-info">
                  Email: ${member?.email || 'N/A'}<br>
                  Phone: ${member?.phone || 'N/A'}
                </div>
              </div>
            </div>
            <div class="col-right" style="text-align: left;">
              <div class="section">
                <div class="section-title">Membership:</div>
                <div class="customer-info" style="font-weight: 600; color: #1e293b; margin-bottom: 3px;">${planLabel}</div>
                <div class="customer-info">${featuresText}</div>
                <div class="customer-info" style="margin-top: 3px;">Expiry: ${expiryDate}</div>
              </div>
            </div>
          </div>

          <!-- Items -->
          <table class="table">
            <thead>
              <tr>
                <th class="description">Description</th>
                <th class="description">Details</th>
                <th style="text-align: center; width: 60px;">Duration</th>
                <th style="text-align: right; width: 60px;">Rate</th>
                <th class="amount" style="width: 60px;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="description">Gym Membership</td>
                <td class="description">${bill?.notes || 'N/A'}</td>
                <td style="text-align: center;">
                  ${bill?.planType === 'quarterly' ? '3m' : bill?.planType === 'halfyear' ? '6m' : bill?.planType === 'annual' ? '12m' : '1m'}
                </td>
                <td style="text-align: right;">₹${baseAmount}</td>
                <td class="amount">₹${baseAmount}</td>
              </tr>
              ${discount > 0 ? `<tr style="background: #f0fdf4;">
                <td class="description">Discount (${discountPercent}%)</td>
                <td colspan="2" style="text-align: right;"></td>
                <td class="amount" style="color: #10b981;">-₹${discount}</td>
              </tr>` : ''}
            </tbody>
          </table>

          <!-- Summary -->
          <div style="background: #f0f9ff; padding: 10px; border-radius: 4px; margin-bottom: 10px;">
            <div class="summary-row total">
              <div class="label">SUBTOTAL</div>
              <div class="value">₹${finalAmount}</div>
            </div>
            <div class="summary-row paid">
              <div class="label">Paid</div>
              <div class="value" style="color: #10b981;">₹${amountPaid}</div>
            </div>
            <div class="summary-row due">
              <div class="label">DUE</div>
              <div class="value" style="font-size: 14px;">₹${dueAmount}</div>
            </div>
          </div>

          <!-- Status -->
          <div class="status-badge">● ${status.toUpperCase()}</div>

          <!-- Footer -->
          <div class="footer">
            Thank you for your membership!<br>
            For inquiries: ${BUSINESS_EMAIL} | ${BUSINESS_PHONE}
          </div>
        </div>
      </body>
    </html>
  `;

  return html;
}

export const generateBillPDF = (bill: any, member: any) => {
  try {
    const htmlContent = createPDFContent(bill, member);
    
    // Create a new window with the HTML
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error('Could not open print window');
      return;
    }

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load, then trigger PDF print
    setTimeout(() => {
      printWindow.print();
      // After print dialog, close the window
      printWindow.onafterprint = () => {
        printWindow.close();
      };
      // Fallback close after a delay if onafterprint doesn't work
      setTimeout(() => {
        if (!printWindow.closed) {
          printWindow.close();
        }
      }, 2000);
    }, 500);
  } catch (error) {
    console.error('Error generating invoice:', error);
    alert('Error generating invoice. Please try again.');
  }
};


