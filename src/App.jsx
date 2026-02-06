import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

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
    : { background: "#ecfdf5", color: "#064e3b" };

  const card = {
    background: darkMode ? "#020617" : "white",
    padding: 28,
    borderRadius: 20,
    maxWidth: 520,
    margin: "40px auto",
    boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
    border: "1px solid #22c55e33"
  };

  const input = {
    width: "100%",
    padding: 12,
    marginTop: 6,
    marginBottom: 14,
    borderRadius: 10,
    border: "1px solid #22c55e55",
    outline: "none"
  };

  const greenBtn = {
    background: "#22c55e",
    color: "white",
    border: "none",
    padding: "12px 16px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: "bold",
    width: "100%",
    marginTop: 8
  };

  const smallBtn = {
    background: "transparent",
    border: "1px solid #22c55e",
    color: darkMode ? "#4ade80" : "#065f46",
    padding: "6px 10px",
    borderRadius: 8,
    cursor: "pointer",
    marginRight: 8
  };

  const chartData = profit
    ? [
        { name: "Total Cost", value: Number(productCost) + Number(shippingCost) + Number(fees) + Number(adsCost) },
        { name: "Selling Price", value: Number(sellingPrice) },
        { name: "Net Profit", value: Number(profit) }
      ]
    : [];

  return (
    <div style={{ minHeight: "100vh", ...theme }}>
      <div style={card}>
        {/* Logo + Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <img src="/logo.png" alt="logo" style={{ width: 40, height: 40 }} />
          <h1 style={{ color: "#16a34a" }}>Dropship Profit Calculator</h1>
        </div>

        <div style={{ marginBottom: 16 }}>
          <button onClick={() => setDarkMode(!darkMode)} style={smallBtn}>
            {darkMode ? "Light" : "Dark"} Mode
          </button>
          <button onClick={saveData} style={smallBtn}>
            Save
          </button>
        </div>

        {[
          ["Selling Price", sellingPrice, setSellingPrice],
          ["Product Cost", productCost, setProductCost],
          ["Shipping Charges", shippingCost, setShippingCost],
          ["Gateway Fees", fees, setFees],
          ["Ad Cost / Order", adsCost, setAdsCost],
          ["Orders Per Day", ordersPerDay, setOrdersPerDay]
        ].map(([label, val, set]) => (
          <div key={label}>
            <label style={{ fontWeight: 600 }}>{label}</label>
            <input
              type="number"
              value={val}
              onChange={(e) => set(e.target.value)}
              style={input}
            />
          </div>
        ))}

        <button onClick={calculateProfit} style={greenBtn}>
          Calculate Profit
        </button>

        {profit && (
          <>
            <div style={{ marginTop: 18, lineHeight: 1.8 }}>
              <p><strong>Net Profit:</strong> {currency}{profit}</p>
              <p><strong>Margin:</strong> {margin}%</p>
              <p><strong>Break-even ROAS:</strong> {roas}x</p>
              <p><strong>Daily Profit:</strong> {currency}{dailyProfit}</p>
              <p><strong>Monthly Profit:</strong> {currency}{monthlyProfit}</p>
            </div>

            {/* Graph with Axis Names */}
            <div style={{ height: 260, marginTop: 24 }}>
              <h3 style={{ marginBottom: 8 }}>Profit Overview Graph</h3>
              <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 10 }}>
                X‑axis: Cost → Selling → Profit &nbsp; | &nbsp; Y‑axis: Amount in {currency}
              </p>

              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis
                    dataKey="name"
                    label={{ value: "Stage", position: "insideBottom", offset: -5 }}
                  />
                  <YAxis
                    label={{ value: `Amount (${currency})`, angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
