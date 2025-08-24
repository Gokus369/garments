// Global variables and utilities
let currentUser = null;
let products = [];
let categories = ['casual', 'formal', 'sports', 'ethnic'];
let colors = [
    { name: 'White', value: '#FFFFFF' },
    { name: 'Black', value: '#000000' },
    { name: 'Navy', value: '#001f3f' },
    { name: 'Grey', value: '#808080' },
    { name: 'Red', value: '#FF4136' },
    { name: 'Blue', value: '#0074D9' },
    { name: 'Green', value: '#2ECC40' },
    { name: 'Orange', value: '#FF851B' }
];

// Admin credentials
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Initialize data from localStorage
function initializeData() {
    const savedProducts = localStorage.getItem('ekaiva_products');
    const savedCategories = localStorage.getItem('ekaiva_categories');
    const savedColors = localStorage.getItem('ekaiva_colors');

    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        // Add some demo products
        products = [
            {
                id: '1',
                name: 'Premium Cotton T-Shirt',
                price: 899,
                images: ['https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=400'],
                category: 'casual',
                sizes: ['S', 'M', 'L', 'XL'],
                colors: ['White', 'Black', 'Navy'],
                description: 'Premium quality cotton t-shirt with comfortable fit and modern styling. Perfect for everyday wear.',
                dateAdded: new Date().toISOString()
            },
            {
                id: '2',
                name: 'Elegant Polo Shirt',
                price: 1299,
                images: ['https://images.pexels.com/photos/5710082/pexels-photo-5710082.jpeg?auto=compress&cs=tinysrgb&w=400'],
                category: 'formal',
                sizes: ['S', 'M', 'L', 'XL'],
                colors: ['White', 'Blue', 'Grey'],
                description: 'Sophisticated polo shirt perfect for business casual and professional wear. Made with premium materials.',
                dateAdded: new Date().toISOString()
            },
            {
                id: '3',
                name: 'Graphic Design Hoodie',
                price: 1599,
                images: ['https://images.pexels.com/photos/8532619/pexels-photo-8532619.jpeg?auto=compress&cs=tinysrgb&w=400'],
                category: 'casual',
                sizes: ['M', 'L', 'XL', 'XXL'],
                colors: ['Black', 'Grey', 'Navy'],
                description: 'Trendy graphic hoodie with unique designs. Comfortable and stylish for casual outings.',
                dateAdded: new Date().toISOString()
            }
        ];
        localStorage.setItem('ekaiva_products', JSON.stringify(products));
    }

    if (savedCategories) {
        categories = JSON.parse(savedCategories);
    } else {
        localStorage.setItem('ekaiva_categories', JSON.stringify(categories));
    }

    if (savedColors) {
        colors = JSON.parse(savedColors);
    } else {
        localStorage.setItem('ekaiva_colors', JSON.stringify(colors));
    }
}

// Check if user is admin
function isAdmin() {
    return localStorage.getItem('ekaiva_admin_logged_in') === 'true';
}

// Admin login functions
function showAdminLogin() {
    const modal = document.getElementById('admin-login-modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function hideAdminLogin() {
    const modal = document.getElementById('admin-login-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function loginAdmin(username, password) {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('ekaiva_admin_logged_in', 'true');
        hideAdminLogin();
        showNotification('Login successful! Redirecting to admin panel...', 'success');
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1500);
        return true;
    }
    return false;
}

function logoutAdmin() {
    localStorage.removeItem('ekaiva_admin_logged_in');
    showNotification('Logged out successfully!', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Check admin access for admin page
function checkAdminAccess() {
    if (window.location.pathname.includes('admin.html') && !isAdmin()) {
        showNotification('Access denied! Please login as admin.', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return false;
    }
    return true;
}

// Save data to localStorage
function saveProducts() {
    localStorage.setItem('ekaiva_products', JSON.stringify(products));
}

function saveCategories() {
    localStorage.setItem('ekaiva_categories', JSON.stringify(categories));
}

function saveColors() {
    localStorage.setItem('ekaiva_colors', JSON.stringify(colors));
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeData();
    setupEventListeners();
    checkAdminAccess();

    // Initialize based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (currentPage === 'products.html') {
        initializeProductsPage();
    } else if (currentPage === 'index.html' || currentPage === '') {
        initializeHomePage();
    } else if (currentPage === 'contact.html') {
        initializeContactPage();
    }

    // Handle loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 1500);
});

// Setup Event Listeners
function setupEventListeners() {
    // Navbar scroll effect
    window.addEventListener('scroll', function () {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // Admin login form
    const adminLoginForm = document.getElementById('admin-login-form');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('admin-username').value;
            const password = document.getElementById('admin-password').value;

            if (loginAdmin(username, password)) {
                // Login successful
            } else {
                showNotification('Invalid username or password!', 'error');
            }
        });
    }

    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            handleContactForm();
        });
    }
}

