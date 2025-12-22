// Shop page functionality
document.addEventListener('DOMContentLoaded', function () {
    // Initialize WhatsApp buy buttons
    setupBuyNowButtons();

    // Category filter
    const categoryFilter = document.getElementById('category');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }

    // Sort functionality
    const sortFilter = document.getElementById('sort');
    if (sortFilter) {
        sortFilter.addEventListener('change', sortProducts);
    }
});

function setupBuyNowButtons() {
    document.querySelectorAll('.buy-now-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            const productCard = this.closest('.product-card');
            if (!productCard) return;

            const sizeSelector = productCard.querySelector('.size-selector');
            const selectedSize = sizeSelector ? sizeSelector.value : '';

            if (!selectedSize) {
                alert('Please select a size before purchasing');
                sizeSelector.focus();
                return;
            }

            const productName = productCard.querySelector('.product-title').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent;
            const category = productCard.dataset.category;

            // Create WhatsApp message
            const message = `Hi Sunny!

I'd like to purchase:
━━━━━━━━━━━━━━━━
Product: ${productName}
Category: ${category}
Size: ${selectedSize}
Price: ${productPrice}
━━━━━━━━━━━━━━━━

Looking forward to your response!`;

            const whatsappNumber = '27697027389';
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

            // Open WhatsApp in new tab
            window.open(whatsappUrl, '_blank');
        });
    });
}

function filterProducts() {
    const selectedCategory = document.getElementById('category').value;
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const cardCategory = card.dataset.category.toLowerCase();

        if (selectedCategory === 'all' || cardCategory === selectedCategory.toLowerCase()) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease-in';
        } else {
            card.style.display = 'none';
        }
    });
}

function sortProducts() {
    const sortValue = document.getElementById('sort').value;
    const productsGrid = document.querySelector('.products-grid');
    const productCards = Array.from(document.querySelectorAll('.product-card'));

    productCards.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);

        switch (sortValue) {
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            case 'newest':
                // Assuming newer items have higher IDs
                return b.dataset.id.localeCompare(a.dataset.id);
            default:
                // Featured - maintain original order
                return 0;
        }
    });

    // Re-append sorted cards
    productCards.forEach(card => productsGrid.appendChild(card));
}

// Add fade-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .product-card {
        animation: fadeIn 0.5s ease-in;
    }
`;
document.head.appendChild(style);
