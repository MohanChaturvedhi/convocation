import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './UploadFile.css'; 
import axios from 'axios';

const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState('');
  const [parsedData, setParsedData] = useState('');
  const [showTable, setShowTable] = useState('');
  const [inputKey, setInputKey] = useState(0);

  useEffect(() => {
    // Reset key when component unmounts to avoid potential issues
    return () => setInputKey(0);
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const filename = file.name.split('.');

    if (filename[1] !== 'csv') {
      alert('Please upload a CSV file');
      setSelectedFile(null);
      setShowTable(false);
      return;
    } else {
      setSelectedFile(file);
      setShowTable(false);
    }
  };

  const handleParsePreview = () => {
    if (selectedFile) {
      Papa.parse(selectedFile, {
        complete: (result) => {
          setParsedData(result.data);
          setShowTable(true);
        },
        header: true,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('', { data: parsedData });

      if (response.status === 200) {
        console.log('Data successfully submitted to the backend.');
      } else {
        console.error('Failed to submit data to the backend.');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setParsedData(null);
    setShowTable(false);
    setInputKey((prevKey) => prevKey + 1); // Increment the key to force re-render
  };

  return (
    <div>
      <div className="header">
        <h1>Convocation</h1>
      </div>

      <div className="uploader">
        <h2>Select CSV Files</h2>
        <input
          className="uploader_btn"
          key={inputKey}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
        />
      </div>

      {selectedFile && <button onClick={handleParsePreview}>Preview CSV</button>}

      {showTable && parsedData && (
  <div className="popup">
    <div className="popup-content">
      <h3>Data Preview</h3>
      <div className="table-container"> {/* Add this container */}
        <table>
          <thead>
            <tr>
              {Object.keys(parsedData[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {parsedData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <button className="confirm" onClick={handleSubmit}>
          Confirm
        </button>
        <button className="cancel" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default UploadFile;
