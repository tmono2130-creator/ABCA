import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
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

Speak to the customer (${customerName}) in a professional, friendly tone.
Help them book, ask questions, or move forward.
Keep responses concise.
`;
    }

    if (type === "followup") {
      systemPrompt = `
You are following up with a lead for ${businessName}.

Representative: ${repName}
Customer: ${customerName}

Write a friendly, natural follow-up that encourages a reply or booking.
Do not sound robotic or pushy.
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