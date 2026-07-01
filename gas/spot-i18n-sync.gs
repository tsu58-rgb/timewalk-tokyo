function ensureSpotI18nRows_(payload) {
  var spotId = String(payload.spotId || '').trim();
  var languages = Array.isArray(payload.languages) ? payload.languages : [];

  if (!spotId) {
    return { ok: false, error: 'spotId is required' };
  }

  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('spot_i18n');
  if (!sheet) {
    return { ok: false, error: 'spot_i18n sheet not found' };
  }

  var lastRow = sheet.getLastRow();
  var existingKeys = {};

  if (lastRow >= 2) {
    var existingValues = sheet.getRange(2, 1, lastRow - 1, 2).getDisplayValues();
    existingValues.forEach(function (row) {
      var existingSpotId = String(row[0] || '').trim();
      var existingLang = String(row[1] || '').trim();
      if (existingSpotId && existingLang) {
        existingKeys[existingSpotId + '\t' + existingLang] = true;
      }
    });
  }

  var rows = [];
  languages.forEach(function (langValue) {
    var lang = String(langValue || '').trim();
    if (!lang || lang === 'ja') return;

    var key = spotId + '\t' + lang;
    if (existingKeys[key]) return;

    rows.push([
      spotId,
      lang,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      ''
    ]);
    existingKeys[key] = true;
  });

  if (rows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 14).setValues(rows);
  }

  return {
    ok: true,
    created: rows.length,
    expected: languages.filter(function (lang) {
      return String(lang || '').trim() && String(lang || '').trim() !== 'ja';
    }).length
  };
}

/*
既存の doPost(e) の action 分岐へ、次を追加してください。

action が ensureSpotI18nRows の場合：

if (data.action === 'ensureSpotI18nRows') {
  return jsonOutput_(ensureSpotI18nRows_(data));
}

jsonOutput_ がない場合は、次を使用できます。

function jsonOutput_(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
*/
