import { createRouter } from 'next-connect';
import multer from 'multer';
import fs from 'fs';
import csvParser from 'csv-parser'; 
import { parseJSON } from '../../utils/parseJSON';
import { parseXLSX } from '../../utils/parseXLSX';

// Setup multer to store files temporarily on disk
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/'); 
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);  
    }
  }),
});

const router = createRouter();

router.use(upload.single('file'));

router.post(async (req, res) => {
  try {
    const file = req.file;
    const keyword = req.body.keyword;
    let parsedData = [];

    if (!file) {
      throw new Error('File is missing');
    }

    const fileExt = file.originalname.split('.').pop().toLowerCase();
    
    if (file.mimetype === 'text/csv' || fileExt === 'csv') {

      const results = [];
      const headers = [];
      fs.createReadStream(file.path)
        .pipe(csvParser())
        .on('headers', (headerList) => {
          headers.push(...headerList);
        })
        .on('data', (data) => results.push(data))
        .on('end', () => {
          parsedData = results;
          res.status(200).json({ headers, parsedData });
        });
    } else if (file.mimetype === 'application/json' || fileExt === 'json') {

      parsedData = await parseJSON(fs.readFileSync(file.path));
      res.status(200).json({ parsedData });
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || fileExt === 'xlsx') {
      const fileBuffer = fs.readFileSync(file.path);
      parsedData = await parseXLSX(fileBuffer);
      res.status(200).json({ parsedData });
    } else {
      throw new Error('Unsupported file type');
    }

    fs.unlinkSync(file.path);  
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    res.status(500).end('Something broke!');
  },
  onNoMatch: (req, res) => {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  },
});
