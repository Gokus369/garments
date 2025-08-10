// Global variables
let products = [
    {
        id: '1',
        name: 'Classic Cotton T-Shirt',
        price: 25.99,
        image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'casual',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Black', 'Navy'],
        description: 'Premium quality cotton t-shirt with comfortable fit'
    },
    {
        id: '2',
        name: 'Premium Polo Shirt',
        price: 35.99,
        image: 'https://images.pexels.com/photos/5710082/pexels-photo-5710082.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'formal',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Blue', 'Grey'],
        description: 'Elegant polo shirt perfect for business casual'
    },
    {
        id: '3',
        name: 'Graphic Print Tee',
        price: 22.99,
        image: 'https://images.pexels.com/photos/8532619/pexels-photo-8532619.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'casual',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'White'],
        description: 'Trendy graphic print t-shirt for casual wear'
    }
];

let currentProduct = null;
let selectedSize = '';
let selectedColor = '';

// DOM elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const productsGrid = document.getElementById('products-grid');
const productModal = document.getElementById('product-modal');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    renderProducts();
    updateAdminStats();
    renderAdminProducts();
});

// Event listeners
function setupEventListeners() {
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Search and filter
    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);

    // Admin form
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', handleAddProduct);
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === productModal) {
            closeModal();
        }
    });
}

// Navigation functions
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    // Show selected page
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Update navigation active state
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Close mobile menu
    navMenu.classList.remove('active');

    // Render page-specific content
    if (pageId === 'products') {
        renderProducts();
    } else if (pageId === 'admin') {
        updateAdminStats();
        renderAdminProducts();
    }
}

// Product functions
function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    const filteredProducts = getFilteredProducts();

    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 0;">
                <i class="fas fa-search" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 20px;"></i>
                <h3 style="color: #64748b; margin-bottom: 10px;">No products found</h3>
                <p style="color: #94a3b8;">Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" onclick="openProductModal('${product.id}')">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-meta">
                    <div class="product-price">$${product.price}</div>
                    <div class="product-category">${product.category}</div>
                </div>
                <div class="product-details">
                    <p>${product.sizes.length} sizes available</p>
                    <p>${product.colors.length} colors available</p>
                </div>
                <button class="add-to-cart-btn" onclick="event.stopPropagation(); openProductModal('${product.id}')">
                    <i class="fab fa-whatsapp"></i>
                    Inquire on WhatsApp
                </button>
            </div>
        </div>
    `).join('');
}

function getFilteredProducts() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const category = categoryFilter ? categoryFilter.value : 'all';

    return products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || product.category === category;
        return matchesSearch && matchesCategory;
    });
}

function filterProducts() {
    renderProducts();
}

// Modal functions
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentProduct = product;
    selectedSize = product.sizes[0];
    selectedColor = product.colors[0];

    // Populate modal content
    document.getElementById('modal-product-image').src = product.image;
    document.getElementById('modal-product-name').textContent = product.name;
    document.getElementById('modal-product-price').textContent = `$${product.price}`;
    document.getElementById('modal-product-description').textContent = product.description;

    // Render size options
    const sizeOptions = document.getElementById('modal-size-options');
    sizeOptions.innerHTML = product.sizes.map(size => `
        <div class="size-option ${size === selectedSize ? 'selected' : ''}" 
             onclick="selectSize('${size}')">
            ${size}
        </div>
    `).join('');

    // Render color options
    const colorOptions = document.getElementById('modal-color-options');
    colorOptions.innerHTML = product.colors.map(color => `
        <div class="color-option ${color === selectedColor ? 'selected' : ''}" 
             onclick="selectColor('${color}')">
            ${color}
        </div>
    `).join('');

    // Setup add to cart button
    const addToCartBtn = document.getElementById('modal-add-to-cart');
    addToCartBtn.onclick = () => inquireOnWhatsApp(product.id);

    // Show modal
    productModal.style.display = 'block';
}

function closeModal() {
    productModal.style.display = 'none';
    currentProduct = null;
    selectedSize = '';
    selectedColor = '';
}

function selectSize(size) {
    selectedSize = size;
    
    // Update UI
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
        option.classList.toggle('selected', option.textContent.trim() === size);
    });
}

function selectColor(color) {
    selectedColor = color;
    
    // Update UI
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.classList.toggle('selected', option.textContent.trim() === color);
    });
}

// WhatsApp inquiry function
function inquireOnWhatsApp(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !selectedSize || !selectedColor) return;

    // Create WhatsApp message
    const message = `Hi! I'm interested in buying this product:

