import xml2js from 'xml2js';

export const parseXML = (buffer) => {
  const parser = new xml2js.Parser();
  return new Promise((resolve, reject) => {
    parser.parseString(buffer.toString(), (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};
