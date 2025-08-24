// Admin-specific functionality
document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname.includes('admin.html')) {
        // Check if user is admin
        if (!window.EkaivaApp.isAdmin()) {
            window.EkaivaApp.showNotification('Access denied! Please login as admin.', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return;
        }

        initializeAdminPage();
    }
});

function initializeAdminPage() {
    console.log('Admin page initialized');

    // Initialize data
    window.EkaivaApp.initializeData();

    // Setup admin event listeners
    setupAdminEventListeners();

    // Populate forms with existing data
    populateAdminData();

    // Update stats
    updateAdminStats();

    // Render admin products table
    renderAdminProducts();
}

function setupAdminEventListeners() {
    // Product form submission
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', handleAddProduct);
    }

    // Search and filter in admin table
    const searchProducts = document.getElementById('search-products');
    const filterCategory = document.getElementById('filter-category');

    if (searchProducts) {
        searchProducts.addEventListener('input', renderAdminProducts);
    }

    if (filterCategory) {
        filterCategory.addEventListener('change', renderAdminProducts);
    }
}

function populateAdminData() {
    // Populate categories in product form
    populateProductCategorySelect();

    // Populate colors in product form
    populateProductColorsGrid();

    // Populate categories in filter
    populateAdminCategoryFilter();

    // Render existing categories
    renderCategoriesList();

    // Render existing colors
    renderColorsList();
}

function populateProductCategorySelect() {
    const categorySelect = document.getElementById('product-category');
    if (categorySelect) {
        categorySelect.innerHTML = '<option value="">Select Category</option>';

        window.EkaivaApp.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categorySelect.appendChild(option);
        });
    }
}

function populateProductColorsGrid() {
    const colorsGrid = document.getElementById('colors-group');
    if (colorsGrid) {
        colorsGrid.innerHTML = window.EkaivaApp.colors.map(color => `
            <div class="color-item">
                <input type="checkbox" id="color-${color.name}" value="${color.name}">
                <div class="color-preview" style="background-color: ${color.value}"></div>
                <label for="color-${color.name}">${color.name}</label>
            </div>
        `).join('');
    }
}

function populateAdminCategoryFilter() {
    const filterCategory = document.getElementById('filter-category');
    if (filterCategory) {
        filterCategory.innerHTML = '<option value="">All Categories</option>';

        window.EkaivaApp.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            filterCategory.appendChild(option);
        });
    }
}

