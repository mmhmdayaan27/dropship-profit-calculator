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
      const p =
        Number(sellingPrice) -
        (Number(productCost) + Number(shippingCost) + Number(fees) + i);
      data.push({ adCost: Math.round(i), profit: Math.round(p) });
    }

    setChartData(data);
    setProfit(netProfit);
    setMargin(profitMargin.toFixed(2));
    setRoas(breakEvenRoas.toFixed(2));
    setDailyProfit(dayProfit.toFixed(2));
    setMonthlyProfit(monthProfit.toFixed(2));
  };

  const totalBaseCost =
    Number(productCost) +
    Number(shippingCost) +
    Number(fees) +
    Number(adsCost);

  const suggestedPrices = [20, 30, 50].map((m) => {
    const price = totalBaseCost / (1 - m / 100 || 1);
    return { margin: m, price: price ? price.toFixed(0) : 0 };
  });

  const currencies = ["₹", "$", "AED"];

  const cardBase = darkMode
    ? "bg-slate-800 text-white border border-slate-700"
    : "bg-white";

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 transition-colors ${
        darkMode
          ? "bg-slate-900 text-white"
          : "bg-gradient-to-br from-slate-50 to-slate-200"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl space-y-6"
      >
        {/* Header */}
        <div className={`rounded-3xl shadow-2xl p-6 text-center space-y-4 ${cardBase}`}>
          <h1 className="text-3xl font-bold text-green-500">
            Dropship Profit Calculator
          </h1>
          <p className="text-sm opacity-70">
            Estimate profit, margins, and break-even performance
          </p>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {/* Dark Mode Switch */}
            <label className="flex items-center gap-2 cursor-pointer">
              🌙
              <div
                className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors ${
                  darkMode ? "bg-green-500" : "bg-gray-400"
                }`}
                onClick={() => setDarkMode(!darkMode)}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    darkMode ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
            </label>

            <button onClick={saveData}>💾 Save</button>
            <button onClick={loadData}>📂 Load</button>
          </div>

          {/* Currency */}
          <div className="flex justify-center gap-2">
            {currencies.map((c) => (
              <button key={c} onClick={() => setCurrency(c)}>
                {c}
              </button>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-2">
            {["profit", "suggest", "graph"].map((t) => (
              <button key={t} onClick={() => setActiveTab(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Profit Tab */}
        {activeTab === "profit" && (
          <div className={`rounded-3xl shadow-xl p-8 space-y-6 ${cardBase}`}>
            {[
              ["Selling Price", sellingPrice, setSellingPrice],
              ["Product Cost", productCost, setProductCost],
              ["Shipping Charges", shippingCost, setShippingCost],
              ["Gateway Fees", fees, setFees],
              ["Ad Cost / Order", adsCost, setAdsCost],
              ["Orders Per Day", ordersPerDay, setOrdersPerDay]
            ].map(([label, value, setter]) => (
              <div key={label}>
                <label>{label}</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                />
              </div>
            ))}

            <button onClick={calculateProfit}>Calculate Profit</button>

            {profit !== null && (
              <div>
                <p>Net Profit: {currency}{profit}</p>
                <p>Margin: {margin}%</p>
                <p>Break-even ROAS: {roas}x</p>
                <p>Daily Profit: {currency}{dailyProfit}</p>
                <p>Monthly Profit: {currency}{monthlyProfit}</p>
              </div>
            )}
          </div>
        )}

        {/* Suggested Prices */}
        {activeTab === "suggest" && (
          <div className={`rounded-3xl shadow-xl p-8 ${cardBase}`}>
            {suggestedPrices.map((s) => (
              <p key={s.margin}>
                {s.margin}% → {currency}{s.price}
              </p>
            ))}
          </div>
        )}

        {/* Graph */}
        {activeTab === "graph" && chartData.length > 0 && (
          <div className={`rounded-3xl shadow-xl p-8 ${cardBase}`}>
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
