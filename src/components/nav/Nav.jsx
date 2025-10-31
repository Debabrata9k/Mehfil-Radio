import React from "react";
import { Link } from "react-router";
import LOGO from "../../../public/main.png";
function nav() {
  return (
    <nav className="bg-indigo-600 text-white p-4 flex justify-between">
      <h1 className="font-bold text-lg">
        <img src={LOGO} className="h-5 rounded-full"/>
      </h1>
      <div className="flex gap-4">
        <Link to="/" className="hover:text-gray-300">
          Home
        </Link>
        <Link to="/explore" className="hover:text-gray-300">
          Exdplore
        </Link>
      </div>
    </nav>
  );
}

export default nav;
