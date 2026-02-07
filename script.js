// ================================
// MÖVENPICK - ENHANCED INTERACTIVE SCRIPT
// ================================

document.addEventListener("DOMContentLoaded", () => {
    initSlideshow();
    initMenuNavigation();
    initDarkMode();
    initAuth();
    initCart();
    initModals();
    initMenuFilters();
    initLiveSearch();
    initScrollAnimations();
    initParallaxEffect();
    initLazyLoading();
    initTooltips();
    initAccordions();
    initImageGallery();
    initFormValidation();
    initInfiniteScroll();
    initDragAndDrop();
    initRatingSystem();
    initCounterAnimation();
    initProgressBars();
    initTypewriterEffect();
    initStickyHeader();
    initBackToTop();
    initReadingProgress();
    initColorPicker();
    initPriceRangeSlider();
    initShareButtons();
    initCopyToClipboard();
    initAutoSave();
    initKeyboardShortcuts();
});

// ================================
// 1. HERO SLIDESHOW (Enhanced)
// ================================
let currentSlide = 0;
let slideInterval;

function initSlideshow() {
    const slides = document.querySelectorAll('[data-slide]');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('[data-slide-prev]');
    const nextBtn = document.querySelector('[data-slide-next]');
    
    if (slides.length === 0) return;
    
    // Add touch support for mobile swipe
    let touchStartX = 0;
    let touchEndX = 0;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'slide-left', 'slide-right');
            if (i < index) slide.classList.add('slide-left');
            if (i > index) slide.classList.add('slide-right');
        });
        indicators.forEach(ind => ind.classList.remove('active'));
        
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }
    
    function startAutoPlay() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoPlay() {
        if (slideInterval) clearInterval(slideInterval);
    }
    
    // Navigation
    if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoPlay(); prevSlide(); startAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoPlay(); nextSlide(); startAutoPlay(); });
    
    // Indicators
    indicators.forEach((ind, index) => {
        ind.addEventListener('click', () => {
            stopAutoPlay();
            showSlide(index);
            startAutoPlay();
        });
    });
    
    // Touch/Swipe support
    const slideshow = document.querySelector('[data-slideshow]');
    if (slideshow) {
        slideshow.addEventListener('mouseenter', stopAutoPlay);
        slideshow.addEventListener('mouseleave', startAutoPlay);
        
        slideshow.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        slideshow.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) nextSlide();
        if (touchEndX > touchStartX + 50) prevSlide();
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
    
    startAutoPlay();
}

// ================================
// 2. MENU NAVIGATION (Enhanced)
// ================================
function initMenuNavigation() {
    const menuSelect = document.getElementById('menuSelect');
    if (!menuSelect) return;
    
    menuSelect.addEventListener('change', (e) => {
        const target = e.target.value;
        if (target) {
            const element = document.querySelector(target);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Add highlight animation
                element.classList.add('highlight-section');
                setTimeout(() => element.classList.remove('highlight-section'), 2000);
            }
            setTimeout(() => menuSelect.value = '', 300);
        }
    });
}

// ================================
// 3. DARK MODE (Enhanced with Transition)
// ================================
function initDarkMode() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
        document.body.classList.add('dark-mode');
        toggle.checked = true;
    }
    
    toggle.addEventListener('change', () => {
        document.body.classList.add('theme-transitioning');
        
        if (toggle.checked) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        localStorage.setItem('darkMode', toggle.checked);
        
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
    });
}

// ================================
// 4. CART SYSTEM (Enhanced)
// ================================
function initCart() {
    updateCartCount();
    
    const addToCartButtons = document.querySelectorAll('[data-add-cart]');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const menuItem = e.target.closest('[data-item-name]');
            if (menuItem) {
                const itemName = menuItem.dataset.itemName;
                const itemPrice = parseInt(menuItem.dataset.itemPrice);
                
                // Add button animation
                button.classList.add('adding');
                setTimeout(() => button.classList.remove('adding'), 600);
                
                addToCart(itemName, itemPrice);
                showCartNotification(itemName);
            }
        });
    });
    
    // Cart preview on hover
    const cartButton = document.querySelector('[data-cart-button]');
    if (cartButton) {
        cartButton.addEventListener('mouseenter', showCartPreview);
    }
}

function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    animateCartBadge();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const badge = document.getElementById('cartCount');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

