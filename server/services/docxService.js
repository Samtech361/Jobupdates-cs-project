const mammoth = require('mammoth');

async function extractTextFromDOCX(filePath) {
  const result = await mammoth.extractRawText({path: filePath});
  return result.value;
}

module.exports = {
  extractTextFromDOCX
};