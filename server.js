const express = require("express");
const OpenAI = require("openai");
const path = require("path");

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, context } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: context || "You are a portfolio assistant." },
        { role: "user", content: message },
      ],
      max_tokens: 250,
      temperature: 0.7,
    });

    const reply = completion.choices?.[0]?.message?.content || "";
    return res.json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "OpenAI error" });
  }
});

// Serve React build (Render)
app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Server running on", PORT));