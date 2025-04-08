import React from "react";
import { Link } from "react-router-dom";
import "./NavbarComp.css"; // Make sure this path is correct based on your structure

function NavbarComp() {
  return (
    <nav className="navbar">
      <div className="navbar__logo">
        {" "}
        <Link to="/">Varun Steels</Link>
      </div>
      <ul className="navbar__links">
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/parties">Parties</a>
        </li>
        <li>
          <a href="/ledger">Ledger</a>
        </li>
      </ul>
    </nav>
  );
}

export default NavbarComp;
