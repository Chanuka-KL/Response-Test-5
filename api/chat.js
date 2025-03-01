import OpenAI from "openai";
import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const app = express();
app.use(express.json());

const openai = new OpenAI({
    baseURL: "https://models.inference.ai.azure.com",
    apiKey: process.env.GITHUB_TOKEN
});

app.post("/api/chat", async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    try {
        const response = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful AI assistant." },
                { role: "user", content: message }
            ],
            model: "gpt-4o",
            temperature: 1,
            max_tokens: 4096
        });

        const reply = response.choices[0].message.content;
        res.json({ reply });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/api/tts", async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "xi-api-key": process.env.ELEVENLABS_API_KEY
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_turbo_v2",
                voice_settings: { stability: 0.5, similarity_boost: 0.5 }
            })
        });

        const audioBuffer = await response.arrayBuffer();
        res.set("Content-Type", "audio/mpeg");
        res.send(Buffer.from(audioBuffer));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
