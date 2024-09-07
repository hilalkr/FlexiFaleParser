import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import ResultsTable from '../components/ResultsTable';
import { FaArrowLeft } from 'react-icons/fa'; 

export default function Home() {
  const [file, setFile] = useState(null);
  const [fileInfoVisible, setFileInfoVisible] = useState(false); 
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isParsed, setIsParsed] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [tableHeaders, setTableHeaders] = useState([]);
  const [noDataAlertVisible, setNoDataAlertVisible] = useState(false); 

  const handleFileSelect = (file) => {
    setFile(file);
    setIsParsed(false); 
  };

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
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

      setAlertMessage('Parse işlemi başarılı!');
      setAlertVisible(true);
      setTimeout(() => {
        setAlertVisible(false);
      }, 2000); 
    } catch (error) {
      console.error('Error occurred:', error);
      alert('An error occurred during file parsing. Check the console for details.');
    }
  };

  const handleFilter = () => {
    const filtered = results.filter(row =>
      Object.values(row).some(value => value && value.toLowerCase().includes(keyword.toLowerCase()))
    );
    setFilteredResults(filtered);

    if (filtered.length === 0) {
      setNoDataAlertVisible(true); 
    } else {
      setNoDataAlertVisible(false); 
    }
  };

  const toggleFileInfo = () => {
    setFileInfoVisible(!fileInfoVisible);
  };

  const handleBackToHome = () => {
    setResults([]);
    setFile(null);
    setIsParsed(false);
    setTableHeaders([]);
  };

  const closeNoDataAlert = () => {
    setNoDataAlertVisible(false);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom_left,#0000ff_0%,#ff00ff_100%)] flex flex-col justify-center items-center p-6">
      {isParsed && (
        <div className="fixed top-4 left-4 flex items-center space-x-2">
          <button 
            onClick={handleBackToHome} 
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            <FaArrowLeft className="mr-2" /> Yeni Dosya Seç
          </button>
        </div>
      )}

      {isParsed && (
        <div className="text-white text-2xl font-semibold mb-4">
          Seçilen Dosya: {file.name}
        </div>
      )}

      <div className={`bg-white shadow-md rounded-lg p-8 w-full max-w-4xl ${isParsed ? 'mb-4' : 'mb-12'}`}>
        <h1 className="text-4xl font-bold text-center mb-8 text-white">Simple Parser Tool</h1>

        {!isParsed && (
          <div className="mb-4">
            <FileUpload onFileSelect={handleFileSelect} />
          </div>
        )}

        {!isParsed && (
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
            <button 
              onClick={handleParse} 
              className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded transition duration-300"
            >
              Parse File
            </button>
          
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Enter keyword"
                onChange={handleKeywordChange}
                className="border p-2 rounded-l w-64"
              />
              <button 
                onClick={handleFilter} 
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-r transition duration-300"
              >
                Filter
              </button>
            </div>
          </div>
        )}

        {isParsed && filteredResults.length > 0 && (
          <div className="mt-8">
            <div className="mb-6 flex justify-center items-center">
              <input
                type="text"
                placeholder="Search in table..."
                onChange={handleKeywordChange}
                className="border p-2 rounded-l w-64"
              />
              <button 
                onClick={handleFilter} 
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-r transition duration-300"
              >
                Filter Table
              </button>
            </div>
            <ResultsTable headers={tableHeaders} results={filteredResults.slice(0, 10)} />
          </div>
        )}

        {isParsed && (
          <div className="mt-4 flex justify-center">
            <button 
              onClick={toggleFileInfo} 
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Dosya Bilgileri
            </button>
          </div>
        )}

        {fileInfoVisible && (
          <div className="fixed top-1/4 left-1/4 w-1/2 bg-white p-6 rounded-lg shadow-lg z-50">
            <div className="text-xl font-semibold mb-4">Dosya Bilgileri</div>
            <ul className="mb-4">
              <li>Dosya Adı: {file.name}</li>
              <li>Dosya Boyutu: {file.size} bytes</li>
              <li>Son Değiştirilme: {new Date(file.lastModified).toLocaleDateString()}</li>
            </ul>
            <button 
              onClick={toggleFileInfo} 
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Kapat
            </button>
          </div>
        )}
      </div>

      {alertVisible && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded shadow-md transition duration-300">
          {alertMessage}
        </div>
      )}

      {noDataAlertVisible && (
        <div className="fixed top-1/3 left-1/4 w-1/2 bg-yellow-500 text-white p-6 rounded-lg shadow-lg z-50 text-center">
          <div className="text-xl font-semibold mb-4">No data to display</div>
          <button 
            onClick={closeNoDataAlert} 
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Kapat
          </button>
        </div>
      )}
    </div>
  );
}