function animateCartBadge() {
    const badge = document.getElementById('cartCount');
    if (badge) {
        badge.classList.add('bounce');
        setTimeout(() => badge.classList.remove('bounce'), 500);
    }
}

function showCartPreview() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) return;
    
    // Create preview element (simplified)
    const preview = document.createElement('div');
    preview.className = 'cart-preview';
    preview.innerHTML = `
        <div class="cart-preview-items">
            ${cart.map(item => `
                <div class="cart-preview-item">
                    <span>${item.name} x${item.quantity}</span>
                    <span>${formatPrice(item.price * item.quantity)}</span>
                </div>
            `).join('')}
        </div>
        <div class="cart-preview-total">
            Total: ${formatPrice(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
        </div>
    `;
    
    // Position and show preview
    // Implementation details would go here
}

function showCartNotification(itemName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${itemName} added to cart!</span>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #28a745, #20c997);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ================================
// 5. AUTH SYSTEM
// ================================
function initAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        showLoggedInState(user);
    }
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('auth/login.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            localStorage.setItem('user', JSON.stringify(result.user));
            showLoggedInState(result.user);
            window.location.hash = '';
            showNotification('Login successful!', 'success');
        } else {
            showNotification(result.error || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Login failed. Please try again.', 'error');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    
    if (password !== confirm) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    const formData = new FormData(e.target);
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('auth/signup.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            localStorage.setItem('user', JSON.stringify(result.user));
            showLoggedInState(result.user);
            window.location.hash = '';
            showNotification('Account created successfully!', 'success');
        } else {
            showNotification(result.error || 'Signup failed', 'error');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showNotification('Signup failed. Please try again.', 'error');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

function showLoggedInState(user) {
    const loginBtn = document.getElementById('loginButton');
    const accountBtn = document.getElementById('accountButton');
    const userName = document.getElementById('userName');
    
    if (loginBtn) loginBtn.style.display = 'none';
    if (accountBtn) accountBtn.style.display = 'flex';
    if (userName) userName.textContent = user.name || 'Account';
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ================================
// 6. MODAL MANAGEMENT (Enhanced)
// ================================
function initModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal-close');
    
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = btn.closest('.modal');
            closeModal(modal);
        });
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal:target');
            if (openModal) closeModal(openModal);
        }
    });
    
    // Trap focus within modal
    modals.forEach(modal => {
        modal.addEventListener('keydown', trapFocus);
    });
}

function closeModal(modal) {
    modal.classList.add('closing');
    setTimeout(() => {
        window.location.hash = '';
        modal.classList.remove('closing');
    }, 300);
}

function trapFocus(e) {
    if (e.key !== 'Tab') return;
    
    const modal = e.currentTarget;
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
    }
}

// ================================
// 7. MENU FILTERS
// ================================
function initMenuFilters() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const menuItems = document.querySelectorAll('[data-category]');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter items with animation
            menuItems.forEach((item, index) => {
                const category = item.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.classList.add('fade-in');
                    }, index * 50);
                } else {
                    item.classList.remove('fade-in');
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ================================
// 8. LIVE SEARCH
// ================================
function initLiveSearch() {
    const searchInput = document.getElementById('menuSearch');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        
        searchTimeout = setTimeout(() => {
            const query = e.target.value.toLowerCase();
            const menuItems = document.querySelectorAll('[data-item-name]');
            let resultsCount = 0;
            
            menuItems.forEach(item => {
                const itemName = item.dataset.itemName.toLowerCase();
                const itemDescription = item.querySelector('.item-description')?.textContent.toLowerCase() || '';
                
                if (itemName.includes(query) || itemDescription.includes(query)) {
                    item.style.display = 'block';
                    item.classList.add('search-result');
                    resultsCount++;
                } else {
                    item.style.display = 'none';
                    item.classList.remove('search-result');
                }
            });
            
            // Show/hide "no results" message
            updateSearchResults(resultsCount, query);
        }, 300);
    });
}

function updateSearchResults(count, query) {
    let resultsMessage = document.getElementById('searchResults');
    
    if (!resultsMessage) {
        resultsMessage = document.createElement('div');
        resultsMessage.id = 'searchResults';
        resultsMessage.className = 'search-results-message';
        const menuSection = document.querySelector('.menu-section');
        if (menuSection) menuSection.prepend(resultsMessage);
    }
    
    if (query === '') {
        resultsMessage.style.display = 'none';
    } else {
        resultsMessage.style.display = 'block';
        resultsMessage.textContent = count > 0 
            ? `Found ${count} result${count !== 1 ? 's' : ''} for "${query}"`
            : `No results found for "${query}"`;
    }
}

