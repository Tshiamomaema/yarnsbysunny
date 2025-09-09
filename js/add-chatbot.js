// This script will be used to add the chatbot to all pages
function addChatbotToPage() {
    // Add chatbot CSS
    const chatbotCSS = document.createElement('link');
    chatbotCSS.rel = 'stylesheet';
    chatbotCSS.href = 'css/chatbot.css';
    document.head.appendChild(chatbotCSS);
    
    // Add Font Awesome if not already included
    let fontAwesomeIncluded = false;
    const links = document.getElementsByTagName('link');
    for (let link of links) {
        if (link.href && link.href.includes('font-awesome')) {
            fontAwesomeIncluded = true;
            break;
        }
    }
    
    if (!fontAwesomeIncluded) {
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
        document.head.appendChild(fontAwesome);
    }
    
    // Add chatbot script
    const chatbotScript = document.createElement('script');
    chatbotScript.src = 'js/chatbot.js';
    document.body.appendChild(chatbotScript);
}

// Call the function when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addChatbotToPage);
} else {
    addChatbotToPage();
}
