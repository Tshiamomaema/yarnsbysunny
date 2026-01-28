// Cart Management System
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.init();
    }

    init() {
        this.injectCartHTML();
        this.updateCartUI();
        this.attachCartListeners();
        this.attachGlobalListeners();
    }

    injectCartHTML() {
        if (document.querySelector('.cart-sidebar')) return;

        const cartHTML = `
            <div class="cart-overlay"></div>
            <div class="cart-sidebar">
                <div class="cart-header">
                    <h3>Your Cart</h3>
                    <button class="close-cart" aria-label="Close cart">&times;</button>
                </div>
                <div class="cart-content">
                    <div class="cart-items">
                        <!-- Cart items will be added here dynamically -->
                    </div>
                    <div class="empty-cart">
                        <p>Your cart is empty</p>
                        <button class="cta-btn close-cart-btn" style="width: 100%; border:none; background: var(--primary-color); color: white; padding: 10px; cursor: pointer;">Continue Shopping</button>
                    </div>
                </div>
                <div class="cart-footer">
                    <div class="cart-total">
                        <span>Total:</span>
                        <span class="total-amount">R0.00</span>
                    </div>
                    <button class="checkout-btn">Proceed to Checkout</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', cartHTML);
    }

    loadCart() {
        const savedCart = localStorage.getItem('yarnsBySunnyCart');
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
        this.toggleCart(true);
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
        const totalAmount = document.querySelector('.total-amount');

        // Update all cart counters on the page
        document.querySelectorAll('.cart-count').forEach(el => {
            const count = this.getItemCount();
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });

        if (!cartItemsContainer) return;

        // Update total
        if (totalAmount) {
            totalAmount.textContent = `R${this.getTotal().toFixed(2)}`;
        }

        // Show/hide empty cart message
        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = '';
            if (emptyCart) emptyCart.style.display = 'block';
            document.querySelector('.cart-footer').style.display = 'none';
            return;
        }

        if (emptyCart) emptyCart.style.display = 'none';
        const footer = document.querySelector('.cart-footer');
        if (footer) footer.style.display = 'block';

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
                <button class="remove-item" data-id="${item.id}" data-size="${item.size}" aria-label="Remove item">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    attachCartListeners() {
        const sidebar = document.querySelector('.cart-sidebar');
        if (!sidebar) return;

        sidebar.addEventListener('click', (e) => {
            // Close Cart (from within sidebar)
            if (e.target.closest('.close-cart') || e.target.closest('.close-cart-btn')) {
                this.toggleCart(false);
            }

            // Checkout
            if (e.target.closest('.checkout-btn')) {
                e.preventDefault();
                this.checkoutViaWhatsApp();
            }

            // Cart Item Actions
            if (e.target.closest('.remove-item')) {
                const btn = e.target.closest('.remove-item');
                this.removeItem(btn.dataset.id, btn.dataset.size);
            }

            if (e.target.closest('.quantity-btn')) {
                const btn = e.target.closest('.quantity-btn');
                const cartItem = btn.closest('.cart-item');
                if (cartItem) {
                    const productId = cartItem.dataset.id;
                    const size = cartItem.dataset.size;
                    const currentQuantity = parseInt(cartItem.querySelector('.quantity-input').value);

                    if (btn.dataset.action === 'increase') {
                        this.updateQuantity(productId, size, currentQuantity + 1);
                    } else if (btn.dataset.action === 'decrease') {
                        this.updateQuantity(productId, size, currentQuantity - 1);
                    }
                }
            }
        });
    }

    attachGlobalListeners() {
        // Global listeners for events outside the cart sidebar
        document.addEventListener('click', (e) => {
            // Toggle Cart (Icon)
            if (e.target.closest('.cart-icon')) {
                e.preventDefault();
                this.toggleCart(true);
            }

            // Close Cart (Overlay)
            if (e.target.classList.contains('cart-overlay')) {
                this.toggleCart(false);
            }

            // Add to Cart (Global delegation)
            if (e.target.closest('.add-to-cart-btn')) {
                e.preventDefault();
                const btn = e.target.closest('.add-to-cart-btn');
                const productCard = btn.closest('.product-card');

                if (!productCard) return;

                const sizeSelector = productCard.querySelector('.size-selector');
                const selectedSize = sizeSelector ? sizeSelector.value : 'One Size';

                if (sizeSelector && !selectedSize) {
                    alert('Please select a size');
                    sizeSelector.focus();
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

                this.addItem(product);
            }
        });
    }

    toggleCart(show) {
        const sidebar = document.querySelector('.cart-sidebar');
        const overlay = document.querySelector('.cart-overlay');

        if (show) {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        } else {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
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
        // Remove existing notifications
        const existing = document.querySelector('.cart-notification');
        if (existing) existing.remove();

        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
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
