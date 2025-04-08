import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./LedgerPage.css";

function LedgerPage() {
  const { id } = useParams();
  const [party, setParty] = useState(null);
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ type: "credit", amount: "", note: "" });

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/parties/${id}`)
      .then((res) => setParty(res.data))
      .catch((err) => console.error("Failed to fetch party details", err));

    axios
      .get(`http://localhost:8000/api/ledger/${id}`)
      .then((res) => setEntries(res.data))
      .catch((err) => console.error("Failed to fetch ledger entries", err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      ...form,
      party_id: parseInt(id),
      date: new Date().toISOString(),
    };

    axios
      .post("http://localhost:8000/api/ledger", newEntry)
      .then(() => {
        setEntries([newEntry, ...entries]);
        setForm({ type: "credit", amount: "", note: "" });
      })
      .catch((err) => console.error("Failed to add ledger entry", err));
  };

  const totalCredit = entries
    .filter((e) => e.type === "credit")
    .reduce((sum, e) => sum + parseFloat(e.amount), 0);

  const totalDebit = entries
    .filter((e) => e.type === "debit")
    .reduce((sum, e) => sum + parseFloat(e.amount), 0);

  const netBalance = totalCredit - totalDebit;

  if (!party) return <div>Loading...</div>;

  return (
    <div className="ledger-container">
      <h2>Ledger for {party.name}</h2>
      <p>Contact: {party.contact}</p>

      <form className="ledger-form" onSubmit={handleSubmit}>
        <select name="type" value={form.type} onChange={handleChange} required>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="note"
          placeholder="Note"
          value={form.note}
          onChange={handleChange}
        />
        <button type="submit">Add Entry</button>
      </form>

      <h3>Balance Sheet</h3>
      <table className="ledger-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Note</th>
            <th>Credit</th>
            <th>Debit</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>{new Date(entry.date).toLocaleDateString()}</td>
              <td>{entry.note}</td>
              <td>{entry.type === "credit" ? entry.amount : ""}</td>
              <td>{entry.type === "debit" ? entry.amount : ""}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="totals-row">
            <td colSpan="2">
              <strong>Total</strong>
            </td>
            <td>
              <strong>{totalCredit}</strong>
            </td>
            <td>
              <strong>{totalDebit}</strong>
            </td>
          </tr>
          <tr className="net-row">
            <td colSpan="4">
              <strong>Net Balance: ₹{netBalance}</strong> (
              {netBalance >= 0 ? "Credit" : "Debit"})
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default LedgerPage;
