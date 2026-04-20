import twilio from "twilio";

export async function POST(req) {
  try {
    console.log("SMS ROUTE HIT");

    const { to, message } = await req.json();

    if (!to || !message) {
      return new Response(
        JSON.stringify({ error: "Missing phone number or message" }),
        { status: 400 }
      );
    }

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const sms = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });

    console.log("SMS SENT:", sms.sid);

    return new Response(
      JSON.stringify({
        success: true,
        sid: sms.sid
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("SMS ERROR:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { status: 500 }
    );
  }
}