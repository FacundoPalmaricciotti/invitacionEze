import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Invitacion from "./invitacion";
import Sorpresa from "./sorpresa";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Invitacion />} />
        <Route path="/sorpresa" element={<Sorpresa />} />
      </Routes>
    </Router>
  </StrictMode>
);
