import React, { useState, useEffect } from "react";
import OnlyOfficeEditor from "./Office";
import axios from "axios";

export default function FileSidebar({ show, setShowFileSidebar }) {
  const [config, setConfig] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://demos.azure.com.np/edit.php?file=sample4.docx")
      .then((resp) => {
        setConfig(resp.data);
        setIsLoading(false);
        console.log(resp.data)
      });
  },[]);

  if(isLoading){
    return "Loading";
  }

  
  return (
    <div
      className={`fixed top-0 right-0 z-[100] h-screen w-[80%] bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-500 ease-in-out overflow-y-auto ${
        show ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="d-flex align-items-center justify-content-between px-4 py-1 border-bottom sticky-top bg-white">
        <h5
          className="mb-0 fw-semibold"
          style={{ fontSize: "12px", color: "#1a1a1a" }}
        >
          File Opened
        </h5>
        <button
          onClick={() => setShowFileSidebar(false)}
          className="btn btn-link text-decoration-none p-0"
          style={{ color: "#0d6efd", fontSize: "12px", fontWeight: "500" }}
        >
          Close
        </button>
      </div>
      <div>
        <OnlyOfficeEditor config={config} />
      </div>
    </div>
  );
}
