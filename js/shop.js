// Shop page functionality
let allProducts = [];

document.addEventListener('DOMContentLoaded', async function () {
    // Fetch products
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) throw new Error('Failed to load products');
        allProducts = await response.json();

        // Initial render
        renderProducts(allProducts);

        // Setup filters
        setupFilters();
    } catch (error) {
        console.error('Error loading products:', error);
        document.querySelector('.products-grid').innerHTML = '<p class="error-message">Sorry, we couldn\'t load the products. Please try again later.</p>';
    }
});

function createProductCard(product) {
    const div = document.createElement('div');
    div.className = 'product-card fade-in';
    div.dataset.id = product.id;
    div.dataset.category = product.category;
    div.dataset.price = product.price;

    const badgeHtml = product.badge ? `<span class="${product.badge.toLowerCase() === 'new' ? 'new-badge' : 'sale-badge'}">${product.badge}</span>` : '';
    const sizeOptions = product.sizes.map(size => `<option value="${size}">${size}</option>`).join('');

    div.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            ${badgeHtml}
        </div>
        <div class="product-info">
            <span class="product-category">${capitalizeFirstLetter(product.category)}</span>
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">
                <span class="current-price">R${product.price.toFixed(2)}</span>
            </div>
            <select class="size-selector" aria-label="Select size">
                <option value="">Select Size</option>
                ${sizeOptions}
            </select>
            <button class="add-to-cart-btn" data-id="${product.id}">
                <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
        </div>
    `;
    return div;
}

function renderProducts(products) {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;

    const fragment = document.createDocumentFragment();
    const existingCards = new Map();

    // Index existing cards
    productsGrid.querySelectorAll('.product-card').forEach(card => {
        const id = card.dataset.id;
        if (id) existingCards.set(id, card);
    });

    // Clear grid to ensure we only have what we want
    productsGrid.innerHTML = '';

    products.forEach((product, index) => {
        let card = existingCards.get(product.id);

        if (!card) {
            card = createProductCard(product);
        }

        // Update animation delay
        card.style.animationDelay = `${index * 0.1}s`;

        // Ensure fade-in class is present
        if (!card.classList.contains('fade-in')) {
            card.classList.add('fade-in');
        }

        fragment.appendChild(card);
    });

    productsGrid.appendChild(fragment);
}

function setupFilters() {
    const categoryFilter = document.getElementById('category');
    const sortFilter = document.getElementById('sort');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterAndSortProducts);
    }

    if (sortFilter) {
        sortFilter.addEventListener('change', filterAndSortProducts);
    }
}

function filterAndSortProducts() {
    const category = document.getElementById('category').value;
    const sortValue = document.getElementById('sort').value;

    let filtered = allProducts;

    // Filter by category
    if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
        switch (sortValue) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'newest':
                // Assuming ID or specific field indicates newness. For now using ID descending.
                return b.id.localeCompare(a.id);
            default: // featured
                return 0; // Original order
        }
    });

    renderProducts(filtered);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Add CSS for animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .product-card.fade-in {
        animation: fadeIn 0.5s ease forwards;
        opacity: 0; /* Start hidden */
    }

    .new-badge, .sale-badge {
        position: absolute;
        top: 15px;
        right: 15px;
        color: white;
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .new-badge {
        background-color: var(--primary-color, #1a1a1a);
    }

    .sale-badge {
        background-color: var(--accent-color, #c8a97e);
    }

    .add-to-cart-btn {
        width: 100%;
        padding: 12px;
        background-color: var(--primary-color, #1a1a1a);
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: 10px;
    }

    .add-to-cart-btn:hover {
        background-color: var(--accent-color, #c8a97e);
        transform: translateY(-2px);
    }
`;
document.head.appendChild(style);
