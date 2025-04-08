import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./HomePage.css"; // Add this line for the CSS

function HomePage() {
  const [parties, setParties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/parties")
      .then((res) => setParties(res.data))
      .catch((err) => console.error("Failed to fetch parties", err));
  }, []);

  const filteredParties = parties.filter((party) =>
    party.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="home-container">
      <div className="header">
        <h2>Party Ledger</h2>
        <Link to="/newParty">
          <button className="new-entry-btn">+ New Entry</button>
        </Link>
      </div>

      <input
        type="text"
        className="search-box"
        placeholder="Search by party name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {filteredParties.length === 0 ? (
        <p className="no-results">No matching parties found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="party-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredParties.map((party) => (
                <tr key={party.id}>
                  <td>{party.id}</td>
                  <td>{party.name}</td>
                  <td>{party.contact}</td>
                  <td>
                    <Link to={`/ledger/${party.id}`}>
                      <button className="open-ledger-btn">Open Ledger</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HomePage;
