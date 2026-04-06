import OpenAI from "openai";

export async function POST(req) {
  try {
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
You are a professional but friendly receptionist for ${businessName}.

Your job is to:
- Answer clearly and naturally
- Sound human, not robotic
- Be helpful and conversational
- Guide toward next steps naturally (like booking or asking for info)

IMPORTANT RULES:
- Do NOT repeat yourself
- Do NOT aggressively push booking
- Only suggest booking when it makes sense
- Keep responses short and natural
- Speak like a real person, not a script

Customer name: ${customerName}
Services: ${services}

Act like you're texting or chatting with a real customer.
`;
    }

    if (type === "followup") {
      systemPrompt = `
You are following up with a lead for a business.

Business: ${businessName}
Representative: ${repName}
Customer: ${customerName}

Your goal:
- Re-engage the lead naturally
- Sound friendly and human
- Do NOT sound pushy or salesy
- Keep it short and conversational

Write like a real person checking in, not a marketing message.
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