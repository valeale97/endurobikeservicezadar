/**
 * Enduro Bike Service – contact form helper.
 * 
 */
function doPost(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, note: 'Connect this endpoint to your preferred email sender.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
