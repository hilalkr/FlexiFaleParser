import { createRouter } from 'next-connect';
import multer from 'multer';

// With Multer we keep the file in memory
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

// Manage file upload with Multer middleware
router.use(upload.single('file'));  

router.post(async (req, res) => {
  try {
    console.log('File:', req.file);  
    console.log('Keyword:', req.body.keyword);  

    if (!req.file) {
      throw new Error('File is missing');  
    }

    const file = req.file;
    const keyword = req.body.keyword;
    let parsedData = [];

    if (file.mimetype === 'text/csv') {
      console.log('Parsing CSV file');
      parsedData = await parseCSV(file.buffer);
    } else if (file.mimetype === 'application/json') {
      console.log('Parsing JSON file');
      parsedData = await parseJSON(file.buffer);
    } else if (file.mimetype === 'application/xml') {
      console.log('Parsing XML file');
      parsedData = await parseXML(file.buffer);
    } else {
      throw new Error('Unsupported file type');
    }

    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      parsedData = parsedData.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(lowerKeyword)
      );
    }

    res.status(200).json({ parsedData });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(500).end('Something broke!');
  },
  onNoMatch: (req, res) => {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  },
});
