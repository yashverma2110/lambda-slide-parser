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
  let uploadToS3Array = [];
  let slides = [];
  let pageNumber = 1;

  while (true) {
    const parsedSlide = await fromBuffer(pdfBuffer, options).bulk(
      pageNumber,
      true
    );

    const { base64, page } = parsedSlide[0];

    console.log('Parsed slide ~', page, '~ BASE 64 ~', base64.length);

    if (base64.length < 180) {
      console.log('Total pages ~ ', page - 1);
      break;
    }

    uploadToS3Array.push({
      content: base64,
      key: `${fileIdentifier}-${page}`,
    });

    // clearing out memory after 25 slides are parsed
    if (pageNumber % 25 === 0) {
      console.log('Starting upload for 25 slides ~ Current page ~', pageNumber);
      const results = await Promise.allSettled(uploadToS3Array.map(uploadToS3));
      slides = slides.concat(results.map((result) => result.value));
      console.log('Batched 25 slides');
      uploadToS3Array = [];
    }

    pageNumber++;
  }

  const results = await Promise.allSettled(uploadToS3Array.map(uploadToS3));

  slides = slides.concat(results.map((result) => result.value));

  console.log('Slide URLs ~ ', slides);
  return { slides };
};;

module.exports = { convertPdfToBase64 };
