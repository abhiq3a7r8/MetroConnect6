
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const { TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SID } = process.env;

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    let { phone } = body;

    if (!phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Phone number is required" }),
      };
    }

    if (!phone.startsWith("+")) {
      phone = `+91${phone}`;
    }

    const response = await axios.post(
      `https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SID}/Verifications`,
      new URLSearchParams({ To: phone, Channel: "sms" }),
      {
        auth: {
          username: TWILIO_SID,
          password: TWILIO_AUTH_TOKEN,
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "OTP sent successfully",
        sid: response.data.sid,
      }),
    };
  } catch (err) {
    console.error("Error sending OTP:", err.response?.data || err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send OTP" }),
    };
  }
};
