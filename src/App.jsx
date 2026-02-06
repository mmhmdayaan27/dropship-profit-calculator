import React, { useState, useEffect } from "react";

export default function DropshipCalculator() {
  const [currency, setCurrency] = useState("₹");
  const [darkMode, setDarkMode] = useState(false);

  const [sellingPrice, setSellingPrice] = useState(599);
  const [productCost, setProductCost] = useState(120);
  const [shippingCost, setShippingCost] = useState(0);
  const [fees, setFees] = useState(0);
  const [adsCost, setAdsCost] = useState(0);
  const [ordersPerDay, setOrdersPerDay] = useState(1);

  const [profit, setProfit] = useState(null);
  const [margin, setMargin] = useState(null);
  const [roas, setRoas] = useState(null);
  const [dailyProfit, setDailyProfit] = useState(null);
  const [monthlyProfit, setMonthlyProfit] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("dropship-data");
    if (saved) {
      const d = JSON.parse(saved);
      setSellingPrice(d.sellingPrice);
      setProductCost(d.productCost);
      setShippingCost(d.shippingCost);
      setFees(d.fees);
      setAdsCost(d.adsCost);
      setOrdersPerDay(d.ordersPerDay);
      setCurrency(d.currency);
      setDarkMode(d.darkMode);
    }
  }, []);

  const saveData = () => {
    localStorage.setItem(
      "dropship-data",
      JSON.stringify({
        sellingPrice,
        productCost,
        shippingCost,
        fees,
        adsCost,
        ordersPerDay,
        currency,
        darkMode
      })
    );
    alert("Saved 💾");
  };

  const calculateProfit = () => {
    const total =
      Number(productCost) +
      Number(shippingCost) +
      Number(fees) +
      Number(adsCost);

    const net = Number(sellingPrice) - total;
    const m = (net / Number(sellingPrice)) * 100;
    const r = Number(sellingPrice) / Number(adsCost || 1);

    setProfit(net.toFixed(2));
    setMargin(m.toFixed(2));
    setRoas(r.toFixed(2));
    setDailyProfit((net * ordersPerDay).toFixed(2));
    setMonthlyProfit((net * ordersPerDay * 30).toFixed(2));
  };

  const theme = darkMode
    ? { background: "#0f172a", color: "white" }
    : { background: "#f1f5f9", color: "#0f172a" };

  const card = {
    background: darkMode ? "#1e293b" : "white",
    padding: 24,
    borderRadius: 16,
    maxWidth: 500,
    margin: "40px auto",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
  };

  const input = { width: "100%", padding: 10, marginTop: 5, marginBottom: 10 };

  return (
    <div style={{ minHeight: "100vh", ...theme }}>
      <div style={card}>
        <h1 style={{ color: "#22c55e" }}>Dropship Profit Calculator</h1>

        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Light" : "Dark"} Mode
        </button>
        <button onClick={saveData} style={{ marginLeft: 10 }}>
          Save
        </button>

        {[ 
          ["Selling Price", sellingPrice, setSellingPrice],
          ["Product Cost", productCost, setProductCost],
          ["Shipping Charges", shippingCost, setShippingCost],
          ["Gateway Fees", fees, setFees],
          ["Ad Cost / Order", adsCost, setAdsCost],
          ["Orders Per Day", ordersPerDay, setOrdersPerDay]
        ].map(([label, val, set]) => (
          <div key={label}>
            <label>{label}</label>
            <input
              type="number"
              value={val}
              onChange={(e) => set(e.target.value)}
              style={input}
            />
          </div>
        ))}

        <button onClick={calculateProfit}>Calculate Profit</button>

        {profit && (
          <div style={{ marginTop: 15 }}>
            <p>Net Profit: {currency}{profit}</p>
            <p>Margin: {margin}%</p>
            <p>Break-even ROAS: {roas}x</p>
            <p>Daily Profit: {currency}{dailyProfit}</p>
            <p>Monthly Profit: {currency}{monthlyProfit}</p>
          </div>
        )}
      </div>
    </div>
  );
}
