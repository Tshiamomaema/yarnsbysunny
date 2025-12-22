// Cart Management System
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.init();
    }

    init() {
        this.updateCartUI();
        this.attachEventListeners();
    }

    loadCart() {
        const savedCart = localStorage.getItem('yarnsBySubmit cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    saveCart() {
        localStorage.setItem('yarnsBySunnyCart', JSON.stringify(this.items));
    }

    addItem(product) {
        const existingItem = this.items.find(item => 
            item.id === product.id && item.size === product.size
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartUI();
        this.showNotification('Item added to cart!');
    }

    removeItem(productId, size) {
        this.items = this.items.filter(item => 
            !(item.id === productId && item.size === size)
        );
        this.saveCart();
        this.updateCartUI();
    }

    updateQuantity(productId, size, newQuantity) {
        const item = this.items.find(item => 
            item.id === productId && item.size === size
        );

        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(productId, size);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => 
            total + (item.price * item.quantity), 0
        );
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    updateCartUI() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const emptyCart = document.querySelector('.empty-cart');
        const cartCount = document.querySelector('.cart-count');
        const totalAmount = document.querySelector('.total-amount');

        if (!cartItemsContainer) return;

        // Update cart count badge
        if (cartCount) {
            const count = this.getItemCount();
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'flex' : 'none';
        }

        // Update total
        if (totalAmount) {
            totalAmount.textContent = `R${this.getTotal().toFixed(2)}`;
        }

        // Show/hide empty cart message
        if (this.items.length === 0) {
            if (cartItemsContainer) cartItemsContainer.innerHTML = '';
            if (emptyCart) emptyCart.style.display = 'block';
            return;
        }

        if (emptyCart) emptyCart.style.display = 'none';

        // Render cart items
        cartItemsContainer.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}" data-size="${item.size}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Size: ${item.size}</p>
                    <p>R${item.price.toFixed(2)}</p>
                    <div class="quantity-selector">
                        <button class="quantity-btn" data-action="decrease">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" readonly>
                        <button class="quantity-btn" data-action="increase">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}" data-size="${item.size}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');

        // Reattach event listeners for cart items
        this.attachCartItemListeners();
    }

    attachEventListeners() {
        // Cart icon click
        const cartIcon = document.querySelector('.cart-icon');
        const cartSidebar = document.querySelector('.cart-sidebar');
        const closeCart = document.querySelector('.close-cart');
        const cartOverlay = document.querySelector('.cart-overlay');

        if (cartIcon && cartSidebar) {
            cartIcon.addEventListener('click', (e) => {
                e.preventDefault();
                cartSidebar.classList.add('active');
                if (cartOverlay) cartOverlay.classList.add('active');
            });
        }

        if (closeCart && cartSidebar) {
            closeCart.addEventListener('click', () => {
                cartSidebar.classList.remove('active');
                if (cartOverlay) cartOverlay.classList.remove('active');
            });
        }

        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => {
                cartSidebar.classList.remove('active');
                cartOverlay.classList.remove('active');
            });
        }

        // WhatsApp checkout
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.checkoutViaWhatsApp();
            });
        }
    }

    attachCartItemListeners() {
        // Remove item buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.dataset.id;
                const size = btn.dataset.size;
                this.removeItem(productId, size);
            });
        });

        // Quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const cartItem = btn.closest('.cart-item');
                const productId = cartItem.dataset.id;
                const size = cartItem.dataset.size;
                const quantityInput = cartItem.querySelector('.quantity-input');
                const currentQuantity = parseInt(quantityInput.value);

                if (btn.dataset.action === 'increase') {
                    this.updateQuantity(productId, size, currentQuantity + 1);
                } else if (btn.dataset.action === 'decrease') {
                    this.updateQuantity(productId, size, currentQuantity - 1);
                }
            });
        });
    }

    checkoutViaWhatsApp() {
        if (this.items.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        let message = "Hi Sunny, I'd like to purchase:\n\n";
        
        this.items.forEach((item, index) => {
            message += `${index + 1}. ${item.name}\n`;
            message += `   Size: ${item.size}\n`;
            message += `   Quantity: ${item.quantity}\n`;
            message += `   Price: R${(item.price * item.quantity).toFixed(2)}\n\n`;
        });

        message += `Total: R${this.getTotal().toFixed(2)}`;

        const whatsappNumber = '27697027389';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--accent-color, #c8a97e);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Add to cart functionality for product cards
function setupProductCards() {
    document.querySelectorAll('.buy-now-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productCard = this.closest('.product-card');
            if (!productCard) return;

            const sizeSelector = productCard.querySelector('.size-selector');
            const selectedSize = sizeSelector ? sizeSelector.value : '';

            if (!selectedSize) {
                alert('Please select a size');
                return;
            }

            const product = {
                id: productCard.dataset.id,
                name: productCard.querySelector('.product-title').textContent,
                price: parseFloat(productCard.dataset.price),
                category: productCard.dataset.category,
                size: selectedSize,
                image: productCard.querySelector('.product-image img').src
            };

            // Single item WhatsApp purchase
            const message = `Hi Sunny, I'd like to purchase:\n\n${product.name}\nSize: ${product.size}\nPrice: R${product.price.toFixed(2)}`;
            const whatsappUrl = `https://wa.me/27697027389?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupProductCards);
} else {
    setupProductCards();
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