// ================================
// 9. SCROLL ANIMATIONS
// ================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .menu-item, .value-card, .leader-card');
    animatedElements.forEach(el => observer.observe(el));
}

// ================================
// 10. PARALLAX EFFECT
// ================================
function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ================================
// 11. LAZY LOADING IMAGES
// ================================
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// ================================
// 12. TOOLTIPS
// ================================
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = element.dataset.tooltip;
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            
            element.tooltipElement = tooltip;
        });
        
        element.addEventListener('mouseleave', (e) => {
            if (element.tooltipElement) {
                element.tooltipElement.remove();
                element.tooltipElement = null;
            }
        });
    });
}

// ================================
// 13. ACCORDIONS
// ================================
function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordion = header.parentElement;
            const content = accordion.querySelector('.accordion-content');
            const isOpen = accordion.classList.contains('open');
            
            // Close all accordions
            document.querySelectorAll('.accordion').forEach(acc => {
                acc.classList.remove('open');
                acc.querySelector('.accordion-content').style.maxHeight = null;
            });
            
            // Open clicked accordion if it was closed
            if (!isOpen) {
                accordion.classList.add('open');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
}

// ================================
// 14. IMAGE GALLERY/LIGHTBOX
// ================================
function initImageGallery() {
    const galleryImages = document.querySelectorAll('[data-gallery]');
    
    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            openLightbox(img.src, img.alt);
        });
        img.style.cursor = 'pointer';
    });
}

function openLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="${src}" alt="${alt}">
            <div class="lightbox-caption">${alt}</div>
        </div>
    `;
    
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
            closeLightbox(lightbox);
        }
    });
    
    document.addEventListener('keydown', function closeLightboxOnEsc(e) {
        if (e.key === 'Escape') {
            closeLightbox(lightbox);
            document.removeEventListener('keydown', closeLightboxOnEsc);
        }
    });
}

function closeLightbox(lightbox) {
    lightbox.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
        lightbox.remove();
        document.body.style.overflow = '';
    }, 300);
}

// ================================
// 15. FORM VALIDATION
// ================================
function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('invalid')) {
                    validateField(input);
                }
            });
        });
        
        form.addEventListener('submit', (e) => {
            let isValid = true;
            
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showNotification('Please fix the errors in the form', 'error');
            }
        });
    });
}

function validateField(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required check
    if (input.hasAttribute('required') && value === '') {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (input.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email';
        }
    }
    
    // Phone validation
    if (input.type === 'tel' && value !== '') {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value) || value.length < 10) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // Min length
    if (input.hasAttribute('minlength') && value.length < input.getAttribute('minlength')) {
        isValid = false;
        errorMessage = `Minimum ${input.getAttribute('minlength')} characters required`;
    }
    
    // Update UI
    if (isValid) {
        input.classList.remove('invalid');
        input.classList.add('valid');
        removeErrorMessage(input);
    } else {
        input.classList.remove('valid');
        input.classList.add('invalid');
        showErrorMessage(input, errorMessage);
    }
    
    return isValid;
}

function showErrorMessage(input, message) {
    removeErrorMessage(input);
    
    const error = document.createElement('div');
    error.className = 'field-error';
    error.textContent = message;
    input.parentNode.appendChild(error);
}

function removeErrorMessage(input) {
    const existingError = input.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// ================================
// 16. INFINITE SCROLL
// ================================
function initInfiniteScroll() {
    const scrollContainer = document.querySelector('[data-infinite-scroll]');
    if (!scrollContainer) return;
    
    let loading = false;
    let page = 1;
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.innerHeight + window.pageYOffset;
        const threshold = document.body.offsetHeight - 500;
        
        if (scrollPosition >= threshold && !loading) {
            loadMoreItems();
        }
    });
    
    function loadMoreItems() {
        loading = true;
        page++;
        
        // Show loading indicator
        const loader = document.createElement('div');
        loader.className = 'loading-spinner';
        loader.textContent = 'Loading...';
        scrollContainer.appendChild(loader);
        
        // Simulate API call
        setTimeout(() => {
            loader.remove();
            loading = false;
            // Add new items here
        }, 1000);
    }
}

// ================================
// 17. DRAG AND DROP
// ================================
function initDragAndDrop() {
    const draggables = document.querySelectorAll('[data-draggable]');
    const dropZones = document.querySelectorAll('[data-drop-zone]');
    
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => {
            draggable.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', draggable.innerHTML);
        });
        
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
        });
    });
    
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('drag-over');
        });
        
        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });
        
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            
            const data = e.dataTransfer.getData('text/html');
            // Handle drop logic here
        });
    });
}

// ================================
// 18. RATING SYSTEM
// ================================
function initRatingSystem() {
    const ratingContainers = document.querySelectorAll('[data-rating]');
    
    ratingContainers.forEach(container => {
        const stars = container.querySelectorAll('.star');
        let currentRating = 0;
        
        stars.forEach((star, index) => {
            star.addEventListener('mouseenter', () => {
                highlightStars(stars, index + 1);
            });
            
            star.addEventListener('click', () => {
                currentRating = index + 1;
                container.dataset.rating = currentRating;
                showNotification(`You rated this ${currentRating} star${currentRating > 1 ? 's' : ''}`, 'success');
            });
        });
        
        container.addEventListener('mouseleave', () => {
            highlightStars(stars, currentRating);
        });
    });
}

function highlightStars(stars, count) {
    stars.forEach((star, index) => {
        if (index < count) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// ================================
// 19. COUNTER ANIMATION
// ================================
function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-counter]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.counter);
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

// ================================
// 20. PROGRESS BARS
// ================================
function initProgressBars() {
    const progressBars = document.querySelectorAll('[data-progress]');
    
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const progress = bar.dataset.progress;
                const fill = bar.querySelector('.progress-fill');
                
                if (fill) {
                    setTimeout(() => {
                        fill.style.width = progress + '%';
                    }, 100);
                }
                
                progressObserver.unobserve(bar);
            }
        });
    });
    
    progressBars.forEach(bar => progressObserver.observe(bar));
}

// ================================
// 21. TYPEWRITER EFFECT
// ================================
function initTypewriterEffect() {
    const typewriterElements = document.querySelectorAll('[data-typewriter]');
    
    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        let index = 0;
        
        const type = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, 100);
            }
        };
        
        // Start when element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    type();
                    observer.unobserve(element);
                }
            });
        });
        
        observer.observe(element);
    });
}

// ================================
// 22. STICKY HEADER
// ================================
function initStickyHeader() {
    const header = document.querySelector('.main-header');
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
            
            // Hide on scroll down, show on scroll up
            if (currentScroll > lastScroll) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
        } else {
            header.classList.remove('scrolled', 'hidden');
        }
        
        lastScroll = currentScroll;
    });
}

// ================================
// 23. BACK TO TOP BUTTON
// ================================
function initBackToTop() {
    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(button);
    
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 9999;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ================================
// 24. READING PROGRESS BAR
// ================================
function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        z-index: 10001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// ================================
// 25. COLOR PICKER
// ================================
function initColorPicker() {
    const colorPickers = document.querySelectorAll('[data-color-picker]');
    
    colorPickers.forEach(picker => {
        picker.addEventListener('input', (e) => {
            const target = e.target.dataset.colorTarget;
            if (target) {
                document.documentElement.style.setProperty(target, e.target.value);
            }
        });
    });
}

// ================================
// 26. PRICE RANGE SLIDER
// ================================
function initPriceRangeSlider() {
    const sliders = document.querySelectorAll('[data-price-slider]');
    
    sliders.forEach(slider => {
        const minInput = slider.querySelector('[data-min]');
        const maxInput = slider.querySelector('[data-max]');
        const display = slider.querySelector('[data-display]');
        
        if (!minInput || !maxInput) return;
        
        const updatePriceRange = () => {
            const min = parseInt(minInput.value);
            const max = parseInt(maxInput.value);
            
            if (display) {
                display.textContent = `${formatPrice(min)} - ${formatPrice(max)}`;
            }
            
            // Filter items by price
            filterByPrice(min, max);
        };
        
        minInput.addEventListener('input', updatePriceRange);
        maxInput.addEventListener('input', updatePriceRange);
    });
}

function filterByPrice(min, max) {
    const items = document.querySelectorAll('[data-item-price]');
    
    items.forEach(item => {
        const price = parseInt(item.dataset.itemPrice);
        
        if (price >= min && price <= max) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// ================================
// 27. SHARE BUTTONS
// ================================
function initShareButtons() {
    const shareButtons = document.querySelectorAll('[data-share]');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', () => {
            const platform = button.dataset.share;
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            
            let shareUrl;
            
            switch(platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${title}%20${url}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}

// ================================
// 28. COPY TO CLIPBOARD
// ================================
function initCopyToClipboard() {
    const copyButtons = document.querySelectorAll('[data-copy]');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const textToCopy = button.dataset.copy;
            
            try {
                await navigator.clipboard.writeText(textToCopy);
                showNotification('Copied to clipboard!', 'success');
                
                // Visual feedback
                button.classList.add('copied');
                setTimeout(() => button.classList.remove('copied'), 2000);
            } catch (err) {
                showNotification('Failed to copy', 'error');
            }
        });
    });
}

// ================================
// 29. AUTO-SAVE FORMS
// ================================
function initAutoSave() {
    const autoSaveForms = document.querySelectorAll('[data-autosave]');
    
    autoSaveForms.forEach(form => {
        const formId = form.id || 'form-' + Math.random();
        
        // Load saved data
        const savedData = localStorage.getItem(`autosave-${formId}`);
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(name => {
                const input = form.querySelector(`[name="${name}"]`);
                if (input) input.value = data[name];
            });
        }
        
        // Save on input
        form.addEventListener('input', debounce(() => {
            const formData = new FormData(form);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            localStorage.setItem(`autosave-${formId}`, JSON.stringify(data));
            
            // Show save indicator
            showAutoSaveIndicator();
        }, 1000));
        
        // Clear on submit
        form.addEventListener('submit', () => {
            localStorage.removeItem(`autosave-${formId}`);
        });
    });
}

function showAutoSaveIndicator() {
    let indicator = document.getElementById('autosave-indicator');
    
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'autosave-indicator';
        indicator.textContent = 'Draft saved';
        indicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: #28a745;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            font-size: 0.875rem;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 9999;
        `;
        document.body.appendChild(indicator);
    }
    
    indicator.style.opacity = '1';
    
    setTimeout(() => {
        indicator.style.opacity = '0';
    }, 2000);
}

