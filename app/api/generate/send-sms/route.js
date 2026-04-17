import twilio from "twilio";

export async function POST(req) {
  try {
    console.log("SMS ROUTE HIT");

    const { to, message } = await req.json();

    console.log("TO:", to);
    console.log("MESSAGE:", message);

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });

    console.log("TWILIO SUCCESS:", response.sid);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );

  } catch (error) {
    console.error("SMS ERROR:", error);

    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}