// Toggle form visibility
function toggleProductForm() {
    const form = document.getElementById('product-form');
    if (form) {
        const isVisible = form.style.display !== 'none';
        form.style.display = isVisible ? 'none' : 'block';

        if (!isVisible) {
            form.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

function toggleCategoryForm() {
    const form = document.getElementById('category-form');
    if (form) {
        const isVisible = form.style.display !== 'none';
        form.style.display = isVisible ? 'none' : 'block';

        if (!isVisible) {
            form.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

function toggleColorForm() {
    const form = document.getElementById('color-form');
    if (form) {
        const isVisible = form.style.display !== 'none';
        form.style.display = isVisible ? 'none' : 'block';

        if (!isVisible) {
            form.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Image upload handling
function handleImageUpload(input) {
    const files = Array.from(input.files);
    const previewContainer = document.getElementById('image-preview');

    if (!previewContainer) return;

    // Clear existing previews
    previewContainer.innerHTML = '';

    files.forEach((file, index) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const previewItem = document.createElement('div');
                previewItem.className = 'image-preview-item';
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="Product Image ${index + 1}">
                    <button type="button" class="image-remove" onclick="removeImagePreview(this, ${index})">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                previewContainer.appendChild(previewItem);
            };
            reader.readAsDataURL(file);
        }
    });
}

function removeImagePreview(button, index) {
    const previewItem = button.closest('.image-preview-item');
    if (previewItem) {
        previewItem.remove();

        // Update file input to remove this file
        const fileInput = document.getElementById('product-images');
        if (fileInput && fileInput.files.length > index) {
            const dt = new DataTransfer();
            const files = Array.from(fileInput.files);
            files.forEach((file, i) => {
                if (i !== index) {
                    dt.items.add(file);
                }
            });
            fileInput.files = dt.files;
        }
    }
}

// Handle product form submission
function handleAddProduct(e) {
    e.preventDefault();

    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const category = document.getElementById('product-category').value;
    const description = document.getElementById('product-description').value;

    // Get selected sizes
    const selectedSizes = Array.from(document.querySelectorAll('#sizes-group input:checked'))
        .map(cb => cb.value);

    // Get selected colors
    const selectedColors = Array.from(document.querySelectorAll('#colors-group input:checked'))
        .map(cb => cb.value);

    // Get uploaded images
    const imageFiles = document.getElementById('product-images').files;
    const images = [];

    // Validate form
    if (!name || !price || !category || !description) {
        window.EkaivaApp.showNotification('Please fill in all required fields', 'error');
        return;
    }

    if (selectedSizes.length === 0) {
        window.EkaivaApp.showNotification('Please select at least one size', 'error');
        return;
    }

    if (selectedColors.length === 0) {
        window.EkaivaApp.showNotification('Please select at least one color', 'error');
        return;
    }

    // For demo purposes, we'll use placeholder images or convert uploaded images to base64
    if (imageFiles.length > 0) {
        // In a real application, you would upload these to a server
        // For now, we'll use placeholder images based on category
        if (category === 'casual') {
            images.push('https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=600');
        } else if (category === 'formal') {
            images.push('https://images.pexels.com/photos/5710082/pexels-photo-5710082.jpeg?auto=compress&cs=tinysrgb&w=600');
        } else {
            images.push('https://images.pexels.com/photos/8532619/pexels-photo-8532619.jpeg?auto=compress&cs=tinysrgb&w=600');
        }
    } else {
        // Use default image based on category
        if (category === 'casual') {
            images.push('https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=600');
        } else if (category === 'formal') {
            images.push('https://images.pexels.com/photos/5710082/pexels-photo-5710082.jpeg?auto=compress&cs=tinysrgb&w=600');
        } else {
            images.push('https://images.pexels.com/photos/8532619/pexels-photo-8532619.jpeg?auto=compress&cs=tinysrgb&w=600');
        }
    }

    // Create new product
    const newProduct = {
        id: window.EkaivaApp.generateId(),
        name,
        price,
        images,
        category,
        sizes: selectedSizes,
        colors: selectedColors,
        description,
        dateAdded: new Date().toISOString()
    };

    // Add to products array
    window.EkaivaApp.products.push(newProduct);
    window.EkaivaApp.saveProducts();

    // Reset form
    e.target.reset();
    document.getElementById('image-preview').innerHTML = '';

    // Hide form
    toggleProductForm();

    // Update displays
    updateAdminStats();
    renderAdminProducts();

    window.EkaivaApp.showNotification('Product added successfully!', 'success');
}

// Category management
function addCategory() {
    const newCategoryInput = document.getElementById('new-category');
    const categoryName = newCategoryInput.value.trim().toLowerCase();

    if (!categoryName) {
        window.EkaivaApp.showNotification('Please enter a category name', 'error');
        return;
    }

    if (window.EkaivaApp.categories.includes(categoryName)) {
        window.EkaivaApp.showNotification('Category already exists', 'error');
        return;
    }

    // Add category
    window.EkaivaApp.categories.push(categoryName);
    window.EkaivaApp.saveCategories();

    // Clear input
    newCategoryInput.value = '';

    // Update displays
    renderCategoriesList();
    populateProductCategorySelect();
    populateAdminCategoryFilter();
    updateAdminStats();

    window.EkaivaApp.showNotification('Category added successfully!', 'success');
}

function deleteCategory(categoryName) {
    if (confirm('Are you sure you want to delete this category? Products in this category will not be deleted.')) {
        window.EkaivaApp.categories = window.EkaivaApp.categories.filter(cat => cat !== categoryName);
        window.EkaivaApp.saveCategories();

        // Update displays
        renderCategoriesList();
        populateProductCategorySelect();
        populateAdminCategoryFilter();
        updateAdminStats();

        window.EkaivaApp.showNotification('Category deleted successfully!', 'success');
    }
}

function renderCategoriesList() {
    const categoriesGrid = document.getElementById('categories-grid');
    if (categoriesGrid) {
        categoriesGrid.innerHTML = window.EkaivaApp.categories.map(category => `
            <div class="category-item">
                <span>${category.charAt(0).toUpperCase() + category.slice(1)}</span>
                <button class="delete-category-btn" onclick="deleteCategory('${category}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `).join('');
    }
}

// Color management
function addColor() {
    const colorNameInput = document.getElementById('new-color-name');
    const colorValueInput = document.getElementById('new-color-value');

    const colorName = colorNameInput.value.trim();
    const colorValue = colorValueInput.value;

    if (!colorName) {
        window.EkaivaApp.showNotification('Please enter a color name', 'error');
        return;
    }

    if (window.EkaivaApp.colors.find(color => color.name.toLowerCase() === colorName.toLowerCase())) {
        window.EkaivaApp.showNotification('Color already exists', 'error');
        return;
    }

    // Add color
    window.EkaivaApp.colors.push({
        name: colorName,
        value: colorValue
    });
    window.EkaivaApp.saveColors();

    // Clear inputs
    colorNameInput.value = '';
    colorValueInput.value = '#000000';

    // Update displays
    renderColorsList();
    populateProductColorsGrid();
    updateAdminStats();

    window.EkaivaApp.showNotification('Color added successfully!', 'success');
}

function deleteColor(colorName) {
    if (confirm('Are you sure you want to delete this color? Products with this color will not be affected.')) {
        window.EkaivaApp.colors = window.EkaivaApp.colors.filter(color => color.name !== colorName);
        window.EkaivaApp.saveColors();

        // Update displays
        renderColorsList();
        populateProductColorsGrid();
        updateAdminStats();

        window.EkaivaApp.showNotification('Color deleted successfully!', 'success');
    }
}

function renderColorsList() {
    const colorsGrid = document.getElementById('colors-grid');
    if (colorsGrid) {
        colorsGrid.innerHTML = window.EkaivaApp.colors.map(color => `
            <div class="color-item-display">
                <div class="color-preview" style="background-color: ${color.value}"></div>
                <span>${color.name}</span>
                <button class="delete-color-btn" onclick="deleteColor('${color.name}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `).join('');
    }
}

// Admin stats
function updateAdminStats() {
    const totalProducts = window.EkaivaApp.products.length;
    const totalCategories = window.EkaivaApp.categories.length;
    const totalColors = window.EkaivaApp.colors.length;
    const avgPrice = totalProducts > 0 ?
        Math.round(window.EkaivaApp.products.reduce((sum, p) => sum + p.price, 0) / totalProducts) : 0;

    // Update stat displays
    const elements = {
        'total-products': totalProducts,
        'total-categories': totalCategories,
        'total-colors': totalColors,
        'avg-price': `₹${avgPrice}`
    };

    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

// Admin products table
function getFilteredAdminProducts() {
    const searchInput = document.getElementById('search-products');
    const categoryFilter = document.getElementById('filter-category');

    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const category = categoryFilter ? categoryFilter.value : '';

    return window.EkaivaApp.products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || product.category === category;
        return matchesSearch && matchesCategory;
    });
}

function renderAdminProducts() {
    const tbody = document.getElementById('products-tbody');
    const emptyState = document.getElementById('empty-products');

    if (!tbody) return;

    const filteredProducts = getFilteredAdminProducts();

    if (filteredProducts.length === 0) {
        tbody.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    tbody.innerHTML = filteredProducts.map(product => `
        <tr>
            <td>
                <div class="product-cell">
                    <img src="${product.images[0]}" alt="${product.name}">
                    <div>
                        <div class="product-name">${product.name}</div>
                        <div class="product-desc">${product.description.substring(0, 50)}...</div>
                    </div>
                </div>
            </td>
            <td>
                <span class="category-badge">${product.category}</span>
            </td>
            <td class="price-cell">₹${product.price}</td>
            <td>
                <div class="tags">
                    ${product.colors.map(color => {
        const colorObj = window.EkaivaApp.colors.find(c => c.name === color);
        return `<span class="color-tag">
                            <div class="color-dot" style="background-color: ${colorObj ? colorObj.value : '#000'}"></div>
                            ${color}
                        </span>`;
    }).join('')}
                </div>
            </td>
            <td>
                <div class="tags">
                    ${product.sizes.map(size => `<span class="tag">${size}</span>`).join('')}
                </div>
            </td>
            <td>
                <div class="actions-cell">
                    <button class="action-btn view-btn" onclick="viewProduct('${product.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="action-btn edit-btn" onclick="editProduct('${product.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteProduct('${product.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Product actions
function viewProduct(productId) {
    const product = window.EkaivaApp.products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    if (modal && modalTitle && modalBody) {
        modalTitle.textContent = `Product Details - ${product.name}`;
        modalBody.innerHTML = `
            <div class="product-view-details" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <div class="product-images">
                    <div class="main-image" style="margin-bottom: 1rem;">
                        <img src="${product.images[0]}" alt="${product.name}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 12px;">
                    </div>
                    ${product.images.length > 1 ? `
                        <div class="image-thumbnails" style="display: flex; gap: 10px;">
                            ${product.images.map(img => `<img src="${img}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px; cursor: pointer;">`).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="product-details">
                    <h1 style="font-size: 2rem; margin-bottom: 1rem; color: var(--text-primary);">${product.name}</h1>
                    <p class="price" style="font-size: 2rem; font-weight: 800; background: var(--admin-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 1rem;">₹${product.price}</p>
                    <p class="description" style="margin-bottom: 2rem; color: var(--text-secondary); line-height: 1.6;">${product.description}</p>
                    <div class="details-grid" style="display: grid; gap: 1.5rem;">
                        <div class="detail-item">
                            <strong>Category:</strong>
                            <span class="category-badge" style="margin-left: 10px;">${product.category}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Available Sizes:</strong>
                            <div class="tags" style="margin-top: 0.5rem;">
                                ${product.sizes.map(size => `<span class="tag">${size}</span>`).join('')}
                            </div>
                        </div>
                        <div class="detail-item">
                            <strong>Available Colors:</strong>
                            <div class="tags" style="margin-top: 0.5rem;">
                                ${product.colors.map(color => {
            const colorObj = window.EkaivaApp.colors.find(c => c.name === color);
            return `<span class="color-tag">
                                        <div class="color-dot" style="background-color: ${colorObj ? colorObj.value : '#000'}"></div>
                                        ${color}
                                    </span>`;
        }).join('')}
                            </div>
                        </div>
                        <div class="detail-item">
                            <strong>Date Added:</strong>
                            <span>${new Date(product.dateAdded).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        modal.style.display = 'block';
    }
}

function editProduct(productId) {
    // For now, just show a message. In a real application, you would open an edit form
    window.EkaivaApp.showNotification('Edit functionality coming soon!', 'info');
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
        window.EkaivaApp.products = window.EkaivaApp.products.filter(p => p.id !== productId);
        window.EkaivaApp.saveProducts();

        // Update displays
        updateAdminStats();
        renderAdminProducts();

        window.EkaivaApp.showNotification('Product deleted successfully!', 'success');
    }
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Make functions available globally
window.toggleProductForm = toggleProductForm;
window.toggleCategoryForm = toggleCategoryForm;
window.toggleColorForm = toggleColorForm;
window.handleImageUpload = handleImageUpload;
window.removeImagePreview = removeImagePreview;
window.addCategory = addCategory;
window.deleteCategory = deleteCategory;
window.addColor = addColor;
window.deleteColor = deleteColor;
window.viewProduct = viewProduct;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.closeProductModal = closeProductModal;