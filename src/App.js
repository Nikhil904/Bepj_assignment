import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Main from "./components/Main";
import CarList from "./components/CarList";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="car" element={<CarList />}></Route>
      </Routes>
    </div>
  );
}

export default App;
