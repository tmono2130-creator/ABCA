"use client";
import { useState } from "react";

export default function Home() {

  // ================= INQUIRY =================
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryBusiness, setInquiryBusiness] = useState("");
  const [inquiryServices, setInquiryServices] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  // ================= FOLLOW UP =================
  const [followRep, setFollowRep] = useState("");
  const [followCustomer, setFollowCustomer] = useState("");
  const [followMessage, setFollowMessage] = useState("");
  const [followResponse, setFollowResponse] = useState("");

  // ================= SAVED LEADS =================
  const [savedLeads, setSavedLeads] = useState([]);

  // ================= SEND MESSAGE =================
  const sendMessage = async () => {
    if (!message) return;

    const newHistory = [...chat, { role: "user", content: message }];

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        type: "receptionist",
        message,
        history: chat,
        businessName: inquiryBusiness,
        services: inquiryServices,
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

  // ================= FOLLOW UP =================
  const generateFollowUp = async () => {
    if (!followMessage) return;

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        type: "followup",
        message: followMessage,
        repName: followRep,
        customerName: followCustomer
      }),
    });

    const data = await res.json();

    setFollowResponse(data.reply);

    // SAVE LEAD
    setSavedLeads([
      ...savedLeads,
      {
        name: followCustomer,
        response: data.reply
      }
    ]);

    setFollowMessage("");
  };

  return (
    <div style={container}>

      <h1 style={title}>AI Business Communication Assistant</h1>

      <div style={grid}>

        {/* ================= INQUIRY ================= */}
        <div style={card}>
          <h2>Customer Inquiry</h2>

          <input placeholder="Customer Name" value={inquiryName} onChange={(e)=>setInquiryName(e.target.value)} style={input}/>
          <input placeholder="Business Name" value={inquiryBusiness} onChange={(e)=>setInquiryBusiness(e.target.value)} style={input}/>
          <input placeholder="Services" value={inquiryServices} onChange={(e)=>setInquiryServices(e.target.value)} style={input}/>

          <div style={chatBox}>
            {chat.map((msg, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
              }}>
                <div style={{
                  background: msg.role === "user" ? "#6366f1" : "#e2e8f0",
                  color: msg.role === "user" ? "white" : "black",
                  padding: "10px",
                  borderRadius: "12px",
                  margin: "5px",
                  maxWidth: "70%"
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <textarea placeholder="Type message..." value={message} onChange={(e)=>setMessage(e.target.value)} style={textarea}/>

          <button onClick={sendMessage} style={button}>Send</button>
          <button onClick={()=>setChat([])} style={secondaryButton}>Clear Chat</button>
        </div>

        {/* ================= FOLLOW UP ================= */}
        <div style={card}>
          <h2>Lead Follow-Up</h2>

          <input placeholder="Rep Name" value={followRep} onChange={(e)=>setFollowRep(e.target.value)} style={input}/>
          <input placeholder="Lead Name" value={followCustomer} onChange={(e)=>setFollowCustomer(e.target.value)} style={input}/>
          <textarea placeholder="Last interaction..." value={followMessage} onChange={(e)=>setFollowMessage(e.target.value)} style={textarea}/>

          <button onClick={generateFollowUp} style={button}>Generate Follow-Up</button>

          <div style={output}>{followResponse}</div>

          <button style={secondaryButton}>Send via SMS (Coming Soon)</button>
        </div>

      </div>

      {/* ================= SAVED LEADS ================= */}
      <div style={card}>
        <h2>Saved Leads</h2>

        {savedLeads.map((lead, i) => (
          <div key={i} style={leadCard}>
            <strong>{lead.name}</strong>
            <p>{lead.response}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

// ================= STYLES =================

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
  background: "white",
  color: "#1e293b",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "20px"
};

const input = {
  width: "100%",
  marginTop: "10px",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd"
};

const textarea = {
  width: "100%",
  marginTop: "10px",
  padding: "10px",
  borderRadius: "8px",
  minHeight: "80px"
};

const button = {
  marginTop: "10px",
  padding: "10px",
  background: "#6366f1",
  color: "white",
  border: "none",
  borderRadius: "8px"
};

const secondaryButton = {
  marginTop: "10px",
  padding: "10px",
  background: "#e2e8f0",
  border: "none",
  borderRadius: "8px"
};

const chatBox = {
  background: "#f1f5f9",
  height: "200px",
  overflowY: "auto",
  marginTop: "10px",
  padding: "10px",
  borderRadius: "8px"
};

const output = {
  marginTop: "10px",
  padding: "10px",
  background: "#f1f5f9",
  borderRadius: "8px"
};

const leadCard = {
  marginTop: "10px",
  padding: "10px",
  background: "#f8fafc",
  borderRadius: "8px"
};

const title = {
  marginBottom: "20px"
};