// ================================
// 30. KEYBOARD SHORTCUTS
// ================================
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('menuSearch');
            if (searchInput) searchInput.focus();
        }
        
        // Ctrl/Cmd + / for help
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            showKeyboardShortcutsHelp();
        }
        
        // Escape to clear search
        if (e.key === 'Escape') {
            const searchInput = document.getElementById('menuSearch');
            if (searchInput && document.activeElement === searchInput) {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
                searchInput.blur();
            }
        }
    });
}

function showKeyboardShortcutsHelp() {
    const helpModal = document.createElement('div');
    helpModal.className = 'shortcuts-help';
    helpModal.innerHTML = `
        <div class="shortcuts-content">
            <h3>Keyboard Shortcuts</h3>
            <ul>
                <li><kbd>Ctrl</kbd> + <kbd>K</kbd> - Focus search</li>
                <li><kbd>Ctrl</kbd> + <kbd>/</kbd> - Show this help</li>
                <li><kbd>Esc</kbd> - Close modals / Clear search</li>
                <li><kbd>←</kbd> <kbd>→</kbd> - Navigate slideshow</li>
            </ul>
            <button class="close-help">Close</button>
        </div>
    `;
    
    helpModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    document.body.appendChild(helpModal);
    
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal || e.target.classList.contains('close-help')) {
            helpModal.remove();
        }
    });
}

// ================================
// UTILITY FUNCTIONS
// ================================

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Format price
window.formatPrice = function(price) {
    return parseInt(price).toLocaleString() + ' RWF';
};

// Logout function
window.logout = function() {
    localStorage.removeItem('user');
    window.location.reload();
};

// ================================
// 7. SMOOTH SCROLL
// ================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        if (href === '#' || href.includes('-modal')) return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ================================
// PERFORMANCE MONITORING
// ================================
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            console.log('Performance:', entry.name, entry.duration);
        }
    });
    observer.observe({ entryTypes: ['measure', 'navigation'] });
}

console.log('🎉 All interactive features loaded successfully!');