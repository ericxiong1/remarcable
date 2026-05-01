import { useEffect, useState } from "react";

function App() {
  const [backendMessage, setBackendMessage] = useState("");

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;

    fetch(`${API_URL}/api/health/`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setBackendMessage(data.message);
      })
      .catch((error) => {
        console.error("Error calling Django:", error);
      });
  }, []);

  return (
    <div>
      <h1>React + Django</h1>
      <p>Backend says: {backendMessage}</p>
    </div>
  );
}

export default App;