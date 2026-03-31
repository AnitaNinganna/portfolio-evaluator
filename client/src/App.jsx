import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Report from "./pages/Report";
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report/:username" element={<Report />} />
      </Routes>
    </div>
  );
}

export default App;
