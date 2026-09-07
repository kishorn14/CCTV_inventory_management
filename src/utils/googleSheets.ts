/**
 * Google Sheets Integration Utility for Meksha Solutions
 * Sends customer requests directly to the shop's Google Sheet Webhook.
 */

export interface SheetLeadPayload {
  customerName: string;
  phoneNumber: string;
  address?: string;
  category: string;
  serviceType: string;
  preferredTime?: string;
  notes?: string;
  source?: string;
  status?: string;
}

/**
 * Sends customer booking or quotation request to Google Sheets Webhook asynchronously.
 * Uses 'no-cors' mode so it never blocks or fails in browser cross-origin requests.
 */
export async function sendLeadToGoogleSheets(
  webhookUrl: string | undefined,
  data: SheetLeadPayload
): Promise<boolean> {
  if (!webhookUrl || !webhookUrl.trim()) {
    return false;
  }

  try {
    const payload = {
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      customerName: data.customerName || 'N/A',
      phoneNumber: data.phoneNumber || 'N/A',
      address: data.address || 'N/A',
      category: data.category || 'General',
      serviceType: data.serviceType || 'General Inquiry',
      preferredTime: data.preferredTime || 'As soon as possible',
      notes: data.notes || '',
      source: data.source || 'Website Booking Form',
      status: data.status || 'Pending ⏳'
    };

    // Use fetch with text/plain body or standard POST to bypass CORS preflight restrictions on Google Apps Script
    await fetch(webhookUrl.trim(), {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload)
    });

    return true;
  } catch (error) {
    console.warn('Google Sheets logging error (non-fatal):', error);
    return false;
  }
}

/**
 * The exact Google Apps Script code to paste inside Google Sheets:
 * Extensions -> Apps Script -> Paste -> Deploy as Web App.
 */
export const GOOGLE_APPS_SCRIPT_CODE = `// ================================================================
// MEKHA SOLUTIONS - AUTOMATIC CUSTOMER LEAD RECORDER
// Paste this in Google Sheets: Extensions -> Apps Script
// Then click "Deploy" -> "New deployment" -> Select type: "Web app"
// Who has access: "Anyone" -> Click Deploy -> Copy the Web App URL!
// ================================================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Auto create header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Date & Time",
        "Customer Name",
        "Phone / Mobile",
        "Location / Address",
        "Category",
        "Service Requested / Package",
        "Preferred Time Slot",
        "Customer Notes",
        "Source",
        "Status (Attended?)"
      ]);
      
      // Style header row
      var headerRange = sheet.getRange(1, 1, 1, 10);
      headerRange.setBackground("#1e3a8a");
      headerRange.setFontColor("#ffffff");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }
    
    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }
    
    var timestamp = data.timestamp || Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy hh:mm a");
    var customerName = data.customerName || "N/A";
    var phone = data.phoneNumber || "N/A";
    var address = data.address || "N/A";
    var category = data.category || "CCTV";
    var serviceType = data.serviceType || "Service Request";
    var preferredTime = data.preferredTime || "As soon as possible";
    var notes = data.notes || "-";
    var source = data.source || "Website";
    var status = data.status || "Pending ⏳";
    
    // Append the new customer booking row
    sheet.appendRow([
      timestamp,
      customerName,
      "'" + phone, // Prefix with apostrophe to preserve leading zeros
      address,
      category,
      serviceType,
      preferredTime,
      notes,
      source,
      status
    ]);
    
    // Set status dropdown validation for the new row's last column
    var lastRow = sheet.getLastRow();
    var statusCell = sheet.getRange(lastRow, 10);
    var rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Pending ⏳", "Attended / Call Done 📞", "Confirmed / Scheduled 📅", "Work Completed ✅", "Cancelled ❌"], true)
      .build();
    statusCell.setDataValidation(rule);
    
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "row": lastRow }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput("Meksha Solutions Google Sheets Webhook is Active & Ready!")
    .setMimeType(ContentService.MimeType.TEXT);
}
`;
