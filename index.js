const { exportToPdf } = require('./methods/exportToPdf');
const { convertPdfToBase64 } = require('./methods/convertPdfToBase64');

exports.handler = async (event) => {
  try {
    const request = JSON.parse(event.body);
    const fileName = request.fileName ?? 'No file name';

    console.log('Parsing file ~ ', fileName);

    const { buffer } = await exportToPdf(
      request.fileId,
      request.type,
      request.token
    );

    const { slides } = await convertPdfToBase64(buffer, request.fileId);

    // Throw if no slides
    if (slides.length === 0) {
      throw new Error('Empty slides');
    }

    return {
      status: 200,
      name: request.fileName,
      slides,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      error,
    };
  }
};
