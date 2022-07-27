function getPage(pdf, pageNum) {
  return new Promise((resolve, reject) => {
    pdf
      .getPage(pageNum)
      .then((page) => {
        resolve(page);
      })
      .catch((err) => {
        console.log('Unable to get PDF page. Err - %o', err);
        reject(err);
      });
  });
}

module.exports = { getPage };
