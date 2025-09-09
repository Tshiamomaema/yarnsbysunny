const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { message, conversationHistory } = JSON.parse(event.body);
        
        // Get API key from environment variables
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error('OpenAI API key not configured');
        }

        // Prepare the conversation history for the API
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
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: messages,
                temperature: 0.7,
                max_tokens: 150
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Error calling OpenAI API');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                reply: data.choices[0].message.content.trim()
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'An error occurred while processing your request.',
                details: error.message
            })
        };
    }
};
