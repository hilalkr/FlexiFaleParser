import React, { useState } from 'react';

const FileUpload = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    onFileSelect(file);
  };

  return (
    <div className="file-upload">
      <label className="custom-file-upload">
        <input 
          type="file" 
          onChange={handleFileChange} 
        />
        Choose File
      </label>
      {selectedFile && <p className="mt-2">Selected File: {selectedFile.name}</p>}
    </div>
  );
};

export default FileUpload;
