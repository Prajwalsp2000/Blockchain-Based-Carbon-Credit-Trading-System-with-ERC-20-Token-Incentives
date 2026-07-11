import React from "react";

function Company({ register, submitEmission, emissionInput, setEmissionInput, message, getBalance, balance, goMarketplace }) {

  return (
    <>
      <h2>Company Panel</h2>

      <button onClick={register}>Register Company</button>

      <h3>Submit Emission</h3>
      <input
        type="number"
        placeholder="Enter CO₂ emission"
        value={emissionInput}
        onChange={(e) => setEmissionInput(e.target.value)}
      />
      <button onClick={submitEmission}>Submit</button>

      <p><b>Status:</b> {message}</p>

      <button onClick={getBalance}>Check Credits</button>
      <p><b>Credits:</b> {balance}</p>

      <button onClick={goMarketplace}>Buy Credits</button>
    </>
  );
}

export default Company;