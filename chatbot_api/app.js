const express = require('express');
const Groq = require('groq-sdk');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json());
const port = 3003;
const cors = require('cors');
app.use(cors());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Serve static files from the "public" directory
app.use(express.static('public'));

// Route to serve index.html at /chat
app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Endpoint to handle chat messages
app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  const Datas=req.body.UData
  const CHis = req.body.Chistory
  const userDataString = JSON.stringify(Datas);
  const chatHistoryString = JSON.stringify(CHis);
  try {
    const chatCompletion = await groq.chat.completions.create({

      messages: [
        {"role": "system", "content": `User Data: ${userDataString}, Chat History: ${chatHistoryString} (Don't send the chat history every time), make sure that max-prompt is set to 145 only so dont exceed above that`}
        ,{ "role": "user", "content": userMessage }
      ],

      model: "llama-3.1-70b-versatile",
      temperature:0.1,
      max_tokens:150,
      top_p:0.5
    });

    const reply = chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't process your message.";
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch chat completion' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
