const pdfjs = require('pdfjs-dist/legacy/build/pdf.min');

const { createCanvas } = require('canvas');
const { uploadToS3 } = require('./uploadToS3');
const { getPage } = require('./utils');

const options = {
  density: 100,
  quality: 95,
  format: 'png',
  width: 1080,
  height: 607,
};

const convertPdfToBase64 = async (pdfBuffer, fileIdentifier) => {
  const slides = [];

  const pdf = await pdfjs.getDocument(pdfBuffer).promise;
  const numOfPages = pdf.numPages || 0;

  console.log(`Uploading PDF ${fileIdentifier} ~ pages ${numOfPages}`);

  if (numOfPages === 0) {
    throw Error('0 slides found');
  }

  for (let pageNumber = 1; pageNumber <= numOfPages; pageNumber++) {
    const page = await getPage(pdf, pageNumber);
    const viewport = page.getViewport({
      scale: 1.5,
      dontFlip: false,
    });
    const canvas = createCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext('2d');
    await page.render({
      canvasContext: ctx,
      viewport,
    }).promise;

    const dataURL = canvas.toDataURL();
    const URL = await uploadToS3({
      content: dataURL,
      key: `${fileIdentifier}-${pageNumber}`,
    });
    slides.push(URL);
  }

  return { slides };
};

module.exports = { convertPdfToBase64 };
