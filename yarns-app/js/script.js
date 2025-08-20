// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a nav link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Sticky navigation on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.padding = '10px 0';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.padding = '15px 0';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Animate timeline items on scroll
const timelineItems = document.querySelectorAll('.timeline-item');

const animateOnScroll = () => {
    timelineItems.forEach(item => {
        const itemTop = item.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (itemTop < windowHeight - 100) {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }
    });
};

// Set initial styles for timeline items
if (timelineItems.length > 0) {
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        if (index % 2 === 0) {
            item.style.transform = 'translateX(-50px)';
        } else {
            item.style.transform = 'translateX(50px)';
        }
    });
    
    // Run once on page load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
}

// Form submission handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your form submission logic here
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

// Newsletter subscription
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        if (emailInput && emailInput.value) {
            // Add your newsletter subscription logic here
            alert('Thank you for subscribing to our newsletter!');
            newsletterForm.reset();
        }
    });
}

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add to cart functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
        const productCard = e.target.closest('.product-card');
        const productId = productCard.dataset.id;
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = parseFloat(productCard.dataset.price);
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
    product.price = parseFloat(product.price);
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => {
        if (item.id === product.id) {
            // If sizes are involved, match by size as well
            if (item.sizes && item.selectedSize) {
                return item.selectedSize === product.selectedSize;
            }
            return true;
        }
        return false;
    });
    
    if (existingItemIndex > -1) {
        // Update quantity if item exists
        cart[existingItemIndex].quantity += product.quantity || 1;
    } else {
        // Add new item to cart with quantity 1 if not specified
        product.quantity = product.quantity || 1;
        cart.push(product);
    }
    
    saveCart();
    updateCartCount();
    updateCartTotal();
    
    // Show notification
    showNotification(`${product.name} has been added to your cart!`);
}

// Calculate and update cart total
function updateCartTotal() {
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl && totalEl) {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        subtotalEl.textContent = `R${subtotal.toFixed(2)}`;
        totalEl.textContent = `R${subtotal.toFixed(2)}`; // Total will be same as subtotal for now
    }
    
    // Update cart count in navigation
    updateCartCount();
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Update cart count in the header
function updateCartCount() {
    const cartCount = document.querySelectorAll('.cart-count');
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCount.forEach(counter => {
        if (count > 0) {
            counter.textContent = count;
            counter.style.display = 'flex';
        } else {
            counter.style.display = 'none';
        }
    });
}

// Generate a random order number
function generateOrderNumber() {
    const timestamp = Date.now().toString();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `YBS-${timestamp.slice(-6)}-${random}`;
}

// Generate PDF receipt
async function generateReceipt(orderNumber, orderDetails) {
    try {
        // Load jsPDF dynamically
        const { jsPDF } = await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
        
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        
        // Add logo and header
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('YARNS BY SUNNY', pageWidth / 2, 20, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Order Receipt', pageWidth / 2, 30, { align: 'center' });
        
        // Order info
        doc.setFont('helvetica', 'bold');
        doc.text(`Order #: ${orderNumber}`, 20, 50);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60);
        
        // Line separator
        doc.line(20, 70, pageWidth - 20, 70);
        
        // Items header
        doc.setFont('helvetica', 'bold');
        doc.text('ITEM', 20, 85);
        doc.text('QTY', 120, 85);
        doc.text('PRICE', 160, 85);
        doc.text('TOTAL', 190, 85);
        
        // Items
        let yPos = 95;
        orderDetails.items.forEach(item => {
            doc.setFont('helvetica', 'normal');
            doc.text(item.name, 20, yPos);
            if (item.size) {
                doc.setFont('helvetica', 'italic');
                doc.text(`Size: ${item.size}`, 20, yPos + 5);
                yPos += 5;
            }
            doc.text(item.quantity.toString(), 120, yPos);
            doc.text(`R${item.price.toFixed(2)}`, 160, yPos);
            doc.text(`R${(item.price * item.quantity).toFixed(2)}`, 190, yPos);
            yPos += 10;
        });
        
        // Totals
        doc.setDrawColor(200, 200, 200);
        doc.line(20, yPos + 10, pageWidth - 20, yPos + 10);
        
        doc.setFont('helvetica', 'bold');
        doc.text('SUBTOTAL', 160, yPos + 25);
        doc.text(`R${orderDetails.subtotal.toFixed(2)}`, 190, yPos + 25);
        
        doc.text('SHIPPING', 160, yPos + 35);
        doc.text('To be calculated', 190, yPos + 35);
        
        doc.setFontSize(14);
        doc.text('TOTAL DUE', 160, yPos + 50);
        doc.text(`R${orderDetails.subtotal.toFixed(2)}`, 190, yPos + 50);
        
        // Footer
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text('Thank you for shopping with Yarns by Sunny!', pageWidth / 2, 280, { align: 'center' });
        
        // Save the PDF
        const pdfBlob = doc.output('blob');
        return pdfBlob;
    } catch (error) {
        console.error('Error generating PDF:', error);
        return null;
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Initialize cart functionality on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateCartTotal();
    
    // Handle cart item quantity changes
    document.addEventListener('click', (e) => {
        const target = e.target;
        const cartItem = target.closest('.cart-item');
        
        if (!cartItem) return;
        
        const index = parseInt(cartItem.dataset.index);
        const quantityInput = cartItem.querySelector('.quantity-input');
        
        if (target.classList.contains('quantity-btn')) {
            e.preventDefault();
            const currentValue = parseInt(quantityInput.value) || 1;
            
            if (target.classList.contains('minus') && currentValue > 1) {
                quantityInput.value = currentValue - 1;
                updateCartItem(cartItem, index, currentValue - 1);
            } else if (target.classList.contains('plus')) {
                quantityInput.value = currentValue + 1;
                updateCartItem(cartItem, index, currentValue + 1);
            }
        } else if (quantityInput && target === quantityInput) {
            // Handle direct input change
            const newValue = parseInt(quantityInput.value) || 1;
            if (newValue > 0) {
                updateCartItem(cartItem, index, newValue);
            } else {
                quantityInput.value = 1;
                updateCartItem(cartItem, index, 1);
            }
        } else if (target.classList.contains('remove-item')) {
            e.preventDefault();
            cart.splice(index, 1);
            saveCart();
            updateCartCount();
            updateCartTotal();
            renderCartItems();
        }
    });
    
    // Handle size selection changes
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('size-selector')) {
            const cartItem = e.target.closest('.cart-item');
            const index = parseInt(cartItem.dataset.index);
            cart[index].selectedSize = e.target.value;
            saveCart();
        }
    });
    
    // Add notification styles if they don't exist
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: #333;
                color: white;
                padding: 15px 25px;
                border-radius: 5px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.3s ease;
                z-index: 1000;
                max-width: 300px;
            }
            .notification.show {
                transform: translateY(0);
                opacity: 1;
            }
            .cart-item-price-total {
                font-weight: 600;
                color: var(--accent-color);
                white-space: nowrap;
            }
        `;
        document.head.appendChild(style);
    }
});

// Lazy loading for images
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
});
