const path = require('path');
const { extractTextFromPDF } = require('../services/pdfService');
const { extractTextFromDOCX } = require('../services/docxService');
const { analyzeResume } = require('../services/resumeAnalysis');

async function uploadAndScanResume(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;
  let text;

  try {
    if (path.extname(filePath).toLowerCase() === '.pdf') {
      text = await extractTextFromPDF(filePath);
    } else {
      text = await extractTextFromDOCX(filePath);
    }

    const analysis = analyzeResume(text);

    res.json({
      message: 'Resume uploaded and scanned successfully',
      resumeUrl: `/uploads/${req.file.filename}`,
      analysis: analysis
    });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Error processing file' });
  }
}

module.exports = {
  uploadAndScanResume
};