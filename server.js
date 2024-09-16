const express = require("express");
const next = require("next");
const multer = require("multer");
const csvParser = require("csv-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { parseXLSX } = require("./utils/parseXLSX");
const { parseJSON } = require("./utils/parseJSON");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const upload = multer({ dest: "uploads/" });

let mockApiData = {};  

app.prepare().then(() => {
  const server = express();

  server.use(cors());
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));


  server.get("/api/mock-data", (req, res) => {
    if (!mockApiData || Object.keys(mockApiData).length === 0) {
      return res.status(404).json({ message: "No mock data available. Upload a JSON file first." });
    }
    res.status(200).json({ message: "Mock API data", data: mockApiData });
  });


  server.post("/api/upload", upload.single("file"), (req, res) => {
    const filePath = path.join(__dirname, req.file.path);

    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const fileExt = path.extname(req.file.originalname).toLowerCase();

    if (fileExt === ".csv") {
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
            message: "CSV file uploaded and parsed successfully!",
            headers,
            data: results,
          });
        })
        .on('error', (error) => {
          console.error("CSV parsing error:", error);
          res.status(500).json({ message: "Error parsing CSV file", error });
        });

    } else if (fileExt === ".xlsx") {
      fs.readFile(filePath, async (err, data) => {
        if (err) {
          console.error("File reading error:", err);
          return res.status(500).json({ message: "Error reading file" });
        }

        try {
          const parsedData = await parseXLSX(data);
          const headers = Object.keys(parsedData[0] || {});

          res.status(200).json({
            message: "XLSX file uploaded and parsed successfully!",
            headers,
            data: parsedData,
          });
        } catch (error) {
          console.error("XLSX parsing error:", error);
          res.status(500).json({ message: "Error parsing XLSX file", error });
        }
      });

    } else if (fileExt === ".json") {
      fs.readFile(filePath, async (err, data) => {
        if (err) {
          console.error("File reading error:", err);
          return res.status(500).json({ message: "Error reading file" });
        }

        try {
          const parsedData = JSON.parse(data); 

          mockApiData = parsedData;  // Store parsed JSON in mockApiData

          res.status(200).json({
            message: "JSON file uploaded and parsed successfully!",
            apiEndpoint: "http://localhost:5000/api/mock-data", 
            data: parsedData,
          });
        } catch (error) {
          console.error("JSON parsing error:", error);
          res.status(500).json({ message: "Error parsing JSON file", error });
        }
      });

    } else {
      return res.status(400).json({ message: "Unsupported file type" });
    }
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  
  server.listen(5000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:5000");
  });
});

