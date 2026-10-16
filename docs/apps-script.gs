/**
 * First Tick registration handler (Google Apps Script).
 *
 * Appends each registration to a Google Sheet owned by the club and
 * rejects duplicate emails. Deploy as a web app; see
 * docs/registration-setup.md for the exact steps.
 *
 * The website sends the body as text/plain JSON (no CORS preflight).
 * Responses are JSON: { ok: true } or { ok: false, error: '<code>' }.
 * Error codes: 'invalid_json', 'missing_fields', 'invalid_email',
 *              'duplicate', 'server_error'.
 */

var SHEET_NAME = 'Registrations';
var HEADERS = ['Timestamp', 'Full name', 'Email', 'Year', 'Branch', 'WhatsApp', 'Experience'];
var FIELDS = ['fullName', 'email', 'year', 'branch', 'whatsapp', 'experience'];
var MAX_LEN = 200;

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var data;
    try {
      data = JSON.parse((e && e.postData && e.postData.contents) || '');
    } catch (err) {
      return json_({ ok: false, error: 'invalid_json' });
    }

    // Keep only the expected fields, trimmed and length-limited.
    var clean = {};
    for (var i = 0; i < FIELDS.length; i++) {
      var key = FIELDS[i];
      clean[key] = String(data[key] == null ? '' : data[key]).trim().slice(0, MAX_LEN);
      if (!clean[key]) return json_({ ok: false, error: 'missing_fields', field: key });
    }
    clean.email = clean.email.toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean.email)) {
      return json_({ ok: false, error: 'invalid_email' });
    }

    // One writer at a time so two quick submits cannot both pass the duplicate check.
    lock.waitLock(10000);
    var sheet = getSheet_();

    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var emails = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
      for (var r = 0; r < emails.length; r++) {
        if (String(emails[r][0]).trim().toLowerCase() === clean.email) {
          return json_({ ok: false, error: 'duplicate' });
        }
      }
    }

    sheet.appendRow([
      new Date(),
      safe_(clean.fullName),
      safe_(clean.email),
      safe_(clean.year),
      safe_(clean.branch),
      "'" + clean.whatsapp.replace(/[^\d+]/g, ''), // keep as text, keep leading digits
      safe_(clean.experience),
    ]);
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server_error' });
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

/** A GET to the URL just confirms the deployment is alive. */
function doGet() {
  return json_({ ok: true, service: 'first-tick-registration' });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

/** Stops values like "=IMPORTXML(...)" being run as spreadsheet formulas. */
function safe_(v) {
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

/**
 * Apps Script web apps answer cross-origin requests with
 * Access-Control-Allow-Origin: * automatically for ContentService output,
 * so the site can read this JSON after the redirect.
 */
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
