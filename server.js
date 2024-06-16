const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const googleIA = require("@google/generative-ai");

const genAI = new googleIA.GoogleGenerativeAI(process.env.API_KEY);
const modelImage = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
});
const modelText = genAI.getGenerativeModel({ model: "gemini-pro" });

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.listen(3001, () => {
  console.log("server listening on port 3001");
});

app.post("/gemini/image", async (req, res) => {
  try {
    const image = req.body.image;
    const response = await modelImage.generateContent([image]);
    const text = response.response.text();
    res.json({ response: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

app.post("/gemini/text", async (req, res) => {
  try {
    const template = req.body.template;
    const response = await modelText.generateContent(template);
    const text = response.response.text();
    res.json({ response: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});
