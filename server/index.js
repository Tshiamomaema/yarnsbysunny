require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        // Prepare messages array with system message and conversation history
        const messages = [
            {
                role: 'system',
                content: `You are a helpful assistant for Yarns by Sunny, a fashion brand. 
                Be friendly, professional, and helpful. Keep responses concise. 
                If asked about products, direct users to the shop page. 
                For order inquiries, ask for order details.`
            },
            ...conversationHistory,
            { role: 'user', content: message }
        ];

        // Call OpenAI API
        const completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: messages,
            temperature: 0.7,
            max_tokens: 150
        });

        // Send back the AI's response
        res.json({
            reply: completion.data.choices[0].message.content.trim()
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'An error occurred while processing your request.',
            details: error.message
        });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
