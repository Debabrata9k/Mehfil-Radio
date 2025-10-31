import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router";
import Explore from "./pages/Explore";
import Home from "./pages/Home";
import Play from "./pages/play";
import Nav from "./components/nav/Nav";
export default function App() {
  return (
    <Router>
      <Nav />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/play/:id" element={<Play />} />
        </Routes>
      </div>
    </Router>
  );
}
