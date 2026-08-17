import { Routes, Route } from "react-router-dom";
import EmployeeMaster from "./components/kintai/EmployeeMaster.jsx";
import Input from "./components/kintai/Input.jsx";
function App() {
  return (
    <div className="App">
      <div>
        <Routes>
          <Route path="/employee/index" element={<EmployeeMaster />} />
          <Route path="/employee/input" element={<Input />} />
        </Routes>
      </div>
    </div>
  );
}
export default App;
