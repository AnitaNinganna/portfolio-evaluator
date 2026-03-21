import { useEffect } from "react";
import API from "./utils/api";
import './App.css'

function App() {
  useEffect(() => {
    API.get("/health")
      .then(res => console.log("Backend response:", res.data))
      .catch(err => console.error("Error connecting to backend:", err));
  }, []);

  return (
    <div className="container">
      <h1>Developer Portfolio Evaluator 🚀</h1>
      <p>Open the browser console to see the backend connection test</p>
    </div>
  );
}

export default App;
