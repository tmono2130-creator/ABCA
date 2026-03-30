"use client";
import { useState } from "react";

export default function Home() {

  // =========================
  // CUSTOMER INQUIRY (SEPARATE)
  // =========================
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryBusiness, setInquiryBusiness] = useState("");
  const [inquiryServices, setInquiryServices] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  // =========================
  // LEAD FOLLOW-UP (SEPARATE)
  // =========================
  const [followRep, setFollowRep] = useState("");
  const [followCustomer, setFollowCustomer] = useState("");
  const [followMessage, setFollowMessage] = useState("");
  const [followResponse, setFollowResponse] = useState("");

  // =========================
  // RECEPTIONIST CHAT
  // =========================
  const sendMessage = async () => {
    if (!message) return;

    const newHistory = [...chat, { role: "user", content: message }];

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "receptionist",
        message,
        history: chat,
        businessName: inquiryBusiness,
        services: inquiryServices,
        repName: followRep,
        customerName: inquiryName
      }),
    });

    const data = await res.json();

    setChat([
      ...newHistory,
      { role: "assistant", content: data.reply }
    ]);

    setMessage("");
  };

  // =========================
  // FOLLOW-UP GENERATOR
  // =========================
  const generateFollowUp = async () => {
    if (!followMessage) return;

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "followup",
        message: followMessage,
        repName: followRep,
        customerName: followCustomer
      }),
    });

    const data = await res.json();
    setFollowResponse(data.reply);
    setFollowMessage("");
  };

  return (
    <div style={container}>

      <h1 style={{ marginBottom: "25px" }}>
        AI Business Communication Assistant
      </h1>

      <div style={grid}>

        {/* ================= CUSTOMER INQUIRY ================= */}
        <div style={card}>
          <h2>Customer Inquiry (AI Receptionist)</h2>

          <input
            placeholder="Customer Name"
            value={inquiryName}
            onChange={(e) => setInquiryName(e.target.value)}
            style={input}
          />

          <input
            placeholder="Business Name"
            value={inquiryBusiness}
            onChange={(e) => setInquiryBusiness(e.target.value)}
            style={input}
          />

          <input
            placeholder="Services"
            value={inquiryServices}
            onChange={(e) => setInquiryServices(e.target.value)}
            style={input}
          />

          {/* CHAT */}
          <div style={chatBox}>
            {chat.map((msg, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
              }}>
                <div style={{
                  background: msg.role === "user" ? "#7c3aed" : "#e2e8f0",
                  color: msg.role === "user" ? "white" : "black",
                  padding: "10px 14px",
                  borderRadius: "16px",
                  margin: "5px",
                  maxWidth: "70%"
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <textarea
            placeholder="Type customer message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={textarea}
          />

          <button onClick={sendMessage} style={button}>
            Send Message
          </button>
        </div>

        {/* ================= LEAD FOLLOW-UP ================= */}
        <div style={card}>
          <h2>Lead Follow-Up</h2>

          <input
            placeholder="Rep Name"
            value={followRep}
            onChange={(e) => setFollowRep(e.target.value)}
            style={input}
          />

          <input
            placeholder="Lead Name"
            value={followCustomer}
            onChange={(e) => setFollowCustomer(e.target.value)}
            style={input}
          />

          <textarea
            placeholder="Last interaction with lead..."
            value={followMessage}
            onChange={(e) => setFollowMessage(e.target.value)}
            style={textarea}
          />

          <button onClick={generateFollowUp} style={button}>
            Generate Follow-Up
          </button>

          <div style={output}>
            {followResponse || "Follow-up will appear here"}
          </div>
        </div>

      </div>
    </div>
  );
}

// ================= STYLES =================

const container = {
  background: "#0f172a", // dark professional
  minHeight: "100vh",
  padding: "30px",
  fontFamily: "Arial",
  color: "white"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px"
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "16px",
  color: "#1e293b",
  boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
};

const input = {
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd"
};

const textarea = {
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  minHeight: "80px"
};

const button = {
  marginTop: "10px",
  padding: "12px",
  background: "#7c3aed",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold"
};

const chatBox = {
  background: "#f8fafc",
  padding: "10px",
  marginTop: "10px",
  height: "200px",
  overflowY: "auto",
  borderRadius: "10px"
};

const output = {
  marginTop: "10px",
  padding: "10px",
  background: "#f1f5f9",
  borderRadius: "10px"
};