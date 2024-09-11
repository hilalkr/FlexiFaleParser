const csvParser = require('csv-parser');
const fs = require('fs');

exports.parseCSV = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const headers = [];

    const csvStream = csvParser({
      separator: ';',  
    });

    fs.createReadStream(fileBuffer)
      .pipe(csvStream)
      .on('headers', (headerList) => {
        headers.push(...headerList);
      })
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve({ headers, results });
      })
      .on('error', (error) => reject(error));
  });
};


