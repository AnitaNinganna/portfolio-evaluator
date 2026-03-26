import { useEffect } from "react";
import API from "./utils/api";
import Home from "./components/Home";
import './App.css'

function App() {
  useEffect(() => {
    API.get("/profile/anita")
      .then(res => console.log("Profile API response:", res.data))
      .catch(err => console.error("Error:", err));
  }, []);

  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;
