import React, { useState, useEffect, useRef } from 'react';
import FileUpload from '../components/FileUpload';
import ResultsTable from '../components/ResultsTable';
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

  useEffect(() => {
    const savedData = localStorage.getItem('parsedData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setResults(parsedData.results);
      setFilteredResults(parsedData.results);
      setTableHeaders(parsedData.tableHeaders);
      setIsParsed(true);
    }
  }, []);

  useEffect(() => {
    if (isParsed) {
      localStorage.setItem('parsedData', JSON.stringify({ results, tableHeaders }));
    }
  }, [results, tableHeaders, isParsed]);

  const handleFileSelect = (file) => {
    setFile(file);
    setIsParsed(false);
  };

  const handleJsonFileSelect = (file) => {
    setJsonFile(file);
    setIsParsed(false);
  };

  const handleParse = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('file', file);

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
      setAlertMessage(`JSON file successfully uploaded! Mock API endpoint: ${data.apiEndpoint}`);
      setAlertVisible(true);
      setTimeout(() => {
        setAlertVisible(false);
      }, 4000);
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
      const xlsxBlob = XLSX.write(wb, { bookType: 'xlsx', type: 'blob' });
      saveAs(xlsxBlob, 'filtered-data.xlsx');
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
    <div className="min-h-screen bg-[linear-gradient(to_bottom_left,#0000ff_0%,#ff00ff_100%)] flex flex-col justify-center items-center p-6">
      {alertVisible && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-4 text-center">
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

      <div className={`bg-white shadow-md rounded-lg p-8 w-full max-w-4xl ${isParsed ? 'mb-4' : 'mb-12'}`}>
        <h1 className="text-4xl font-bold text-center mb-8 text-white">Simple Parser Tool</h1>

        {!isParsed && (
          <>
            <div className="mb-4">
              <FileUpload onFileSelect={handleFileSelect} />
              <button
                onClick={handleParse}
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded transition duration-300 mt-4"
              >
                Parse File
              </button>
            </div>

            <div className="mb-4">
              <h2 className="text-2xl font-bold text-center mb-4">Add JSON File</h2>
              <FileUpload onFileSelect={handleJsonFileSelect} />
              <button
                onClick={handleJsonParse}
                className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-6 rounded transition duration-300 mt-4"
              >
                Parse JSON File
              </button>
            </div>
          </>
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
            <p className="mt-4 text-black-700">
              Mock API Endpoint: <a href={alertMessage.split('Mock API endpoint: ')[1]} target="_blank" className="underline">
              {alertMessage.split('Mock API endpoint: ')[1]}
              </a>
            </p>
          </div>
        )}


      </div>
    </div>
  );
}
