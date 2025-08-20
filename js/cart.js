// Cart functionality
let cart = [];

// Function to get cart from localStorage
function getCartFromStorage() {
    try {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
        console.error('Error reading cart from storage:', e);
        return [];
    }
}

// Initialize cart from localStorage
function initCart() {
    cart = getCartFromStorage();
    if (!Array.isArray(cart)) {
        cart = [];
        saveCart();
    }
    updateCartCount();
}

// Add to cart functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
        const productCard = e.target.closest('.product-card');
        const productId = productCard.dataset.id;
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = parseFloat(productCard.dataset.price) || 0;
        const productImage = productCard.querySelector('img').src;
        const sizeSelector = productCard.querySelector('.size-selector');
        const selectedSize = sizeSelector ? sizeSelector.value : null;
        
        // Validate size selection if size selector exists
        if (sizeSelector && !selectedSize) {
            showNotification('Please select a size');
            return;
        }
        
        // Add to cart
        addToCart({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1,
            selectedSize: selectedSize
        });
        
        // Show notification
        showNotification(`${productName} (${selectedSize || 'One Size'}) added to cart`);
        
        // Update cart count and total
        updateCartCount();
        updateCartTotal();
    }
});

// Add item to cart
function addToCart(product) {
    // Ensure price is a number
    product.price = parseFloat(product.price) || 0;
    product.quantity = parseInt(product.quantity) || 1;
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => {
        if (item.id === product.id) {
            // If sizes are involved, match by size as well
            if (item.selectedSize || product.selectedSize) {
                return item.selectedSize === product.selectedSize;
            }
            return true;
        }
        return false;
    });
    
    if (existingItemIndex > -1) {
        // Update quantity if item exists
        cart[existingItemIndex].quantity += product.quantity;
    } else {
        // Add new item to cart
        cart.push(product);
    }
    
    saveCart();
    updateCartCount();
    updateCartTotal();
}

// Update cart count in the header and return the count
function updateCartCount() {
    // Always get fresh data from localStorage
    cart = getCartFromStorage();
    
    const cartCount = document.querySelector('.cart-count');
    if (!cartCount) return 0;
    
    // Ensure cart is an array
    if (!Array.isArray(cart)) {
        cart = [];
        saveCart();
    }
    
    // Calculate total items in cart
    const count = cart.reduce((total, item) => {
        const quantity = parseInt(item.quantity) || 0;
        return total + (isNaN(quantity) ? 0 : quantity);
    }, 0);
    
    // Update the cart count display
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? 'flex' : 'none';
    
    // If cart is empty but still has items, clear it
    if (count === 0 && cart.length > 0) {
        cart = [];
        saveCart();
    }
    
    return count;
}

// Calculate and update cart total
function updateCartTotal() {
    const subtotal = cart.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return sum + (price * quantity);
    }, 0);
    
    // Update cart page if it exists
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl && shippingEl && totalEl) {
        // Calculate shipping (free over R1000, otherwise R100)
        const shipping = subtotal >= 1000 ? 0 : 100;
        const total = subtotal + shipping;
        
        subtotalEl.textContent = `R${subtotal.toFixed(2)}`;
        shippingEl.textContent = shipping === 0 ? 'FREE' : `R${shipping.toFixed(2)}`;
        totalEl.textContent = `R${total.toFixed(2)}`;
    }
    
    // Update cart count in navigation
    updateCartCount();
}

// Save cart to localStorage and update count
function saveCart() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        // Update count in all open tabs/windows
        if (typeof Storage !== 'undefined') {
            localStorage.setItem('cart_updated', Date.now().toString());
        }
        updateCartCount();
    } catch (e) {
        console.error('Error saving cart:', e);
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2700);
    }, 100);
}

// Initialize cart functionality on page load
document.addEventListener('DOMContentLoaded', () => {
    initCart();
    updateCartTotal();
    
    // Listen for storage events to update cart count when changed in another tab
    if (typeof window !== 'undefined') {
        window.addEventListener('storage', (event) => {
            if (event.key === 'cart' || event.key === 'cart_updated') {
                initCart();
                updateCartTotal();
            }
        });
    }
});