// Initialize Home Page
function initializeHomePage() {
    console.log('Home page initialized');
}

// Initialize Contact Page
function initializeContactPage() {
    console.log('Contact page initialized');
}

// Handle contact form submission
function handleContactForm() {
    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Validate form
    if (!fullName || !email || !phone || !subject || !message) {
        showNotification('Please fill in all fields!', 'error');
        return;
    }

    // Create WhatsApp message
    const whatsappMessage = `New Contact Form Submission:

Name: ${fullName}
Email: ${email}
Phone: ${phone}
Subject: ${subject}

Message:
${message}`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappNumber = '919876543210';
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappURL, '_blank');

    // Show success message and reset form
    showNotification('Message sent successfully! Opening WhatsApp...', 'success');
    document.getElementById('contact-form').reset();
}

// Initialize Products Page
function initializeProductsPage() {
    console.log('Products page initialized');

    // Populate category filter
    populateCategoryFilter();

    // Setup search and filter event listeners
    setupProductsPageListeners();

    // Render products
    renderProducts();
}

function setupProductsPageListeners() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortSelect = document.getElementById('sort-select');

    if (searchInput) {
        searchInput.addEventListener('input', filterAndRenderProducts);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterAndRenderProducts);
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', filterAndRenderProducts);
    }
}

function populateCategoryFilter() {
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        // Clear existing options except "All Categories"
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';

        // Add category options
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categoryFilter.appendChild(option);
        });
    }
}

// Product Filtering and Rendering
function getFilteredProducts() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortSelect = document.getElementById('sort-select');

    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const category = categoryFilter ? categoryFilter.value : 'all';
    const sortBy = sortSelect ? sortSelect.value : 'name';

    let filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || product.category === category;
        return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'newest':
                return new Date(b.dateAdded) - new Date(a.dateAdded);
            default:
                return 0;
        }
    });

    return filtered;
}

function filterAndRenderProducts() {
    renderProducts();
}

function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    const emptyProducts = document.getElementById('empty-products');

    if (!productsGrid) return;

    const filteredProducts = getFilteredProducts();

    if (filteredProducts.length === 0) {
        productsGrid.style.display = 'none';
        if (emptyProducts) emptyProducts.style.display = 'block';
        return;
    }

    productsGrid.style.display = 'grid';
    if (emptyProducts) emptyProducts.style.display = 'none';

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" onclick="openProductModal('${product.id}')">
            <div class="product-glow"></div>
            <div class="product-image">
                <img src="${product.images[0]}" alt="${product.name}">
                <div class="image-overlay">
                    <div class="quick-view">
                        <i class="fas fa-eye"></i>
                        <span>Quick View</span>
                    </div>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-meta">
                    <div class="product-price">₹${product.price}</div>
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

    // Add stagger animation
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// Product Modal
let currentProduct = null;
let selectedSize = '';
let selectedColor = '';

