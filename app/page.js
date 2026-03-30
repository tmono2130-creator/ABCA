"use client";
import { useState } from "react";

export default function Home() {

  // BUSINESS (GLOBAL)
  const [companyName, setCompanyName] = useState("");
  const [repName, setRepName] = useState("");
  const [services, setServices] = useState("");

  // RECEPTIONIST (CHAT)
  const [customerNameInquiry, setCustomerNameInquiry] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  // FOLLOW UP (SEPARATE)
  const [customerNameFollow, setCustomerNameFollow] = useState("");
  const [followMessage, setFollowMessage] = useState("");
  const [followResponse, setFollowResponse] = useState("");

  // ========================
  // RECEPTIONIST CHAT
  // ========================
  const sendMessage = async () => {
    if (!message) return;

    const newHistory = [
      ...chat,
      { role: "user", content: message }
    ];

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        type: "receptionist",
        message,
        history: chat,
        businessName: companyName,
        services,
        repName,
        customerName: customerNameInquiry
      }),
    });

    const data = await res.json();

    setChat([
      ...newHistory,
      { role: "assistant", content: data.reply }
    ]);

    setMessage(""); // clear input
  };

  // ========================
  // FOLLOW UP
  // ========================
  const generateFollowUp = async () => {
    if (!followMessage) return;

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        type: "followup",
        message: followMessage,
        businessName: companyName,
        services,
        repName,
        customerName: customerNameFollow
      }),
    });

    const data = await res.json();

    setFollowResponse(data.reply);
    setFollowMessage(""); // clear after
  };

  return (
    <div style={container}>

      <h1 style={{marginBottom: "20px"}}>
        AI Business Communication Assistant
      </h1>

      {/* BUSINESS SETUP */}
      <div style={card}>
        <h3>Business Setup</h3>

        <input
          placeholder="Company Name"
          value={companyName}
          onChange={(e)=>setCompanyName(e.target.value)}
          style={input}
        />

        <input
          placeholder="Rep Name"
          value={repName}
          onChange={(e)=>setRepName(e.target.value)}
          style={input}
        />

        <input
          placeholder="Services"
          value={services}
          onChange={(e)=>setServices(e.target.value)}
          style={input}
        />
      </div>

      {/* GRID */}
      <div style={grid}>

        {/* ================= RECEPTIONIST ================= */}
        <div style={card}>
          <h2>Customer Inquiry (AI Receptionist)</h2>

          <input
            placeholder="Customer Name"
            value={customerNameInquiry}
            onChange={(e)=>setCustomerNameInquiry(e.target.value)}
            style={input}
          />

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
            placeholder="Type message..."
            value={message}
            onChange={(e)=>setMessage(e.target.value)}
            style={textarea}
          />

          <button onClick={sendMessage} style={button}>
            Send Message
          </button>
        </div>

        {/* ================= FOLLOW-UP ================= */}
        <div style={card}>
          <h2>Lead Follow-Up</h2>

          <input
            placeholder="Customer Name"
            value={customerNameFollow}
            onChange={(e)=>setCustomerNameFollow(e.target.value)}
            style={input}
          />

          <textarea
            placeholder="Last conversation..."
            value={followMessage}
            onChange={(e)=>setFollowMessage(e.target.value)}
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
  background: "#E6E6FA", // lavender
  minHeight: "100vh",
  padding: "30px",
  fontFamily: "Arial",
  color: "#1e293b"
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
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
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