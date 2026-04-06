import OpenAI from "openai";

export async function POST(req) {
  try {
    // ✅ MOVE IT HERE (inside function)
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const {
      type,
      message,
      history,
      businessName,
      services,
      repName,
      customerName
    } = await req.json();

    let systemPrompt = "";

    if (type === "receptionist") {
      systemPrompt = `
You are an AI receptionist for ${businessName}.

Representative: ${repName}
Services: ${services}

Speak to ${customerName} Keep responses short, friendly, and persuasive.
Always guide the customer toward booking or next steps.
Avoid sounding robotic. 
`;
    }

    if (type === "followup") {
      systemPrompt = `
You are following up with a lead for ${businessName}.

Representative: ${repName}
Customer: ${customerName}

Write a natural, friendly follow-up message.
`;
    }

    const messages = [
      { role: "system", content: systemPrompt },
      ...(history || []),
      { role: "user", content: message }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    return new Response(
      JSON.stringify({ reply: response.choices[0].message.content }),
      { status: 200 }
    );

  } catch (error) {
    console.error("API ERROR:", error);

    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    );
  }
}