function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentProduct = product;
    selectedSize = product.sizes[0];
    selectedColor = product.colors[0];

    // Populate modal content
    document.getElementById('modal-product-name').textContent = product.name;
    document.getElementById('modal-product-price').textContent = `₹${product.price}`;
    document.getElementById('modal-product-description').textContent = product.description;

    // Set main image
    const mainImage = document.getElementById('modal-product-image');
    if (mainImage) {
        mainImage.src = product.images[0];
        mainImage.alt = product.name;
    }

    // Populate image thumbnails
    const thumbnailsContainer = document.getElementById('image-thumbnails');
    if (thumbnailsContainer && product.images.length > 1) {
        thumbnailsContainer.innerHTML = product.images.map((image, index) => `
            <img src="${image}" alt="${product.name}" 
                 onclick="changeMainImage('${image}')" 
                 class="${index === 0 ? 'active' : ''}">
        `).join('');
    }

    // Render size options
    const sizeOptions = document.getElementById('modal-size-options');
    if (sizeOptions) {
        sizeOptions.innerHTML = product.sizes.map(size => `
            <div class="size-option ${size === selectedSize ? 'selected' : ''}" 
                 onclick="selectSize('${size}')">
                ${size}
            </div>
        `).join('');
    }

    // Render color options
    const colorOptions = document.getElementById('modal-color-options');
    if (colorOptions) {
        colorOptions.innerHTML = product.colors.map(color => `
            <div class="color-option ${color === selectedColor ? 'selected' : ''}" 
                 onclick="selectColor('${color}')">
                ${color}
            </div>
        `).join('');
    }

    // Setup add to cart button
    const addToCartBtn = document.getElementById('modal-add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.onclick = () => inquireOnWhatsApp(product.id);
    }

    // Show modal
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    currentProduct = null;
    selectedSize = '';
    selectedColor = '';
}

function changeMainImage(imageSrc) {
    const mainImage = document.getElementById('modal-product-image');
    if (mainImage) {
        mainImage.src = imageSrc;
    }

    // Update thumbnail active state
    const thumbnails = document.querySelectorAll('#image-thumbnails img');
    thumbnails.forEach(thumb => {
        thumb.classList.remove('active');
        if (thumb.src === imageSrc) {
            thumb.classList.add('active');
        }
    });
}

function selectSize(size) {
    selectedSize = size;

    // Update UI
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.textContent.trim() === size) {
            option.classList.add('selected');
        }
    });
}

function selectColor(color) {
    selectedColor = color;

    // Update UI
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.textContent.trim() === color) {
            option.classList.add('selected');
        }
    });
}

// WhatsApp inquiry function
function inquireOnWhatsApp(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !selectedSize || !selectedColor) return;

    // Create WhatsApp message
    const message = `Hi! I'm interested in this product:

Product: ${product.name}
Price: ₹${product.price}
Size: ${selectedSize}
Color: ${selectedColor}

Please provide more details about availability and ordering process.`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // WhatsApp number
    const whatsappNumber = '919876543210';

    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappURL, '_blank');

    closeModal();

    // Show success message
    showNotification('Opening WhatsApp to inquire about this product!', 'success');
}

// Utility functions
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#E74C3C' : type === 'success' ? '#27AE60' : '#3498DB'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        max-width: 350px;
        font-weight: 600;
        font-family: var(--font-primary);
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    notification.textContent = message;

    // Add to DOM
    document.body.appendChild(notification);

    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Format price
function formatPrice(price) {
    return `₹${price.toLocaleString('en-IN')}`;
}

// Add CSS for notifications and animations
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification {
        border-radius: 12px;
        font-weight: 600;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
    }
    
    .notification.error {
        background: linear-gradient(135deg, #E74C3C, #C0392B) !important;
    }
    
    .notification.success {
        background: linear-gradient(135deg, #27AE60, #2ECC71) !important;
    }
    
    .notification.info {
        background: linear-gradient(135deg, #3498DB, #2980B9) !important;
    }

    .image-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: var(--transition);
    }

    .product-card:hover .image-overlay {
        opacity: 1;
    }

    .quick-view {
        color: white;
        text-align: center;
        font-weight: 600;
    }

    .quick-view i {
        display: block;
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }

    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(9px, 9px);
    }

    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }

    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
`;
document.head.appendChild(additionalStyles);

// Export functions for use in other files
window.EkaivaApp = {
    initializeData,
    products,
    categories,
    colors,
    saveProducts,
    saveCategories,
    saveColors,
    showNotification,
    generateId,
    formatPrice,
    isAdmin,
    checkAdminAccess
};

// Make functions available globally
window.showAdminLogin = showAdminLogin;
window.hideAdminLogin = hideAdminLogin;
window.logoutAdmin = logoutAdmin;
window.openProductModal = openProductModal;
window.closeModal = closeModal;
window.changeMainImage = changeMainImage;
window.selectSize = selectSize;
window.selectColor = selectColor;