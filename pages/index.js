import React, { useState, useEffect, useRef } from 'react';
import FileUpload from '../components/FileUpload';
import { FaArrowLeft } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export default function Home() {
  const [file, setFile] = useState(null);
  const [jsonFile, setJsonFile] = useState(null);
  const [fileInfoVisible, setFileInfoVisible] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [jsonData, setJsonData] = useState(null);
  const [isParsed, setIsParsed] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [tableHeaders, setTableHeaders] = useState([]);
  const [visibleRows, setVisibleRows] = useState(10);
  const tableRef = useRef(null);
  const [downloadFormat, setDownloadFormat] = useState('JSON');
  const [mockApiEndpoint, setMockApiEndpoint] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    let animationFrameId;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

 
    let particlesArray = [];
    const numParticles = 150;

    class Particle {
      constructor() {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvasWidth || this.x < 0) {
          this.x = Math.random() * canvasWidth;
          this.y = Math.random() * canvasHeight;
        }
        if (this.y > canvasHeight || this.y < 0) {
          this.x = Math.random() * canvasWidth;
          this.y = Math.random() * canvasHeight;
        }
      }
      draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }


    function initParticles() {
      particlesArray = [];
      for (let i = 0; i < numParticles; i++) {
        particlesArray.push(new Particle());
      }
    }


    function animateParticles() {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      animationFrameId = requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();


    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleFileSelect = (file) => {
    setFile(file);
    setIsParsed(false);
  };

  const handleJsonFileSelect = (file) => {
    setJsonFile(file);
    setIsParsed(false);
    setMockApiEndpoint(''); 
  };

  const handleParse = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('file', file);

      setJsonData(null);
      setMockApiEndpoint('');

      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status);
      }

      const data = await response.json();
      setResults(data.data);
      setFilteredResults(data.data);
      setTableHeaders(Object.keys(data.data[0] || {}));
      setIsParsed(true);

      setAlertMessage('Parsing completed!');
      setAlertVisible(true);
      setTimeout(() => {
        setAlertVisible(false);
      }, 2000);
    } catch (error) {
      console.error('Error occurred:', error);
      alert('An error occurred during file parsing.');
    }
  };

  const handleJsonParse = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('file', jsonFile);

      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status);
      }

      const data = await response.json();
      setJsonData(data.data);
      setMockApiEndpoint(data.apiEndpoint); 

    } catch (error) {
      console.error('Error occurred:', error);
      alert('An error occurred during JSON parsing.');
    }
  };

  const handleFilter = () => {
    const filtered = results.filter((row) =>
      Object.values(row).some((value) =>
        value && value.toString().toLowerCase().includes(keyword.toLowerCase())
      )
    );
    setFilteredResults(filtered);
  };

  const toggleFileInfo = () => {
    setFileInfoVisible(!fileInfoVisible);
  };

  const handleBackToHome = () => {
    setResults([]);
    setFile(null);
    setJsonFile(null);
    setIsParsed(false);
    setTableHeaders([]);
    setMockApiEndpoint('');
    localStorage.removeItem('parsedData');
  };

  const handleDownload = () => {
    if (downloadFormat === 'JSON') {
      const jsonData = JSON.stringify(filteredResults);
      const blob = new Blob([jsonData], { type: 'application/json' });
      saveAs(blob, 'filtered-data.json');
    } else if (downloadFormat === 'CSV') {
      const csvRows = [tableHeaders.join(',')];
      filteredResults.forEach((row) => {
        const values = tableHeaders.map((header) => row[header] || '');
        csvRows.push(values.join(','));
      });
      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv' });
      saveAs(blob, 'filtered-data.csv');
    } else if (downloadFormat === 'XLSX') {
      const ws = XLSX.utils.json_to_sheet(filteredResults);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');

      const xlsxBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([xlsxBuffer], { type: 'application/octet-stream' });
      saveAs(blob, 'filtered-data.xlsx');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = tableRef.current;
      if (scrollContainer && scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight) {
        setVisibleRows((prev) => Math.min(prev + 10, filteredResults.length));
      }
    };

    const scrollContainer = tableRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [filteredResults]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-600 to-purple-500 flex flex-col justify-center items-center p-6">
      {/* Canvas for flowing data animation */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0"></canvas>

      {alertVisible && (
        <div className={`fixed top-0 left-0 right-0 p-4 text-center transition-all duration-300 z-50 ${alertMessage === 'Parsing completed!' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {alertMessage}
        </div>
      )}





      {isParsed && (
        <div className="fixed top-4 left-4 flex items-center space-x-2">
          <button
            onClick={handleBackToHome}
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            <FaArrowLeft className="mr-2" /> Select New File
          </button>
        </div>
      )}

<div className="relative z-10 bg-white shadow-xl rounded-xl p-8 w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">File Parser Tool</h1>

        {!isParsed && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-center text-gray-700 mb-4">Upload Your File</h2>
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                  <FileUpload onFileSelect={handleFileSelect} />
                  <button
                    onClick={handleParse}
                    className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-lg w-full transition duration-300 mt-4"
                  >
                    Parse File
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-center text-gray-700 mb-4">Upload a JSON File</h2>
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                  <FileUpload onFileSelect={handleJsonFileSelect} />
                  <button
                    onClick={handleJsonParse}
                    className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-6 rounded-lg w-full transition duration-300 mt-4"
                  >
                    Parse JSON File
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {mockApiEndpoint && (
          <div className="mt-6 p-4 bg-gray-200 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Mock API Endpoint</h2>
            <a
              href={mockApiEndpoint}
              target="_blank"
              className="underline text-blue-600 hover:text-blue-800"
            >
              {mockApiEndpoint}
            </a>
          </div>
        )}

        {isParsed && results.length > 0 && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
              <input
                type="text"
                placeholder="Filter by keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="border p-2 rounded-l w-64"
              />
              <button
                onClick={handleFilter}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-r transition duration-300"
              >
                Filter
              </button>
            </div>

            <div ref={tableRef} className="overflow-x-auto max-w-full">
              <table className="table-auto w-full border-collapse">
                <thead>
                  <tr>
                    {tableHeaders.map((header, index) => (
                      <th key={index} className="px-4 py-2 border border-gray-300 bg-gray-100 text-left">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.slice(0, visibleRows).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {tableHeaders.map((header, colIndex) => (
                        <td key={colIndex} className="px-4 py-2 border border-gray-300 text-left">
                          {row[header]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {visibleRows < filteredResults.length && (
                <div className="text-center p-2">
                  <button
                    onClick={() => setVisibleRows((prev) => Math.min(prev + 10, filteredResults.length))}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <select
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="JSON">JSON</option>
                <option value="CSV">CSV</option>
                <option value="XLSX">XLSX</option>
              </select>

              <button
                onClick={handleDownload}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded transition duration-300"
              >
                Download
              </button>
            </div>
          </>
        )}

        {isParsed && file && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={toggleFileInfo}
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              File Info
            </button>
          </div>
        )}

        {fileInfoVisible && (
          <div className="fixed top-1/4 left-1/4 w-1/2 bg-white p-6 rounded-lg shadow-lg z-50">
            <div className="text-xl font-semibold mb-4">File Info</div>
            <ul className="mb-4">
              <li>File Name: {file ? file.name : ''}</li>
              <li>File Size: {file ? file.size : ''} bytes</li>
              <li>Last Modified: {file ? new Date(file.lastModified).toLocaleDateString() : ''}</li>
            </ul>
            <button
              onClick={toggleFileInfo}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Close
            </button>
          </div>
        )}

        {jsonData && (
          <div className="mt-6 p-4 bg-gray-200 rounded-lg">
            <h2 className="text-xl font-bold mb-4">JSON Data</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(jsonData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

