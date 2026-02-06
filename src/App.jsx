import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DropshipCalculator() {
  const currencies = ["₹", "$", "AED", "€", "£", "¥", "₩", "₽"];

  const [currency, setCurrency] = useState("₹");
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profit");

  // DEFAULT VALUES → all ZERO as requested
  const [sellingPrice, setSellingPrice] = useState(0);
  const [productCost, setProductCost] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [fees, setFees] = useState(0);
  const [adsCost, setAdsCost] = useState(0);
  const [ordersPerDay, setOrdersPerDay] = useState(0);

  const [profit, setProfit] = useState(null);
  const [margin, setMargin] = useState(null);
  const [roas, setRoas] = useState(null);
  const [dailyProfit, setDailyProfit] = useState(null);
  const [monthlyProfit, setMonthlyProfit] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("dropship-data");

    // If NO saved data → keep everything at ZERO (true default)
    if (!saved) return;

    const d = JSON.parse(saved);

    setSellingPrice(d.sellingPrice ?? 0);
    setProductCost(d.productCost ?? 0);
    setShippingCost(d.shippingCost ?? 0);
    setFees(d.fees ?? 0);
    setAdsCost(d.adsCost ?? 0);
    setOrdersPerDay(d.ordersPerDay ?? 0);
    setCurrency(d.currency ?? "₹");
    setDarkMode(d.darkMode ?? false);
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
    const m = sellingPrice ? (net / Number(sellingPrice)) * 100 : 0;
    const r = adsCost ? Number(sellingPrice) / Number(adsCost) : 0;

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
    maxWidth: 620,
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

  const tabBtn = (tab) => ({
    padding: "8px 14px",
    borderRadius: 10,
    border: "1px solid #22c55e",
    background: activeTab === tab ? "#22c55e" : "transparent",
    color: activeTab === tab ? "white" : darkMode ? "#4ade80" : "#065f46",
    cursor: "pointer",
    marginRight: 8,
    marginBottom: 12
  });

  const totalBaseCost =
    Number(productCost) + Number(shippingCost) + Number(fees) + Number(adsCost);

  const suggestedPrices = [20, 30, 50].map((m) => ({
    margin: m,
    price: totalBaseCost ? (totalBaseCost / (1 - m / 100)).toFixed(2) : 0
  }));

  const chartData = profit
    ? [
        { name: "Cost", value: totalBaseCost },
        { name: "Selling", value: Number(sellingPrice) },
        { name: "Profit", value: Number(profit) }
      ]
    : [];

  return (
    <div style={{ minHeight: "100vh", ...theme }}>
      <div style={card}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <img src="/logo.png" alt="logo" style={{ width: 40, height: 40 }} />
          <h1 style={{ color: "#16a34a" }}>Dropship Profit Calculator</h1>
        </div>

        {/* Tabs */}
        <div>
          <button style={tabBtn("profit")} onClick={() => setActiveTab("profit")}>Profit</button>
          <button style={tabBtn("suggest")} onClick={() => setActiveTab("suggest")}>Suggested Prices</button>
          <button style={tabBtn("graph")} onClick={() => setActiveTab("graph")}>Graph</button>
          <button style={tabBtn("currency")} onClick={() => setActiveTab("currency")}>Currency</button>
        </div>

        {/* PROFIT TAB */}
        {activeTab === "profit" && (
          <>
            {[
              ["Selling Price", sellingPrice, setSellingPrice],
              ["Product Cost", productCost, setProductCost],
              ["Shipping Charges", shippingCost, setShippingCost],
              ["Gateway Fees", fees, setFees],
              ["Ad Cost / Order", adsCost, setAdsCost],
              ["Orders Per Day", ordersPerDay, setOrdersPerDay]
            ].map(([label, val, set]) => (
              <div key={label}>
                <label style={{ fontWeight: 600 }}>{label} ({currency})</label>
                <input type="number" value={val} onChange={(e) => set(e.target.value)} style={input} />
              </div>
            ))}

            <button onClick={calculateProfit} style={greenBtn}>Calculate Profit</button>

            {profit !== null && (
              <div style={{ marginTop: 18, lineHeight: 1.8 }}>
                <p><strong>Net Profit:</strong> {currency}{profit}</p>
                <p><strong>Margin:</strong> {margin}%</p>
                <p><strong>Break-even ROAS:</strong> {roas}x</p>
                <p><strong>Daily Profit:</strong> {currency}{dailyProfit}</p>
                <p><strong>Monthly Profit:</strong> {currency}{monthlyProfit}</p>
              </div>
            )}
          </>
        )}

        {/* SUGGESTED PRICES TAB */}
        {activeTab === "suggest" && (
          <div style={{ marginTop: 20 }}>
            <h3>Recommended Selling Prices</h3>
            {suggestedPrices.map((s) => (
              <p key={s.margin}>
                For <strong>{s.margin}%</strong> margin → <strong>{currency}{s.price}</strong>
              </p>
            ))}
          </div>
        )}

        {/* GRAPH TAB */}
        {activeTab === "graph" && profit !== null && (
          <div style={{ height: 300, marginTop: 20 }}>
            <h3>Profit Graph</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" label={{ value: "Stage", position: "insideBottom", offset: -5 }} />
                <YAxis label={{ value: `Amount (${currency})`, angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* CURRENCY TAB */}
        {activeTab === "currency" && (
          <div style={{ marginTop: 20 }}>
            <h3>Select Currency</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {currencies.map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 10,
                    border: "1px solid #22c55e",
                    background: currency === c ? "#22c55e" : "transparent",
                    color: currency === c ? "white" : darkMode ? "#4ade80" : "#065f46",
                    cursor: "pointer"
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
