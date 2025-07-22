// Product data array (edit this to add/remove products)
const products = [
  {
    id: 'YRN006',
    name: 'Pastel Cozy Cardigan',
    description: 'A soft, pastel-colored chunky knit cardigan, perfect for layering in cooler weather.',
    price: 549,
    category: 'Tops',
    image: '1000289536.jpg',
  },
  {
    id: 'YRN007',
    name: 'Elegant Cable Knit Dress',
    description: 'A long, elegant dress featuring intricate cable knit patterns and a flattering silhouette.',
    price: 899,
    category: 'Dresses',
    image: '1000289544.jpg',
  },
  {
    id: 'YRN008',
    name: 'Winter Pom Beanie',
    description: 'A stylish beanie with a fluffy pom-pom, crafted from premium yarn for warmth and comfort.',
    price: 179,
    category: 'Accessories',
    image: '1000289564.jpg',
  },
  {
    id: 'YRN009',
    name: 'Striped Knit Pullover',
    description: 'A modern pullover sweater with bold, colorful stripes and a relaxed fit.',
    price: 499,
    category: 'Tops',
    image: '1000289568.jpg',
  },
  {
    id: 'YRN010',
    name: 'Classic Crochet Tote',
    description: 'A hand-crocheted tote bag, both stylish and practical for everyday use.',
    price: 259,
    category: 'Accessories',
    image: '1000289560.jpg',
  },
  {
    id: 'YRN011',
    name: 'Boho Fringe Shawl',
    description: 'A bohemian-inspired shawl with delicate fringe, ideal for layering over any outfit.',
    price: 349,
    category: 'Accessories',
    image: '1000289548.jpg',
  },
  {
    id: 'YRN012',
    name: 'Signature Yarn Beanie',
    description: 'Our signature beanie, crafted with love and creativity. Inspired by the journey of a business owner and content creator, this cozy accessory is a symbol of warmth, style, and inspiration.',
    price: 189,
    category: 'Accessories',
    image: '1000289538.jpg',
  },
  {
    id: 'YRN013',
    name: 'Sunset Ombre Scarf',
    description: 'A lightweight scarf with a beautiful ombre gradient, perfect for adding a pop of color to any outfit.',
    price: 229,
    category: 'Accessories',
    image: '1000289576.jpg',
  },
  {
    id: 'YRN014',
    name: 'Chunky Knit Headband',
    description: 'A cozy, chunky knit headband designed to keep you warm and stylish during chilly days.',
    price: 129,
    category: 'Accessories',
    image: '1000289577.jpg',
  },
  {
    id: 'YRN015',
    name: 'Pastel Patchwork Sweater',
    description: 'A playful pastel patchwork sweater, combining comfort and creativity for a unique look.',
    price: 579,
    category: 'Tops',
    image: '1000289578.jpg',
  },
];

// Render product grid
function renderProducts(filter = 'all') {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
  if (filtered.length === 0) {
    grid.innerHTML = '<p class="col-span-full text-center text-gray-500">No products found.</p>';
    return;
  }
  filtered.forEach(product => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow p-4 flex flex-col relative transition-transform duration-200 hover:-translate-y-2 hover:shadow-2xl group';
    card.innerHTML = `
      <button class="absolute top-2 right-2 text-pink-400 hover:text-pink-600 text-2xl opacity-0 group-hover:opacity-100 transition" title="Favorite">❤</button>
      <div class="w-full aspect-square overflow-hidden rounded mb-3">
        <img src="${product.image}" alt="${product.name}" class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
      </div>
      <h3 class="text-lg font-bold text-pink-600 mb-1">${product.name}</h3>
      <div class="mt-auto flex flex-col gap-2">
        <span class="block text-xl font-semibold text-gray-800 mb-2">R${product.price}</span>
        <button onclick="buyViaWhatsApp('${product.name}', ${product.price}, '${product.id}')" class="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded">Buy via WhatsApp</button>
        <a href="product.html?id=${product.id}" class="w-full bg-white border border-pink-300 text-pink-500 hover:bg-pink-50 font-bold py-2 px-4 rounded transition text-center">View Details</a>
      </div>
    `;
    grid.appendChild(card);
  });
}

// WhatsApp checkout
function buyViaWhatsApp(name, price, id) {
  const msg = encodeURIComponent(`Hello, I’d like to buy this item from Yarns:\n- Product: ${name}\n- Price: R${price}\n- Ref: ${id}`);
  const phone = '27614590003'; // Updated WhatsApp number
  window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
}

// Filter button logic
function setupFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('bg-pink-300'));
      btn.classList.add('bg-pink-300');
      renderProducts(btn.dataset.category);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  setupFilters();
}); 