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
        name: "New Lead",
        message: followMessage,
        response: data.reply,
        status: "New",
      },
    ]);

    fetchLeads();
    setFollowMessage("");
  };

  return (
    <div className="min-h-screen bg-purple-50 flex">

      {/* Sidebar */}
      <div className="w-64 bg-purple-700 text-white p-6">
        <h1 className="text-3xl font-bold mb-10">
          ABCA
        </h1>

        <div className="space-y-5 text-lg">
          <p className="hover:text-purple-200 cursor-pointer">
            Dashboard
          </p>
          <p className="hover:text-purple-200 cursor-pointer">
            Leads
          </p>
          <p className="hover:text-purple-200 cursor-pointer">
            Messages
          </p>
          <p className="hover:text-purple-200 cursor-pointer">
            Analytics
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            AI Business Communication Assistant
          </h1>

          <p className="text-gray-500 mt-2">
            Automate communication. Capture more leads.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-gray-500">Total Leads</h2>
            <p className="text-4xl font-bold text-purple-600">
              {savedLeads.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-gray-500">Booked</h2>
            <p className="text-4xl font-bold text-green-600">
              {
                savedLeads.filter(
                  (lead) => lead.status === "Booked"
                ).length
              }
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-gray-500">New Leads</h2>
            <p className="text-4xl font-bold text-blue-600">
              {
                savedLeads.filter(
                  (lead) => lead.status === "New"
                ).length
              }
            </p>
          </div>

        </div>

        {/* Main Panels */}
        <div className="grid grid-cols-2 gap-6">

          {/* Customer Inquiry */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">
              Customer Inquiry
            </h2>

            <div className="h-72 overflow-y-auto bg-gray-50 rounded-xl p-4 mb-4">
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
                    className={`px-4 py-2 rounded-xl max-w-xs ${
                      msg.role === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <textarea
              className="w-full border rounded-xl p-3 mb-4"
              placeholder="Type customer inquiry..."
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
            />

            <button
              onClick={sendMessage}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl"
            >
              Send Message
            </button>
          </div>

          {/* Follow Up */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">
              Lead Follow-Up
            </h2>

            <textarea
              className="w-full border rounded-xl p-3 mb-4"
              placeholder="Enter previous lead conversation..."
              value={followMessage}
              onChange={(e) =>
                setFollowMessage(e.target.value)
              }
            />

            <button
              onClick={generateFollowUp}
              className="bg-green-600 text-white px-6 py-3 rounded-xl"
            >
              Generate Follow-Up
            </button>

            <div className="mt-6 bg-gray-50 rounded-xl p-4">
              {followResponse || "Generated follow-up appears here"}
            </div>
          </div>
        </div>

        {/* Lead Dashboard */}
        <div className="bg-white rounded-2xl shadow p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">
            Lead Dashboard
          </h2>

          <div className="space-y-4">
            {savedLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex justify-between items-center border-b pb-3"
              >
                <div>
                  <h3 className="font-semibold">
                    {lead.name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {lead.response}
                  </p>
                </div>

                <span className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm">
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}