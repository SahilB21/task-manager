const {onRequest} = require("firebase-functions/v2/https");
const fetch = require("node-fetch");

exports.getMotivation = onRequest(
    {secrets: ["OPENAI_API_KEY"]},
    async (req, res) => {
    // Set CORS headers for the preflight request
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.set("Access-Control-Allow-Methods", "POST, OPTIONS");

      // Handle preflight OPTIONS request
      if (req.method === "OPTIONS") {
        return res.status(204).send("");
      }

      // Retrieve the API key from the environment
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      console.log("OPENAI_API_KEY exists:", !!OPENAI_API_KEY);

      try {
        const {taskText} = req.body;
        if (!taskText) {
          return res.status(400).json({error: "No task text provided."});
        }

        const messages = [
          {role: "system", content: "You are a helpful assistant that " +
            "provides motivational messages."},
          {role: "user", content: `Give a motivational message or " +
            "fun fact related to: "${taskText}"`},
        ];

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages,
            max_tokens: 50,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("OpenAI API Error:", errorData);
          return res.status(500).json({error: "Failed to fetch AI " +
            "message", details: errorData});
        }

        const data = await response.json();
        console.log("OpenAI API Response:", data);
        if (data.choices && data.choices[0].message) {
          return res.json({message: data.choices[0].message.content.trim()});
        } else {
          return res.status(500).json({error: "No valid message " +
            "found in API response."});
        }
      } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({error: "Server error"});
      }
    },
);
