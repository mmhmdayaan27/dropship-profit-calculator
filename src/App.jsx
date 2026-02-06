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
    const saved = localStorage.getItem("dropship-data");
    if (saved) {

  useEffect(() => {
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
    ? { background: "#1e293b", border: "1px solid #334155" }
    : { background: "#ffffff", border: "1px solid #e2e8f0" };

  const inputStyle = {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    width: "100%",
    marginTop: "4px"
  };

  const buttonGreen = {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "12px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600"
  };

  return (
    <div style={{ minHeight: "100vh", padding: 24, ...themeStyles }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ ...cardStyle, borderRadius: 20, padding: 24, marginBottom: 20, textAlign: "center" }}>
          <h1 style={{ color: "#22c55e" }}>Dropship Profit Calculator</h1>
          <p style={{ opacity: 0.7 }}>Estimate profit, margins, and break‑even performance</p>

          {/* Controls */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 10 }}>
            <button onClick={() => setDarkMode(!darkMode)}>{darkMode ? "Light" : "Dark"} Mode</button>
            <button onClick={saveData}>💾 Save</button>
            <button onClick={loadData}>📂 Load</button>
          </div>

          {/* Currency */}
          <div style={{ marginTop: 10 }}>
            {currencies.map((c) => (
              <button key={c} onClick={() => setCurrency(c)} style={{ margin: 4 }}>{c}</button>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ marginTop: 10 }}>
            {[
              { id: "profit", label: "Profit" },
              { id: "suggest", label: "Suggested Prices" },
              { id: "graph", label: "Graph" }
            ].map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ margin: 4 }}>{t.label}</button>
            ))}
          </div>
        </div>

        {/* Profit Tab */}
        {activeTab === "profit" && (
          <div style={{ ...cardStyle, borderRadius: 20, padding: 24 }}>
            {[
              ["Selling Price", sellingPrice, setSellingPrice],
              ["Product Cost", productCost, setProductCost],
              ["Shipping Charges", shippingCost, setShippingCost],
              ["Gateway Fees", fees, setFees],
              ["Ad Cost / Order", adsCost, setAdsCost],
              ["Orders Per Day", ordersPerDay, setOrdersPerDay]
            ].map(([label, value, setter]) => (
              <div key={label} style={{ marginBottom: 12 }}>
                <label>{label}</label>
                <input type="number" value={value} onChange={(e) => setter(e.target.value)} style={inputStyle} />
              </div>
            ))}

            <button onClick={calculateProfit} style={{ ...buttonGreen, width: "100%" }}>Calculate Profit</button>

            {profit !== null && (
              <div style={{ marginTop: 16 }}>
                <p>Net Profit: {currency}{profit}</p>
                <p>Margin: {margin}%</p>
                <p>Break‑even ROAS: {roas}x</p>
                <p>Daily Profit: {currency}{dailyProfit}</p>
                <p>Monthly Profit: {currency}{monthlyProfit}</p>
              </div>
            )}
          </div>
        )}

        {/* Suggested */}
        {activeTab === "suggest" && (
          <div style={{ ...cardStyle, borderRadius: 20, padding: 24 }}>
            {suggestedPrices.map((s) => (
              <p key={s.margin}>{s.margin}% → {currency}{s.price}</p>
            ))}
          </div>
        )}

        {/* Graph */}
        {activeTab === "graph" && chartData.length > 0 && (
          <div style={{ ...cardStyle, borderRadius: 20, padding: 24 }}>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <XAxis dataKey="adCost" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="profit" stroke="#22c55e" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>
    </div>
  );
}
