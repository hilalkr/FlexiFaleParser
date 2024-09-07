const express = require("express");
const next = require("next");
const multer = require("multer");
const csvParser = require("csv-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const upload = multer({ dest: "uploads/" });

app.prepare().then(() => {
  const server = express();
  
  server.use(cors());
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));


  server.post("/api/upload", upload.single("file"), (req, res) => {
    const filePath = path.join(__dirname, req.file.path);

    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const results = [];
    const headers = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('headers', (headerList) => {
        headers.push(...headerList);  
      })
      .on('data', (data) => results.push(data))  
      .on('end', () => {
        res.status(200).json({
          message: "File uploaded and parsed successfully!",
          headers, 
          data: results,  
        });
      });
  });

  server.listen(5000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:5000");
  });
});
