const { fromBuffer } = require('pdf2pic');
const { uploadToS3 } = require('./uploadToS3');

const options = {
  density: 100,
  quality: 95,
  format: 'png',
  width: 1080,
  height: 607,
};

const convertPdfToBase64 = async (pdfBuffer, fileIdentifier) => {
  let pageNumber = 1;
  const slides = [];
  while (true) {
    const val = await fromBuffer(pdfBuffer, options).bulk(pageNumber, true);
    const { base64 } = val[0];
    if (base64.length < 172) {
      break;
    }
    const URL = await uploadToS3({
      content: base64,
      key: `${fileIdentifier}-${pageNumber}`,
    });
    pageNumber++;
    slides.push(URL);
  }
  return { slides };
};

module.exports = { convertPdfToBase64 };
