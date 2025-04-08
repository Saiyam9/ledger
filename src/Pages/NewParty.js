import React, { useState } from "react";
import axios from "axios";
import "./NewParty.css"; // Import the CSS file

function NewParty() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/api/parties", {
        name,
        contact,
      });

      if (res.status === 200) {
        alert("Party added successfully!");
        setName("");
        setContact("");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add party");
    }
  };

  return (
    <div className="new-party-container">
      <h2 className="form-title">Add New Party</h2>
      <form className="party-form" onSubmit={handleSubmit}>
        <label>Party Name</label>
        <input
          type="text"
          placeholder="Enter party name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Contact Info</label>
        <input
          type="text"
          placeholder="Enter contact info"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />

        <button type="submit" className="submit-btn">
          Add Party
        </button>
      </form>
    </div>
  );
}

export default NewParty;
