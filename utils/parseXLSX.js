const XLSX = require('xlsx');

const parseXLSX = (buffer) => {
  return new Promise((resolve, reject) => {
    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];  
      const worksheet = workbook.Sheets[sheetName];  
      const jsonData = XLSX.utils.sheet_to_json(worksheet);  
      resolve(jsonData);  
    } catch (error) {
      reject(error);  
    }
  });
};

module.exports = { parseXLSX };
