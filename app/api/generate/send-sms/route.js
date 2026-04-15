import twilio from "twilio";

export async function POST(req) {
  try {
    const { to, message } = await req.json();

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });

    return new Response(JSON.stringify({ success: true, response }), {
      status: 200,
    });

  } catch (error) {
    console.error("SMS ERROR:", error);

    return new Response(JSON.stringify({ error: "SMS failed" }), {
      status: 500,
    });
  }
}