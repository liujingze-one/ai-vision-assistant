import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.use(cors());

app.use(
  express.json({
    limit: "20mb",
  })
);

app.post("/api/vision-chat", async (req, res) => {
  try {
    const { question, frames } = req.body;

    if (!question || !frames || frames.length === 0) {
      return res.status(400).json({
        error: "缺少问题或图像",
      });
    }

    const parts = [];

    parts.push({
      text: `
你是一个AI视觉助手。

用户问题：
${question}

请根据提供的连续画面进行分析，并用简洁中文回答。
`,
    });

    frames.forEach((frame) => {
      const base64Data = frame.replace(
        /^data:image\/jpeg;base64,/,
        ""
      );

      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      });
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts,
        },
      ],
    });

    res.json({
      answer: response.text,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Gemini调用失败",
    });
  }
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});