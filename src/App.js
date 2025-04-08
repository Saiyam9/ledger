import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import NewParty from "./Pages/NewParty";
import LedgerPage from "./Pages/LedgerPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/newParty" element={<NewParty />} />
        <Route path="/ledger/:id" element={<LedgerPage />} />
      </Routes>
    </Router>
  );
}

export default App;
