import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [directoryItems, setDirectoryItems] = useState([]);
  const [progress, setProgress] = useState(`${0}%`);
  const [selectFile, setselectFile] = useState(null);
  const [rename, setRename] = useState("");
  const [fileName, setFilename] = useState("");
  const fileInputRef = useRef(null);
  let count = 0;
  const URL = "http://192.168.123.97:4000/";

  async function getDirectoryItems() {
    const response = await fetch(URL);
    const data = await response.json();

    setDirectoryItems(data);
  }
  useEffect(() => {
    getDirectoryItems();
  }, []);

  // Handle Delete Code

  async function handleDelete(fileName) {
    try {
      const response = await fetch(`${URL}${fileName}`, {
        method: "DELETE",
        body: fileName,
      });
      const data = await response.text();
      console.log(data);
      getDirectoryItems();
    } catch (err) {
      console.log(err.message);
    }
  }
  // Handle Rename Code
  function handleRename(filename) {
    console.log("Renamed");
    setRename(filename);
    setFilename(filename);
  }
  // Update Rename
  async function Renamed(oldName) {
    console.log("Old Name:", oldName);
    console.log("New Name:", rename); // Debugging
    const response = await fetch(`${URL}${oldName}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldName: fileName, fileName: rename }),
    });
    const result = await response.text();
    console.log(result);
    await getDirectoryItems();
    setRename("");
    setFilename("");
  }
  // handle File Select
  function handleFileSelect(e) {
    setselectFile(e.target.files[0]);
  }
  // Upload file code
  async function handleUpload(e) {
    if (!selectFile) {
      alert("Please Select File");
      return;
    }
    const xhr = new XMLHttpRequest();
    xhr.open("POST", URL, true);
    xhr.setRequestHeader("filename", selectFile.name);
    xhr.addEventListener("load", () => {
      console.log(xhr.response);

      setTimeout(() => {
        setProgress(`${0}%`);
        setselectFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 3000);
      getDirectoryItems();
    });
    xhr.upload.addEventListener("progress", (e) => {
      const totalProgress = (e.loaded / e.total) * 100;
      setProgress(`${totalProgress.toFixed(2)}%`);
      // Clear the progress Bar
    });
    xhr.send(selectFile);
  }

  return (
    <>
      <div className="bg-gray-100 p-4 w-full min-h-screen">
        {/* Top Strip */}
        <div className="bg-blue-600 shadow-md p-4 rounded-md font-semibold text-white text-xl">
          My Drive Files
        </div>
        {/* Upload Section */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-4 bg-white shadow-md mt-4 p-4 rounded-md">
          <input
            ref={fileInputRef}
            onChange={handleFileSelect}
            type="file"
            className="p-2 border rounded-md w-full sm:w-auto"
          />
          <button
            onClick={handleUpload}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md w-full sm:w-auto text-white"
          >
            Upload
          </button>

          <input
            type="text"
            value={rename}
            onChange={(e) => setRename(e.target.value)}
            className="p-2 border rounded-md w-full sm:w-auto"
          />

          <button
            onClick={() => Renamed(fileName)}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md w-full sm:w-auto text-white"
          >
            Rename
          </button>
        </div>

        {/* Upload Progress Bar */}

        <div className="flex justify-center bg-gray-300 mt-4 rounded-md w-full">
          <div
            className="bg-green-500 px-3 rounded-md font-semibold text-white text-sm text-center"
            style={{ width: `${progress}`, padding: "2px 0" }}
          >
            {progress}
          </div>
        </div>

        {/* File List */}
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-6">
          {directoryItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-white shadow-md p-4 rounded-lg"
            >
              <p className="mb-3 font-medium">{item}</p>
              <div className="gap-2 grid grid-cols-2 w-full">
                <a href={`${URL}${item}?action=open`}>
                  <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md w-full text-white">
                    Open
                  </button>
                </a>
                <a href={`${URL}storage/${item}?action=download`}>
                  <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md w-full text-white">
                    Download
                  </button>
                </a>
                <button
                  onClick={() => handleDelete(item)}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md w-full text-white"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleRename(item)}
                  className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-md w-full text-white"
                >
                  Rename
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
