import { useEffect, useState } from "react";

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDocuments = async () => {
    try {
      const response = await fetch("http://localhost:8001/api/documents/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("Failed to load documents:", error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8001/api/documents/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: formData,
      });

      if (response.ok) {
        fetchDocuments();
        setFile(null);
        alert("Upload successful");
      } else {
        alert("Upload failed");
        console.error(await response.text());
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (<>
    <header className="bg-gray-800 shadow-md py-1 px-8 flex justify-between items-center">
        <div><h1 className="text-2xl font-bold mt-3 tracking-wide text-blue-400">
        AskDoc <span className="text-white">AI</span>
          
        </h1>
        <p className="text-gray-400 text-center mb-6">
  Upload documents. Ask intelligent questions. Get instant insights.
</p>
        </div>
        
        
        <nav>
          <button className="text-sm text-white hover:text-blue-400 transition">
            Logout
          </button>
        </nav>
      </header>
    
    <div className="min-h-screen bg-gray-900 text-white p-8 text-center">

      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div
        className="border-2 border-dashed border-gray-600 rounded-xl p-30 mb-4 flex flex-col items-center justify-center bg-gray-800 hover:bg-gray-700 transition cursor-pointer"
        onClick={() => document.getElementById("fileInput").click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files.length > 0) {
            setFile(e.dataTransfer.files[0]);
          }
        }}
      >
        <p className="text-gray-400 mb-2 text-lg text-center">
          Click anywhere or drag your document here
        </p>

        {file && <p className="text-sm text-green-400">{file.name}</p>}

        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <button
        onClick={handleUpload}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold mb-8 "
        disabled={loading || !file}
      >
        {loading ? "Uploading..." : "Upload Document"}
      </button>

      <div>
        <h2 className="text-xl font-semibold mb-4">Uploaded Documents</h2>
        {documents.length === 0 ? (
          <p className="text-gray-400">No documents uploaded yet.</p>
        ) : (
          <ul className="space-y-3">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="bg-gray-800 p-4 rounded flex justify-between items-center shadow-md"
              >
                <span>{doc.filename || "Document"}</span>
                <button className="text-red-400 hover:underline">Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="bg-gray-800 p-6 mt-4 rounded shadow-md">
    <h3 className="text-lg font-semibold mb-4 text-white">Ask a question about your documents</h3>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert("Simulating AI response...");
      }}
      className="flex flex-col sm:flex-row items-center gap-3"
    >
      <input
        type="text"
        placeholder="Type your question..."
        className="flex-grow p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-400"
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold"
      >
        Ask
      </button>
    </form>
  </div>
    </div>
    </>
  );
}
