const express = require('express');
const bodyParser = require('body-parser');
const RiveScript = require('rivescript');

const app = express();
app.use(bodyParser.json());

const bot = new RiveScript();

bot.loadFile('./brain/brain.rive')
  .then(() => {
    bot.sortReplies();
    console.log('Chatbot ready!');
  })
  .catch((error) => {
    console.error('Error loading chatbot files:', error);
  });

app.post('/chatbot', async (req, res) => {
  console.log('Received request on /chatbot endpoint');
  console.log('Request body:', req.body);

  try {
    const userMessage = req.body.message;
    const botReply = await bot.reply('local-user', userMessage);
    res.json({ reply: botReply });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
