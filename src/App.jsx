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
  const [platformFees, setPlatformFees] = useState("");
  const [adsCost, setAdsCost] = useState("");
  const [ordersPerDay, setOrdersPerDay] = useState("");

  const [profit, setProfit] = useState(0);
  const [margin, setMargin] = useState(0);
  const [roas, setRoas] = useState(0);
  const [dailyProfit, setDailyProfit] = useState(0);

  // Save history
  const [history, setHistory] = useState([]);

  // AUTO CALCULATION whenever values change
  useEffect(() => {
    const total =
      Number(productCost) +
      Number(shippingCost) +
      Number(platformFees) +
      Number(adsCost);

    const net = Number(sellingPrice) - total;
    const m = sellingPrice ? (net / Number(sellingPrice)) * 100 : 0;
    const r = adsCost ? Number(sellingPrice) / Number(adsCost) : 0;

    const dProfit = net * Number(ordersPerDay || 0);

    setProfit(net || 0);
    setMargin(m || 0);
    setRoas(r || 0);
    setDailyProfit(dProfit || 0);

    // Save to history only if selling price entered
    if (sellingPrice) {
      setHistory((prev) => [
        {
          time: new Date().toLocaleTimeString(),
          profit: net.toFixed(2),
          margin: m.toFixed(2),
          roas: r.toFixed(2)
        },
        ...prev.slice(0, 4)
      ]);
    }
  }, [sellingPrice, productCost, shippingCost, platformFees, adsCost, ordersPerDay]);

  const theme = darkMode
    ? { background: "#020617", color: "white" }
    : { background: "linear-gradient(135deg,#ecfdf5,#d1fae5)", color: "#064e3b" };

  const glassCard = {
    background: darkMode ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.6)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 20,
    padding: 24,
    transition: "all 0.35s ease",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
  };

  const liftHover = (e) => {
    e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
    e.currentTarget.style.boxShadow = "0 25px 60px rgba(0,0,0,0.25)";
  };

  const liftLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0) scale(1)";
    e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.15)";
  };

  const input = {
    width: "100%",
    padding: 12,
    marginTop: 6,
    marginBottom: 14,
    borderRadius: 10,
    border: "1px solid #22c55e55"
  };

  const statCard = {
    ...glassCard,
    textAlign: "center",
    cursor: "default"
  };

  const stats = [
    { label: "Profit", value: profit, prefix: currency },
    { label: "Margin", value: margin, suffix: "%" },
    { label: "ROAS", value: roas, suffix: "x" },
    { label: "Daily Profit", value: dailyProfit, prefix: currency }
  ];

  // Counting animation hook
  const useCountUp = (target) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const duration = 500;
      const stepTime = 16;
      const steps = duration / stepTime;
      const increment = target / steps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, stepTime);

      return () => clearInterval(timer);
    }, [target]);

    return Number(count).toFixed(2);
  };

  const CountCard = ({ s }) => {
    const animated = useCountUp(s.value);

    return (
      <div style={statCard} onMouseEnter={liftHover} onMouseLeave={liftLeave}>
        <div style={{ fontSize: 14, opacity: 0.7 }}>{s.label}</div>
        <div style={{ fontSize: 22, fontWeight: "bold", marginTop: 6 }}>
          {s.prefix}{animated}{s.suffix}
        </div>
      </div>
    );
  };

  const totalBaseCost =
    Number(productCost) + Number(shippingCost) + Number(platformFees) + Number(adsCost);

  const suggestedPrices = [20, 30, 50].map((m) => ({
    margin: m,
    price: totalBaseCost ? (totalBaseCost / (1 - m / 100)).toFixed(2) : 0
  }));

  const chartData = [
    { name: "Cost", value: totalBaseCost },
    { name: "Selling", value: Number(sellingPrice) || 0 },
    { name: "Profit", value: profit }
  ];

  return (
    <div style={{ minHeight: "100vh", padding: 30, ...theme }}>
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <img src="/logo.png" alt="logo" style={{ width: 42 }} />
        <h1 style={{ color: "#22c55e" }}>Dropship Profit Calculator</h1>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 16, marginBottom: 20 }}>
        {stats.map((s) => (
          <CountCard key={s.label} s={s} />
        ))}
      </div>

      {/* MAIN GLASS CARD */}
      <div style={{ ...glassCard }} onMouseEnter={liftHover} onMouseLeave={liftLeave}>

        {/* TABS */}
        <div style={{ marginBottom: 16 }}>
          {["profit", "suggest", "graph", "currency", "history"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              onMouseEnter={liftHover}
              onMouseLeave={liftLeave}
              style={{
                marginRight: 8,
                padding: "8px 14px",
                borderRadius: 10,
                border: "1px solid #22c55e",
                background: activeTab === t ? "#22c55e" : "transparent",
                color: activeTab === t ? "white" : "inherit",
                transition: "all 0.25s ease"
              }}
            >
              {t === "profit"
                ? "Profit"
                : t === "suggest"
                ? "Suggested Prices"
                : t === "graph"
                ? "Graph"
                : t === "currency"
                ? "Currency"
                : "History"}
            </button>
          ))}
        </div>

        {/* PROFIT TAB */}
        {activeTab === "profit" && (
          <>
            {[
              ["Selling Price", sellingPrice, setSellingPrice, true],
              ["Product Cost", productCost, setProductCost, true],
              ["Shipping", shippingCost, setShippingCost, true],
              ["Platform Fees", platformFees, setPlatformFees, true],
              ["Ad Cost", adsCost, setAdsCost, true],
              ["Orders/Day", ordersPerDay, setOrdersPerDay, false]
            ].map(([label, val, set, showCurrency]) => (
              <div key={label}>
                <label>
                  {label} {showCurrency && `(${currency})`}
                </label>
                <input
                  type="number"
                  value={val}
                  placeholder="Enter"
                  onChange={(e) => set(e.target.value)}
                  style={input}
                />
              </div>
            ))}
          </>
        )}

        {/* SUGGESTED */}
        {activeTab === "suggest" && (
          <div>
            {suggestedPrices.map((s) => (
              <p key={s.margin}>
                For {s.margin}% → <b>{currency}{s.price}</b>
              </p>
            ))}
          </div>
        )}

        {/* GRAPH */}
        {activeTab === "graph" && (
          <div style={{ height: 260 }}>
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

        {/* CURRENCY */}
        {activeTab === "currency" && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {currencies.map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                style={{ ...input, width: "auto", cursor: "pointer" }}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {/* HISTORY */}
        {activeTab === "history" && (
          <div>
            <h3>Recent Calculations</h3>
            {history.length === 0 && <p>No history yet.</p>}
            {history.map((h, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <strong>{h.time}</strong> → Profit {currency}{h.profit} | Margin {h.margin}% | ROAS {h.roas}x
              </div>
            ))}
          </div>
        )}
        {/* SEO CONTENT SECTION */}
<div style={{ marginTop: 40, lineHeight: 1.7, maxWidth: 900 }}>
  <h2>Dropship Profit Calculator – Free Shopify Profit & Margin Tool</h2>

  <p>
    This free dropship profit calculator helps ecommerce sellers instantly
    calculate profit, margin, ROAS, and daily earnings. Whether you run a
    Shopify store, print-on-demand business, or any online shop, understanding
    real profit is essential for success.
  </p>

  <h3>What is Dropshipping Profit?</h3>
  <p>
    Dropshipping profit is the money left after subtracting product cost,
    shipping, platform fees, and advertising costs from your selling price.
    Knowing this number helps you avoid losing money on ads.
  </p>

  <h3>Why Margin and ROAS Matter</h3>
  <p>
    Healthy dropshipping businesses usually target 20–40% profit margin and a
    ROAS above break-even. This calculator automatically shows these values so
    you can make smarter pricing decisions.
  </p>

  <h3>How to Use This Calculator</h3>
  <ul>
    <li>Enter selling price and product cost</li>
    <li>Add shipping, platform fees, and ad cost</li>
    <li>View instant profit, margin, ROAS, and daily earnings</li>
  </ul>

  <p>
    Use this free ecommerce tool before launching ads to make sure your product
    is truly profitable.
  </p>
</div>
      </div>
    </div>
  );
}
