"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [savedLeads, setSavedLeads] = useState([]);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [followMessage, setFollowMessage] = useState("");
  const [followResponse, setFollowResponse] = useState("");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    setSavedLeads(data || []);
  };

  const sendMessage = async () => {
    if (!message) return;

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "receptionist",
        message,
      }),
    });

    const data = await res.json();

    setChat([
      ...chat,
      { role: "user", content: message },
      { role: "assistant", content: data.reply },
    ]);

    setMessage("");
  };

  const generateFollowUp = async () => {
    if (!followMessage) return;

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "followup",
        message: followMessage,
      }),
    });

    const data = await res.json();

    setFollowResponse(data.reply);

    await supabase.from("leads").insert([
      {
        name: "Lead",
        message: followMessage,
        response: data.reply,
        status: "New",
      },
    ]);

    fetchLeads();
    setFollowMessage("");
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* NAVBAR */}
      <div className="bg-purple-700 text-white px-8 py-5 shadow-md">
        <h1 className="text-2xl font-bold">
          AI Business Communication Assistant
        </h1>
        <p className="text-sm text-purple-200 mt-1">
          Automate inquiries • Follow up faster • Close more leads
        </p>
      </div>

      <div className="p-8">

        {/* METRICS */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-gray-500 text-sm">Total Leads</h2>
            <p className="text-3xl font-bold text-purple-600">
              {savedLeads.length}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-gray-500 text-sm">New Leads</h2>
            <p className="text-3xl font-bold text-blue-600">
              {
                savedLeads.filter(
                  (lead) => lead.status === "New"
                ).length
              }
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-gray-500 text-sm">Booked</h2>
            <p className="text-3xl font-bold text-green-600">
              {
                savedLeads.filter(
                  (lead) => lead.status === "Booked"
                ).length
              }
            </p>
          </div>

        </div>

        {/* MAIN PANELS */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* CUSTOMER INQUIRY */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Customer Inquiry
            </h2>

            <div className="h-72 overflow-y-auto bg-gray-50 rounded-lg p-4 mb-4">
              {chat.map((msg, i) => (
                <div
                  key={i}
                  className={`mb-3 flex ${
                    msg.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg max-w-xs ${
                      msg.role === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <textarea
              className="w-full border rounded-lg p-3 mb-4"
              placeholder="Type customer inquiry..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button
              onClick={sendMessage}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700"
            >
              Send Message
            </button>
          </div>

          {/* FOLLOW UP */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Lead Follow-Up
            </h2>

            <textarea
              className="w-full border rounded-lg p-3 mb-4"
              placeholder="Enter previous lead conversation..."
              value={followMessage}
              onChange={(e) =>
                setFollowMessage(e.target.value)
              }
            />

            <button
              onClick={generateFollowUp}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
            >
              Generate Follow-Up
            </button>

            <div className="mt-6 bg-gray-50 rounded-lg p-4 min-h-[120px]">
              {followResponse || "Generated response appears here"}
            </div>
          </div>
        </div>

        {/* LEAD DASHBOARD */}
        <div className="bg-white rounded-xl shadow p-6 mt-8">
          <h2 className="text-xl font-semibold mb-6">
            Lead Dashboard
          </h2>

          {savedLeads.length === 0 ? (
            <p className="text-gray-500">
              No leads yet
            </p>
          ) : (
            savedLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex justify-between items-center border-b py-4"
              >
                <div>
                  <h3 className="font-semibold">
                    {lead.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {lead.response}
                  </p>
                </div>

                <span className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm">
                  {lead.status}
                </span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}