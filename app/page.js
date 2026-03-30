"use client";
import { useState } from "react";

export default function Home() {
  // BUSINESS INFO
  const [companyName, setCompanyName] = useState("");
  const [repName, setRepName] = useState("");
  const [services, setServices] = useState("");

  // RECEPTIONIST CHAT
  const [customerName, setCustomerName] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  // FOLLOW-UP
  const [followMessage, setFollowMessage] = useState("");
  const [followResponse, setFollowResponse] = useState("");

  const sendMessage = async () => {
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
        customerName
      }),
    });

    const data = await res.json();

    setChat([
      ...newHistory,
      { role: "assistant", content: data.reply }
    ]);

    setMessage("");
  };

  const generateFollowUp = async () => {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        type: "followup",
        message: followMessage,
        businessName: companyName,
        services,
        repName,
        customerName
      }),
    });

    const data = await res.json();
    setFollowResponse(data.reply);
  };

  return (
    <div style={container}>

      <h1>AI Business Communication Assistant</h1>

      {/* BUSINESS SETUP */}
      <div style={card}>
        <h3>Business Setup</h3>
        <input placeholder="Company Name" value={companyName} onChange={(e)=>setCompanyName(e.target.value)} style={input}/>
        <input placeholder="Rep Name" value={repName} onChange={(e)=>setRepName(e.target.value)} style={input}/>
        <input placeholder="Services" value={services} onChange={(e)=>setServices(e.target.value)} style={input}/>
      </div>

      <div style={grid}>

        {/* RECEPTIONIST CHAT */}
        <div style={card}>
          <h2>Customer Inquiry (AI Receptionist)</h2>

          <input
            placeholder="Customer Name"
            value={customerName}
            onChange={(e)=>setCustomerName(e.target.value)}
            style={input}
          />

          <div style={chatBox}>
            {chat.map((msg, i) => (
              <div key={i} style={{
                textAlign: msg.role === "user" ? "right" : "left"
              }}>
                <p><strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.content}</p>
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
            Send
          </button>
        </div>

        {/* FOLLOW-UP */}
        <div style={card}>
          <h2>Lead Follow-Up</h2>

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

// STYLES
const container = {
  background: "#0f172a",
  minHeight: "100vh",
  padding: "30px",
  color: "white",
  fontFamily: "Arial"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px"
};

const card = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "10px"
};

const input = {
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "6px",
  border: "none"
};

const textarea = {
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "6px",
  minHeight: "80px"
};

const button = {
  marginTop: "10px",
  padding: "10px",
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "6px"
};

const chatBox = {
  background: "#020617",
  padding: "10px",
  marginTop: "10px",
  height: "200px",
  overflowY: "auto",
  borderRadius: "6px"
};

const output = {
  marginTop: "10px",
  padding: "10px",
  background: "#020617",
  borderRadius: "6px"
};