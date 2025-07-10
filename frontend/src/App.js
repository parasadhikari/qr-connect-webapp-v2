import React, { useState, useRef } from "react";
import axios from "axios";
import { QrReader } from "react-qr-reader";
import { FaQrcode, FaUpload, FaCamera, FaExternalLinkAlt } from "react-icons/fa";
import "./App.css";

function App() {
  const [qrImage, setQrImage] = useState(null);
  const [scannedURL, setScannedURL] = useState("");
  const [cameraData, setCameraData] = useState(null);
  const fileInputRef = useRef();

  const handleGenerate = async (e) => {
    e.preventDefault();
    const url = e.target.url.value;
    const formData = new FormData();
    formData.append("url", url);

    const response = await axios.post("http://localhost:8000/generate-qr/", formData, {
      responseType: "blob",
    });

    const imgURL = URL.createObjectURL(response.data);
    setQrImage(imgURL);
  };

  const handleScan = async () => {
    const file = fileInputRef.current.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post("http://localhost:8000/scan-qr/", formData);
    setScannedURL(response.data.data);
  };

  return (
    <div className="app">
      <h1>QR Connect Web App</h1>

      <form onSubmit={handleGenerate} className="section">
        <h2><FaQrcode /> Generate QR Code</h2>
        <input type="text" name="url" placeholder="Enter URL" required />
        <button type="submit">Generate</button>
        {qrImage && <img src={qrImage} alt="Generated QR" />}
      </form>

      <div className="section">
        <h2><FaUpload /> Scan from Image</h2>
        <input type="file" ref={fileInputRef} accept="image/*" />
        <button onClick={handleScan}>Scan</button>
        {scannedURL && (
          <p>
            <strong>Scanned from Image: </strong>
            <a href={scannedURL} target="_blank" rel="noopener noreferrer">
              {scannedURL} <FaExternalLinkAlt size={12} />
            </a>
          </p>
        )}
      </div>

      <div className="section">
        <h2><FaCamera /> Scan from Camera</h2>
        <QrReader
          constraints={{ facingMode: "environment" }}
          onResult={(result, error) => {
            if (!!result) setCameraData(result?.text);
            if (!!error) console.error("Scan error:", error);
          }}
          style={{ width: "300px" }}
        />
        {cameraData && (
          <p>
            <strong>Scanned from Camera: </strong>
            <a href={cameraData} target="_blank" rel="noopener noreferrer">
              {cameraData} <FaExternalLinkAlt size={12} />
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
