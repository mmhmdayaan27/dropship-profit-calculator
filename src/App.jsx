import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DropshipCalculator() {
  const [currency, setCurrency] = useState("₹");
  const [activeTab, setActiveTab] = useState("profit");
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
  const [chartData, setChartData] = useState([]);

  // ✅ Corrected useEffect (your bug was here)
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
    alert("Calculation saved 💾");
  };

  const loadData = () => {
    const saved = localStorage.getItem("dropship-data");
    if (!saved) return alert("No saved data found");
    const d = JSON.parse(saved);
    setSellingPrice(d.sellingPrice);
    setProductCost(d.productCost);
    setShippingCost(d.shippingCost);
    setFees(d.fees);
    setAdsCost(d.adsCost);
    setOrdersPerDay(d.ordersPerDay);
    setCurrency(d.currency);
    setDarkMode(d.darkMode);
  };

  const calculateProfit = () => {
    const totalExpenses =
      Number(productCost) +
      Number(shippingCost) +
      Number(fees) +
      Number(adsCost);

    const netProfit = Number(sellingPrice) - totalExpenses;
    const profitMargin = (netProfit / Number(sellingPrice)) * 100;
    const breakEvenRoas = Number(sellingPrice) / Number(adsCost || 1);

    const dayProfit = netProfit * Number(ordersPerDay);
    const monthProfit = dayProfit * 30;

    const data = [];
    for (let i = 0; i <= Number(sellingPrice); i += Math.max(10, sellingPrice / 10)) {
      const p = Number(sellingPrice) - (Number(productCost) + Number(shippingCost) + Number(fees) + i);
      data.push({ adCost: Math.round(i), profit: Math.round(p) });
    }

    setChartData(data);
    setProfit(netProfit);
    setMargin(profitMargin.toFixed(2));
    setRoas(breakEvenRoas.toFixed(2));
    setDailyProfit(dayProfit.toFixed(2));
    setMonthlyProfit(monthProfit.toFixed(2));
  };

  const totalBaseCost = Number(productCost) + Number(shippingCost) + Number(fees) + Number(adsCost);

  const suggestedPrices = [20, 30, 50].map((m) => {
    const price = totalBaseCost / (1 - m / 100 || 1);
    return { margin: m, price: price ? price.toFixed(0) : 0 };
  });

  const currencies = ["₹", "$", "AED"];

  const themeStyles = darkMode
    ? { background: "#0f172a", color: "#ffffff" }
    : { background: "#f1f5f9", color: "#0f172a" };

  const cardStyle = darkMode
    ? { background: "#1e293b", border: "1px solid #334155", boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }
    : { background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" };

  const inputStyle = {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    width: "100%",
    marginTop: "6px",
    fontSize: "14px"
  };

  const buttonGreen = {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "14px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    width: "100%"
  };

  return (
    <div style={{ minHeight: "100vh", padding: 24, ...themeStyles }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ ...cardStyle, borderRadius: 24, padding: 28, marginBottom: 24, textAlign: "center" }}>
          <h1 style={{ color: "#22c55e", marginBottom: 6 }}>Dropship Profit Calculator</h1>
          <p style={{ opacity: 0.7, marginBottom: 12 }}>Estimate profit, margins, and break‑even performance</p>

          {/* Controls */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "☀️ Light" : "🌙 Dark"} Mode
            </button>
            <button onClick={saveData}>💾 Save</button>
            <button onClick={loadData}>📂 Load</button>
          </div>

          {/* Currency */}
          <div style={{ marginTop: 12 }}>
            {currencies.map((c) => (
              <button key={c} onClick={() => setCurrency(c)} style={{ margin: 4 }}>{c}</button>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ marginTop: 12 }}>
            {["profit", "suggest", "graph"].map((t) => (
              <button key={t} onClick={() => setActiveTab(t)} style={{ margin: 4, fontWeight: activeTab === t ? "bold" : "normal" }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Profit Tab */}
        {activeTab === "profit" && (
          <div style={{ ...cardStyle, borderRadius: 24, padding: 28 }}>
            {[
              ["Selling Price", sellingPrice, setSellingPrice],
              ["Product Cost", productCost, setProductCost],
              ["Shipping Charges", shippingCost, setShippingCost],
              ["Gateway Fees", fees, setFees],
              ["Ad Cost / Order", adsCost, setAdsCost],
              ["Orders Per Day", ordersPerDay, setOrdersPerDay]
            ].map(([label, value, setter]) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 500 }}>{label}</label>
                <input type="number" value={value} onChange={(e) => setter(e.target.value)} style={inputStyle} />
              </div>
            ))}

            <button onClick={calculateProfit} style={buttonGreen}>Calculate Profit</button>

            {profit !== null && (
              <div style={{ marginTop: 18, lineHeight: 1.8 }}>
                <p><strong>Net Profit:</strong> {currency}{profit}</p>
                <p><strong>Margin:</strong> {margin}%</p>
                <p><strong>Break‑even ROAS:</strong> {roas}x</p>
                <p><strong>Daily Profit:</strong> {currency}{dailyProfit}</p>
                <p><strong>Monthly Profit:</strong> {currency}{monthlyProfit}</p>
              </div>
            )}
          </div>
        )}

        {/* Suggested */}
        {activeTab === "suggest" && (
          <div style={{ ...cardStyle, borderRadius: 24, padding: 28 }}>
            {suggestedPrices.map((s) => (
              <p key={s.margin} style={{ fontSize: 18 }}>{s.margin}% → {currency}{s.price}</p>
            ))}
          </div>
        )}

        {/* Graph */}
{activeTab === "graph" && chartData.length > 0 && (
  <div style={{ ...cardStyle, borderRadius: 24, padding: 28 }}>
    <h3 style={{ marginBottom: 10 }}>Profit vs Advertising Cost</h3>

    <p style={{ opacity: 0.7, marginBottom: 16 }}>
      <strong>X-axis:</strong> Advertising Cost per Order &nbsp; | &nbsp;
      <strong>Y-axis:</strong> Net Profit per Order
    </p>

    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData}>
        <XAxis
          dataKey="adCost"
          label={{ value: "Ad Cost", position: "insideBottom", offset: -5 }}
        />
        <YAxis
          label={{ value: "Profit", angle: -90, position: "insideLeft" }}
        />
        <Tooltip />
        <Line type="monotone" dataKey="profit" stroke="#22c55e" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  </div>
)}
