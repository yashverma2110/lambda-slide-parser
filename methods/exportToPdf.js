const axios = require('axios');

const GOOGLE_API_KEY = 'AIzaSyD0xyjgp01kEzXr4aSfvQh5ikHMyfyUbyg';
const url = 'https://www.googleapis.com/drive/v3/files';

const exportToPdf = async (fileId, type, token) => {
  let baseURL;
  if (type === 'pdf') {
    baseURL = `${url}/${fileId}?alt=media&key=${GOOGLE_API_KEY}`;
  } else {
    baseURL = `${url}/${fileId}/export?mimeType=application/pdf&key=${GOOGLE_API_KEY}`;
  }
  const response = await axios.get(baseURL, {
    responseType: 'arraybuffer',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log('Converted to PDF');

  return {
    buffer: response.data,
  };
};

module.exports = { exportToPdf };
