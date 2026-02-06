import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DropshipCalculator() {
  const currencies = ["₹", "$", "AED", "€", "£", "¥", "₩", "₽"];

  const [currency, setCurrency] = useState("₹");
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profit");

  // Empty default values (clean UX)
  const [sellingPrice, setSellingPrice] = useState("");
  const [productCost, setProductCost] = useState("");
  const [shippingCost, setShippingCost] = useState("");
  const [fees, setFees] = useState("");
  const [adsCost, setAdsCost] = useState("");
  const [ordersPerDay, setOrdersPerDay] = useState("");

  const [profit, setProfit] = useState(null);
  const [margin, setMargin] = useState(null);
  const [roas, setRoas] = useState(null);
  const [dailyProfit, setDailyProfit] = useState(null);
  const [monthlyProfit, setMonthlyProfit] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("dropship-data");
    if (!saved) return;

    const d = JSON.parse(saved);

    setSellingPrice(d.sellingPrice ?? "");
    setProductCost(d.productCost ?? "");
    setShippingCost(d.shippingCost ?? "");
    setFees(d.fees ?? "");
    setAdsCost(d.adsCost ?? "");
    setOrdersPerDay(d.ordersPerDay ?? "");
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
    : { background: "linear-gradient(135deg,#ecfdf5,#d1fae5)", color: "#064e3b" };

  const card = {
    background: darkMode ? "#020617" : "white",
    padding: 28,
    borderRadius: 20,
    maxWidth: 620,
    margin: "40px auto",
    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
    border: "1px solid #22c55e33",
    transition: "transform 0.35s cubic-bezier(.2,.8,.2,1), box-shadow 0.35s cubic-bezier(.2,.8,.2,1)"
  };

  const input = {
    width: "100%",
    padding: 12,
    marginTop: 6,
    marginBottom: 14,
    borderRadius: 10,
    border: "1px solid #22c55e55",
    outline: "none",
    transition: "all 0.2s ease"
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
    marginTop: 8,
    transition: "transform 0.15s ease, box-shadow 0.15s ease"
  };

  const tabBtn = (tab) => ({
    padding: "8px 14px",
    borderRadius: 10,
    border: "1px solid #22c55e",
    background: activeTab === tab ? "#22c55e" : "transparent",
    color: activeTab === tab ? "white" : darkMode ? "#4ade80" : "#065f46",
    cursor: "pointer",
    marginRight: 8,
    marginBottom: 12,
    transition: "all 0.2s ease"
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
    <div style={{ minHeight: "100vh", padding: 20, ...theme }}>
      <div
        style={card}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-10px) scale(1.01)";
          e.currentTarget.style.boxShadow = "0 25px 60px rgba(0,0,0,0.18)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.12)";
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <img
            src="/logo.png"
            alt="logo"
            style={{ width: 40, height: 40, transition: "transform 0.3s" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "rotate(10deg) scale(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "rotate(0) scale(1)")}
          />
          <h1 style={{ color: "#16a34a" }}>Dropship Profit Calculator</h1>
        </div>

        {/* Tabs */}
        <div>
          {["profit", "suggest", "graph", "currency"].map((t) => (
            <button key={t} style={tabBtn(t)} onClick={() => setActiveTab(t)}>
              {t === "profit"
                ? "Profit"
                : t === "suggest"
                ? "Suggested Prices"
                : t === "graph"
                ? "Graph"
                : "Currency"}
            </button>
          ))}
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
              <div key={label} style={{ animation: "fadeIn 0.4s ease" }}>
                <label style={{ fontWeight: 600 }}>{label} ({currency})</label>
                <input
                  type="number"
                  value={val}
                  placeholder="Enter amount"
                  onChange={(e) => set(e.target.value === "" ? "" : Number(e.target.value))}
                  style={input}
                />
              </div>
            ))}

            <button
              onClick={calculateProfit}
              style={greenBtn}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Calculate Profit
            </button>

            {profit !== null && (
              <div style={{ marginTop: 18, lineHeight: 1.8, animation: "fadeIn 0.5s ease" }}>
                <p><strong>Net Profit:</strong> {currency}{profit}</p>
                <p><strong>Margin:</strong> {margin}%</p>
                <p><strong>Break-even ROAS:</strong> {roas}x</p>
                <p><strong>Daily Profit:</strong> {currency}{dailyProfit}</p>
                <p><strong>Monthly Profit:</strong> {currency}{monthlyProfit}</p>
              </div>
            )}
          </>
        )}

        {/* SUGGESTED TAB */}
        {activeTab === "suggest" && (
          <div style={{ marginTop: 20, animation: "fadeIn 0.4s ease" }}>
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
          <div style={{ height: 300, marginTop: 20, animation: "fadeIn 0.4s ease" }}>
            <h3>Profit Graph</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* CURRENCY TAB */}
        {activeTab === "currency" && (
          <div style={{ marginTop: 20, animation: "fadeIn 0.4s ease" }}>
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
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Simple fade animation */}
      <style>{`@keyframes fadeIn { from {opacity:0; transform:translateY(6px);} to {opacity:1; transform:translateY(0);} }`}</style>
    </div>
  );
}