Product: ${product.name}
Price: $${product.price}
Size: ${selectedSize}
Color: ${selectedColor}

Please provide more details about availability and ordering process.`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // WhatsApp number (replace with your actual WhatsApp business number)
    const whatsappNumber = '919876543210';
    
    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappURL, '_blank');
    
    closeModal();
    
    // Show success message
    showNotification('Opening WhatsApp to inquire about this product!');
}

// Admin functions
function toggleProductForm() {
    const form = document.getElementById('product-form');
    if (form) {
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }
}

function handleAddProduct(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const sizes = Array.from(document.querySelectorAll('#sizes-group input:checked')).map(cb => cb.value);
    const colors = Array.from(document.querySelectorAll('#colors-group input:checked')).map(cb => cb.value);

    if (sizes.length === 0 || colors.length === 0) {
        alert('Please select at least one size and one color.');
        return;
    }

    const newProduct = {
        id: Date.now().toString(),
        name: document.getElementById('product-name').value,
        price: parseFloat(document.getElementById('product-price').value),
        image: document.getElementById('product-image').value,
        category: document.getElementById('product-category').value,
        sizes: sizes,
        colors: colors,
        description: document.getElementById('product-description').value
    };

    products.push(newProduct);
    
    // Reset form
    e.target.reset();
    document.querySelectorAll('#sizes-group input, #colors-group input').forEach(cb => cb.checked = false);
    
    // Hide form
    toggleProductForm();
    
    // Update displays
    updateAdminStats();
    renderAdminProducts();
    renderProducts();
    
    showNotification('Product added successfully!');
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        updateAdminStats();
        renderAdminProducts();
        renderProducts();
        showNotification('Product deleted successfully!');
    }
}

function updateAdminStats() {
    const totalProducts = products.length;
    const avgPrice = totalProducts > 0 ? 
        (products.reduce((sum, p) => sum + p.price, 0) / totalProducts).toFixed(0) : 0;
    const totalCategories = new Set(products.map(p => p.category)).size;
    const totalColors = new Set(products.flatMap(p => p.colors)).size;

    if (document.getElementById('total-products')) {
        document.getElementById('total-products').textContent = totalProducts;
    }
    if (document.getElementById('avg-price')) {
        document.getElementById('avg-price').textContent = `$${avgPrice}`;
    }
    if (document.getElementById('total-categories')) {
        document.getElementById('total-categories').textContent = totalCategories;
    }
    if (document.getElementById('total-colors')) {
        document.getElementById('total-colors').textContent = totalColors;
    }
}

function renderAdminProducts() {
    const tbody = document.getElementById('admin-products-tbody');
    const emptyProducts = document.getElementById('empty-products');

    if (!tbody) return;

    if (products.length === 0) {
        tbody.innerHTML = '';
        if (emptyProducts) emptyProducts.style.display = 'block';
        return;
    }

    if (emptyProducts) emptyProducts.style.display = 'none';

    tbody.innerHTML = products.map(product => `
        <tr>
            <td>
                <div class="product-cell">
                    <img src="${product.image}" alt="${product.name}">
                    <div>
                        <div class="product-name">${product.name}</div>
                        <div class="product-desc">${product.description}</div>
                    </div>
                </div>
            </td>
            <td>
                <span class="category-badge">${product.category}</span>
            </td>
            <td class="price-cell">$${product.price}</td>
            <td>
                <div class="tags">
                    ${product.sizes.map(size => `<span class="tag">${size}</span>`).join('')}
                </div>
            </td>
            <td>
                <div class="tags">
                    ${product.colors.slice(0, 3).map(color => `<span class="tag">${color}</span>`).join('')}
                    ${product.colors.length > 3 ? `<span class="tag">+${product.colors.length - 3}</span>` : ''}
                </div>
            </td>
            <td>
                <button class="delete-btn" onclick="deleteProduct('${product.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Utility functions
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;

    // Add to DOM
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);