import { useState, useEffect } from "react";
import { ethers } from "ethers";

import { RegistryABI } from "./abis/RegistryABI";
import { TokenABI } from "./abis/TokenABI";
import { MarketplaceABI } from "./abis/MarketplaceABI";

const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const marketAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const registryAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

function App() {
  const [account, setAccount] = useState("");
  const [registry, setRegistry] = useState(null);
  const [token, setToken] = useState(null);
  const [market, setMarket] = useState(null);

  const [credits, setCredits] = useState(0);
  const [listings, setListings] = useState([]);
  const [purchases, setPurchases] = useState([]);

  const [emission, setEmission] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [price, setPrice] = useState("");

  const [result, setResult] = useState("");
  const [page, setPage] = useState("home");
  const [buyAmounts, setBuyAmounts] = useState({});
  const [penalty, setPenalty] = useState(0);
  const [creditsUsed, setCreditsUsed] = useState(0);

  // CONNECT WALLET
  const connectWallet = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const addr = await signer.getAddress();

    setAccount(addr);

    setRegistry(new ethers.Contract(registryAddress, RegistryABI, signer));
    setToken(new ethers.Contract(tokenAddress, TokenABI, signer));
    setMarket(new ethers.Contract(marketAddress, MarketplaceABI, signer));
  };

  // LOAD CREDITS
  const loadCredits = async () => {
    if (!token || !market || !account) return;

    const walletBal = await token.balanceOf(account);
    let total = Number(ethers.formatUnits(walletBal, 18));

    const count = Number(await market.listingCounter());

    for (let i = 1; i <= count; i++) {
      const item = await market.getListing(i);
      const seller = item[0];
      const amount = item[2]; // ✅ remainingAmount
      const active = item[4];

      if (seller.toLowerCase() === account.toLowerCase() && active) {
        total += Number(ethers.formatUnits(amount, 18));
      }
    }

    setCredits(total);

    // 🔥 Adjust penalty based on credits
    setPenalty((prev) => {
    if (prev <= 0) return 0;
    
    const remaining = prev - total;
    return remaining > 0 ? remaining : 0;
  });
  };

  // LOAD LISTINGS
  const loadListings = async () => {
    if (!market) return;

    const count = Number(await market.listingCounter());
    let data = [];

    for (let i = 1; i <= count; i++) {
      const item = await market.getListing(i);

      data.push({
        id: i,
        seller: item[0],
        total: parseFloat(ethers.formatUnits(item[1], 18)),
        remaining: parseFloat(ethers.formatUnits(item[2], 18)),

        //listed: parseFloat(ethers.formatUnits(item[1], 18)),
        price: ethers.formatEther(item[3]),
        priceWei: item[3],
        active: item[4],
      });
    }

    setListings(data);
  };

  // LOAD PURCHASES (SAFE)
  const loadPurchases = async () => {
    try {
      if (!market || !account) return;

      if (!market.filters?.CreditsPurchased) return; // 🔥 prevent crash

      const filter = market.filters.CreditsPurchased();
      const events = await market.queryFilter(filter);

      const data = events
        .filter((e) => e.args.buyer.toLowerCase() === account.toLowerCase())
        .map((e) => ({
          id: Number(e.args.listingId),
          seller: e.args.seller,
          amount: parseFloat(ethers.formatUnits(e.args.amount, 18)),
          price: ethers.formatEther(e.args.totalPrice),
        }));

      setPurchases(data);
    } catch (err) {
      console.log("Purchase load error:", err);
    }
  };

  // REGISTER
  const register = async () => {
    try {
      const tx = await registry.registerCompany();
      await tx.wait();
      alert("Registered successfully!");
    } catch (err) {
      alert(err.reason || err.shortMessage || "Error");
    }
  };

  // SUBMIT EMISSION
  const submitEmission = async () => {
    try {
      const tx = await registry.recordEmission(Number(emission));
      await tx.wait();

      let p = 0;

      if (emission < 100) {
        setResult(`Reward: +${100 - emission}`);
        setPenalty(0);
      } 
      else if (emission > 100) {
        p = emission - 100;
        setResult(`Penalty Generated: ${p}`);
        // 🔥 calculate how much credits will be used
        const used = Math.min(p, credits);
        setCreditsUsed(used);
        setPenalty(p - used); // remaining penalty
      } 
      else {
        setResult("No change");
        setPenalty(0);
        setCreditsUsed(0);
      }

      setEmission("");

      await loadCredits();
      await loadListings();
    } catch (err) {
      alert(err.reason || err.shortMessage || "Error");
    }
  };

  // SELL (FIXED)
  const sellCredits = async () => {
    try {
      const amountWei = ethers.parseUnits(sellAmount.toString(), 18);
      const priceWei = ethers.parseEther(price.toString());

      // 🔥 STEP 1: APPROVE MARKETPLACE
      const approveTx = await token.approve(marketAddress, amountWei);
      await approveTx.wait();

      // 🔥 STEP 2: LIST
      const tx = await market.listCredits(amountWei, priceWei);
      await tx.wait();

      alert("Listed!");

      setSellAmount("");
      setPrice("");

      await loadListings();
      await loadCredits();
    
    } catch (err) {
      alert(err.reason || "Sell failed");
    }
  };

  // BUY (FIXED)
  const buyCredits = async (id, pricePerCreditWei) => {
    try {
      const amount = buyAmounts[id];
      
      if (!amount || Number(amount) <= 0) {
        alert("Enter valid amount");
        return;
      }

      // 🔥 ALWAYS sanitize input
      const cleanAmount = Number(amount);

      // convert to token wei
      const amountWei = ethers.parseUnits(cleanAmount.toString(), 18);

      // correct price calc
      const totalPriceWei =
        (pricePerCreditWei * amountWei) / ethers.parseUnits("1", 18);

      console.log("Buying:", cleanAmount);
      console.log("Wei:", amountWei.toString());

      const tx = await market.buyCredits(id, amountWei, {
        value: totalPriceWei,
      });

      await tx.wait();

      alert("Purchased!");

      setBuyAmounts((prev) => ({ ...prev, [id]: "" }));

      // 🔥 IMPORTANT: reload EVERYTHING from blockchain
      await loadListings();
      await loadCredits();
      await loadPurchases();

      // 🔥 recalc penalty after purchase
      setPenalty((prev) => {
        if (prev <= 0) return 0;
        
        const remaining = prev - Number(amount);
        return remaining > 0 ? remaining : 0;
      });
    
    } catch (err) {
      console.log(err);
      alert(err.reason || err.shortMessage || "Buy failed");
    }
  };

  // ACCOUNT CHANGE FIX
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async (accounts) => {
        window.location.reload();
        const newAccount = accounts[0];

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        setAccount(newAccount);

        setRegistry(new ethers.Contract(registryAddress, RegistryABI, signer));
        setToken(new ethers.Contract(tokenAddress, TokenABI, signer));
        setMarket(new ethers.Contract(marketAddress, MarketplaceABI, signer));

        // reset UI only
        setEmission("");
        setSellAmount("");
        setPrice("");
        setResult("");
        setCredits(0);
        setListings([]);
        setPurchases([]);
      });
    }
  }, []);

  useEffect(() => {
  const loadData = async () => {
    if (account && token && market) {
      await loadCredits();
      await loadListings();
      await loadPurchases();
    }
  };

  loadData();
}, [account, token, market]);

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "10px 30px",
    background: "#f5f7fa",
    minHeight: "100vh"
  },

  card: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    marginBottom: "20px"
  },

  button: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#4CAF50",
    color: "white",
    cursor: "pointer",
    margin: "5px"
  },

  input: {
    padding: "8px",
    margin: "5px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },

  table: {
    width: "auto",              // 🔥 key change
    marginTop: "10px",
    borderCollapse: "collapse",
    border: "1px solid #ddd" ,
    tableLayout: "auto",
  },

  th: {
    background: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    textAlign: "center",
    border: "1px solid #ddd"
  },

  td: {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "center",
    borderBottom: "1px solid #eee",
  }

};

  return (
    <div style={styles.container}>
      <h1 style={{ color: "#2e7d32"}}
      >
        🌱 Carbon Credit Trading System
      </h1>

      <button style={styles.button} onClick={connectWallet}>Connect Wallet</button>
      <p>Account: {account}</p>

      {page === "home" && (
        <div style={styles.card}>
          <h2>Company Panel</h2>

          <button style={styles.button} onClick={register}>Register</button>

          <h3>Submit Emission</h3>
          <input style={styles.input} value={emission} onChange={(e) => setEmission(e.target.value)} />
          <button style={styles.button} onClick={submitEmission}>Submit</button>

          <p>{result}</p>

          {creditsUsed > 0 && (
            <p style={{ color: "orange" }}>
              Credits Used: {creditsUsed}
            </p>
          )}

          {penalty > 0 ? (
            <p style={{ color: "red" }}>
              Remaining Penalty: {penalty}
            </p>
          ) : (
            <p style={{ color: "green" }}>
              No Penalty ✅</p>
          )}

          <button style={styles.button} onClick={loadCredits}>Check Credits</button>
          <p>Credits: {credits}</p>
          

          <button style={styles.button} onClick={() => setPage("market")}>
            Go to Marketplace
          </button>
        </div>
      )}

      {page === "market" && (
        <div style={styles.card}>
          <h2>Marketplace</h2>
          <button style={styles.button} onClick={() => setPage("home")}>⬅ Back</button>

          <h3>Sell Credits</h3>
          <input style={styles.input}
            placeholder="Enter credits"
            value={sellAmount}
            onChange={(e) => setSellAmount(e.target.value)}
          />

          <input style={styles.input}
            placeholder="Enter price in ETH"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <button style={styles.button} onClick={sellCredits}>Sell</button>

          <h3>Listings</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Seller</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Remaining</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Buy</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l.id}>
                  <td style={styles.td}>{l.id}</td>
                  <td style={{ 
                    ...styles.td,
                    whiteSpace: "nowrap",   // keeps in one line
                  }}>
                    {l.seller}
                  </td>

                  <td style={styles.td}>{l.total}</td>
                  <td style={styles.td}>{l.remaining}</td>
                  <td style={styles.td}>{l.price}</td>

                  <td style={styles.td}>
                    {!l.active ? (
                      "Sold"
                    ) : account === l.seller ? (
                      "Your Listing"
                    ) : (
                      <>
                        <input
                          style={{ width: "70px", marginRight: "5px" }}
                          placeholder="Qty"
                          value={buyAmounts[l.id] || ""}
                          onChange={(e) =>
                            setBuyAmounts({
                              ...buyAmounts,
                              [l.id]: e.target.value,
                            })
                          }
                        />
                        
                        <button
                          style={styles.button}
                          onClick={() => buyCredits(l.id, l.priceWei)}
                        >
                          Buy
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>My Purchases</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Seller</th>
                <th style={styles.th}>Credits</th>
                <th style={styles.th}>Price</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p, i) => (
                <tr key={i}>
                  <td style={styles.td}>{p.id}</td>
                  <td style={{ 
                    ...styles.td,
                    whiteSpace: "nowrap",
                  }}>
                    {p.seller}
                  </td>
                  <td style={styles.td}>{p.amount}</td>
                  <td style={styles.td}>{p.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;