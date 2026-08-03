import { Routes, Route } from "react-router-dom";
import KintaiIndex from "./components/kintai/KintaiIndex.jsx";
import EmployeeMaster from "./components/kintai/EmployeeMaster.jsx";
function App() {
  return (
    <div className="App">
      <div>
        <Routes>
          <Route path="/kintai/index" element={<KintaiIndex />} />
          <Route path="/kintai/EmployeeMaster" element={<EmployeeMaster />} />
        </Routes>
      </div>
    </div>
  );
}
export default App;
