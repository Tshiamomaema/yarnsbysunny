# Yarns E-Commerce (Shein-Style Clone)

A static, responsive fashion e-commerce site inspired by Shein, focused on yarn-based clothing. No backend required — just open `index.html`!

## Features
- Shein-inspired layout and product grid
- WhatsApp checkout (pre-filled message)
- Product data in `main.js` (easy to edit)
- Filter by category
- Responsive, mobile-first design
- Built with HTML, Tailwind CSS (CDN), and Vanilla JS

## How to Use
1. **Open `index.html` in your browser.**
2. **Edit products:**
   - Open `main.js`
   - Update the `products` array (add, remove, or edit products)
   - Use real image URLs or your own
3. **Change WhatsApp number:**
   - In `main.js`, update the `phone` variable in `buyViaWhatsApp()`
4. **Customize social links:**
   - Edit the links in the Contact section of `index.html`

## Pages
- `index.html` — Home, product grid, filters, contact
- `about.html` — Brand story
- `product.html` — Product detail (open with `?id=PRODUCT_ID`)

## No build step, no backend, no npm — just open and go! 