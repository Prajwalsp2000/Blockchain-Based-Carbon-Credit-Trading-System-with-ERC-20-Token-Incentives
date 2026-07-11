import React from "react";

function Marketplace({ listings, buy, sellCredits, loadListings, goBack }) {

  return (
    <>
      <h2>Marketplace</h2>

      <button onClick={goBack}>Back</button>

      <button onClick={sellCredits}>Sell 10 Credits</button>
      <button onClick={loadListings}>Refresh Listings</button>

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Seller</th>
            <th>Amount</th>
            <th>Price (ETH)</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {listings.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.seller.slice(0, 6)}...</td>
              <td>{item.amount}</td>
              <td>{item.price}</td>
              <td>
                <button onClick={() => buy(item.id, item.price)}>
                  Buy
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Marketplace;