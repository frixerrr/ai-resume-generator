const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config();
console.log("🔐 API Key loaded:", process.env.OPENAI_API_KEY);


const app = express();
app.use(cors());
app.use(express.json());

// ✅ Make sure you're using the right client and key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate-resume", async (req, res) => {
  const { name, education, experience, skills } = req.body;

  const prompt = `
Generate a professional and ATS-friendly resume for the following details:

Name: ${name}

Education:
- Degree: ${education.degree}
- Institution: ${education.institution}
- Year: ${education.year}

Work Experience:
- Title: ${experience.title}
- Company: ${experience.company}
- Duration: ${experience.duration}
- Description: ${experience.description}

Skills: ${skills}

Please format it cleanly with sections for Summary, Education, Work Experience, and Skills. Avoid using tables or images.
  `;

  console.log("🧠 Using model:", "gpt-3.5-turbo");

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // ✅ change is here!
      messages: [{ role: "user", content: prompt }],
    });

    const resumeText = completion.choices[0].message.content;
    res.json({ resume: resumeText });
  } catch (error) {
    console.error("Error generating resume:", error);
    res.status(500).json({ error: "Failed to generate resume" });
  }
});

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
