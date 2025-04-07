require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all requests

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const otpStore = new Map(); // Temporary OTP storage

// Function to send OTP
const sendOtp = async (otp, userId) => {
    const message = `Your OTP code is: ${otp}`;
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    try {
        const response = await axios.post(url, {
            chat_id: CHAT_ID,
            text: message,
        });

        // Store OTP with expiry time (5 minutes)
        otpStore.set(userId, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

        return response.data;
    } catch (error) {
        console.error("Error sending OTP:", error);
        return null;
    }
};

app.get("/send-otp", async (req, res) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("Generated OTP:", otp);

    const key = otp.toString(); // Ensure it's a valid string key
    otpStore.set(key, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // Store properly

    const result = await sendOtp(otp);

    if (result) {
        res.json({ success: true, message: "OTP sent via Telegram" });
    } else {
        res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
});



// Verify OTP Route
app.post("/verify-otp", (req, res) => {
    const { otp } = req.body;
    console.log("Received OTP:", otp);
    console.log("Stored OTPs:", otpStore);

    const key = otp.toString(); // Ensure the key format is correct

    if (otpStore.has(key)) {
        const storedData = otpStore.get(key);

        if (storedData.expiresAt > Date.now()) {
            otpStore.delete(key); // OTP is valid, delete after use
            return res.json({ success: true, message: "OTP verified successfully" });
        }
    }

    return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
});



// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
