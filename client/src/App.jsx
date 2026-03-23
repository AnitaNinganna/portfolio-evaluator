import { useEffect } from "react";
import API from "./utils/api";
import './App.css'

function App() {
  useEffect(() => {
    API.get("/profile/anita")
      .then(res => console.log("Profile API response:", res.data))
      .catch(err => console.error("Error:", err));
  }, []);

  return (
    <div className="container">
      <h1>Developer Portfolio Evaluator 🚀</h1>
      <p>Open the browser console to see the profile API test</p>
    </div>
  );
}

export default App;
