document.addEventListener('DOMContentLoaded', function() {
    // Chatbot state
    const chatbot = {
        isOpen: false,
        messages: [
            { 
                role: 'assistant',
                content: '👋 Hello! I\'m Sunny\'s assistant. How can I help you today?',
                time: new Date()
            }
        ],
        isTyping: false,
        
        // API Configuration
        config: {
            apiEndpoint: 'http://localhost:3001/api/chat', // Local API endpoint
            useLocalFallback: true, // Fallback to local responses if API is unavailable
            maxHistory: 5, // Number of messages to keep in context
            localResponses: {
                greetings: [
                    "Hello! I'm Sunny's assistant. How can I help you today?",
                    "Hi there! Welcome to Yarns by Sunny. What can I help you with?",
                    "Greetings! I'm here to assist you with any questions about our fashion collection."
                ],
                help: "I can help you with information about our products, business hours, and more. What would you like to know?",
                contact: "You can reach us at info@yarnsbysunny.com or call us at +27 69 702 7389. Our business hours are Monday to Friday, 9:00 AM to 5:00 PM.",
                products: "You can browse our collection on the Shop page. We offer a variety of stylish and sustainable fashion items.",
                fallback: "I'm having trouble connecting to the server. Please try again later or contact us directly at info@yarnsbysunny.com.",
                thanks: [
                    "You're welcome! Is there anything else I can help you with?",
                    "Happy to help! Let me know if you need anything else.",
                    "My pleasure! Feel free to ask if you have more questions."
                ]
            }
        },
        
        // Initialize the chatbot
        init() {
            this.createChatbotHTML();
            this.setupEventListeners();
            this.renderMessages();
        },
        
        // Create the chatbot HTML structure
        createChatbotHTML() {
            const chatContainer = document.createElement('div');
            chatContainer.className = 'chatbot-container';
            chatContainer.innerHTML = `
                <div class="chatbot-header">
                    <div class="chatbot-avatar">
                        <i class="fas fa-tshirt"></i>
                    </div>
                    <div class="chatbot-info">
                        <h4>Sunny's Assistant</h4>
                        <p>Online</p>
                    </div>
                    <button class="chatbot-close" aria-label="Close chat">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="chatbot-messages"></div>
                <div class="chatbot-suggestions">
                    <p>Quick questions:</p>
                    <div class="suggestion-buttons">
                        <button class="suggestion-btn">Business hours?</button>
                        <button class="suggestion-btn">Custom designs?</button>
                        <button class="suggestion-btn">Payment methods?</button>
                    </div>
                </div>
                <div class="chatbot-input">
                    <input type="text" placeholder="Type your message..." id="chatbot-input" aria-label="Type your message">
                    <button id="send-message" aria-label="Send message">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            `;
            
            document.body.appendChild(chatContainer);
            
            // Create the chat icon with notification badge
            const chatIcon = document.createElement('div');
            chatIcon.className = 'chatbot-icon';
            chatIcon.setAttribute('role', 'button');
            chatIcon.setAttribute('aria-label', 'Chat with us');
            chatIcon.setAttribute('tabindex', '0');
            chatIcon.innerHTML = `
                <i class="fas fa-comment-dots"></i>
                <div class="chatbot-notification" id="chat-notification">1</div>
            `;
            document.body.appendChild(chatIcon);
            
            // Add keyboard support for the chat icon
            chatIcon.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleChat();
                }
            });
        },
        
        // Set up event listeners
        setupEventListeners() {
            const chatIcon = document.querySelector('.chatbot-icon');
            const chatContainer = document.querySelector('.chatbot-container');
            const closeBtn = document.querySelector('.chatbot-close');
            const sendBtn = document.getElementById('send-message');
            const input = document.getElementById('chatbot-input');
            const suggestionBtns = document.querySelectorAll('.suggestion-btn');
            
            // Toggle chat window
            chatIcon.addEventListener('click', () => this.toggleChat());
            closeBtn.addEventListener('click', () => this.toggleChat());
            
            // Send message on button click or Enter key
            sendBtn.addEventListener('click', () => this.handleUserInput());
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleUserInput();
            });
            
            // Handle suggestion buttons
            suggestionBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    input.value = e.target.textContent.replace('?', '');
                    this.handleUserInput();
                });
            });
        },
        
        // Toggle chat window
        toggleChat() {
            const chatContainer = document.querySelector('.chatbot-container');
            const chatIcon = document.querySelector('.chatbot-icon');
            const notification = document.getElementById('chat-notification');
            
            this.isOpen = !this.isOpen;
            
            if (this.isOpen) {
                chatContainer.classList.add('active');
                chatIcon.style.opacity = '0';
                document.getElementById('chatbot-input').focus();
                
                // Remove notification when chat is opened
                if (notification) {
                    notification.style.display = 'none';
                }
            } else {
                chatContainer.classList.remove('active');
                setTimeout(() => {
                    chatIcon.style.opacity = '1';
                }, 300);
            }
        },
        
        // Handle user input
        async handleUserInput() {
            const input = document.getElementById('chatbot-input');
            const userMessage = input.value.trim().toLowerCase();
            
            if (userMessage && !this.isTyping) {
                // Add user message to chat
                this.addMessage('user', userMessage);
                input.value = '';
                
                // Show typing indicator
                this.isTyping = true;
                this.showTypingIndicator();
                
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Generate response based on user input
                let response = this.generateResponse(userMessage);
                
                // Remove typing indicator and add response
                this.removeTypingIndicator();
                this.addMessage('assistant', response);
                this.isTyping = false;
            }
        },
        
        // Generate response based on user input
        generateResponse(message) {
            // Greetings
            if (message.match(/^(hi|hello|hey|greetings|hola|what's up|howdy)/i)) {
                const greetings = this.config.localResponses.greetings;
                return greetings[Math.floor(Math.random() * greetings.length)];
            }
            
            // Help
            if (message.includes('help') || message.includes('what can you do')) {
                return this.config.localResponses.help;
            }
            
            // Contact information
            if (message.includes('contact') || message.includes('email') || message.includes('phone') || message.includes('number')) {
                return this.config.localResponses.contact;
            }
            
            // Products
            if (message.includes('product') || message.includes('collection') || message.includes('item') || message.includes('buy') || message.includes('shop')) {
                return this.config.localResponses.products;
            }
            
            // Business hours
            if (message.includes('hour') || message.includes('open') || message.includes('close') || message.includes('time')) {
                return "Our business hours are Monday to Friday, 9:00 AM to 5:00 PM. We're also open on Saturdays from 9:00 AM to 1:00 PM.";
            }
            
            // Location
            if (message.includes('where') && (message.includes('located') || message.includes('location') || message.includes('address'))) {
                return "We're located at 123 Fashion Street, Johannesburg, South Africa. Come visit us during business hours!";
            }
            
            // Price
            if (message.includes('price') || message.includes('cost') || message.includes('how much')) {
                return "Our prices vary depending on the item and customization. You can find all pricing information on our Shop page or contact us for custom orders.";
            }
            
            // Custom designs
            if (message.includes('custom') || message.includes('bespoke') || message.includes('personalized')) {
                return "Yes, we offer custom designs! You can share your ideas with us, and we'll work together to create something unique. Contact us for more details.";
            }
            
            // Payment methods
            if (message.includes('pay') || message.includes('payment') || message.includes('cash') || message.includes('card')) {
                return "We accept various payment methods including cash, credit/debit cards, and bank transfers. We also offer payment plans for larger orders.";
            }
            
            // Shipping
            if (message.includes('ship') || message.includes('delivery') || message.includes('deliver')) {
                return "We offer both local and international shipping. Delivery times and costs vary depending on your location. Contact us for specific shipping inquiries.";
            }
            
            // Thank you
            if (message.match(/thank|thanks|appreciate|grateful/i)) {
                const thanks = this.config.localResponses.thanks;
                return thanks[Math.floor(Math.random() * thanks.length)];
            }
            
            // Default response
            return "I'm sorry, I didn't understand that. Could you please rephrase your question or ask about our products, business hours, or contact information?";
        },
        
        // Show typing indicator
        showTypingIndicator() {
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'message bot typing';
            typingIndicator.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
            document.querySelector('.chatbot-messages').appendChild(typingIndicator);
            this.scrollToBottom();
        },
        
        // Remove typing indicator
        removeTypingIndicator() {
            const typingIndicator = document.querySelector('.typing');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        },
        
        // Show typing indicator
        showTypingIndicator() {
            const messagesContainer = document.querySelector('.chatbot-messages');
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'message assistant typing';
            typingIndicator.innerHTML = `
                <div class="typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            `;
            messagesContainer.appendChild(typingIndicator);
            this.scrollToBottom();
        },
        
        // Remove typing indicator
        removeTypingIndicator() {
            const typingIndicator = document.querySelector('.typing');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        },
        
        // Add a message to the chat
        addMessage(role, content) {
            const message = {
                role,
                content,
                time: new Date()
            };
            
            this.messages.push(message);
            this.renderMessages();
            this.scrollToBottom();
            
            // Keep only the last N messages for context
            if (this.messages.length > this.config.maxHistory * 2) {
                // Keep the system message and the last N messages
                this.messages = [
                    this.messages[0], // System message
                    ...this.messages.slice(-this.config.maxHistory * 2 + 1)
                ];
            }
            
            return message;
        },
        
        // Render all messages
        renderMessages() {
            const messagesContainer = document.querySelector('.chatbot-messages');
            messagesContainer.innerHTML = '';
            
            this.messages.forEach(message => {
                if (message.role === 'system') return; // Skip system messages in the UI
                
                const messageElement = document.createElement('div');
                messageElement.className = `message ${message.role}`;
                
                const timeString = new Date(message.time).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
                
                messageElement.innerHTML = `
                    <div class="message-content">
                        ${message.content}
                        <span class="message-time">${timeString}</span>
                    </div>
                `;
                
                messagesContainer.appendChild(messageElement);
            });
        },
        
        // Scroll to the bottom of the chat
        scrollToBottom() {
            const messagesContainer = document.querySelector('.chatbot-messages');
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    };
    
    // Initialize the chatbot
    chatbot.init();
});
