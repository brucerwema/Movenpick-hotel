// ================================
// ABOUT PAGE - LANGUAGE & THEME
// ================================

document.addEventListener("DOMContentLoaded", () => {
    initLanguage();
    initDarkMode();
    initAnimations();
});

// ================================
// 1. LANGUAGE SYSTEM
// ================================
const translations = {
    en: null,
    fr: null,
    rw: {},
    sw: {}
};

let currentLanguage = 'en';

async function initLanguage() {
    const languageSelect = document.getElementById('languageSelect');
    if (!languageSelect) return;
    
    // Load saved language preference
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    languageSelect.value = savedLanguage;
    currentLanguage = savedLanguage;
    
    // Load translations
    await loadTranslations(savedLanguage);
    
    // Apply translations
    applyTranslations();
    
    // Language change handler
    languageSelect.addEventListener('change', async (e) => {
        const newLanguage = e.target.value;
        currentLanguage = newLanguage;
        localStorage.setItem('selectedLanguage', newLanguage);
        await loadTranslations(newLanguage);
        applyTranslations();
    });
}

async function loadTranslations(lang) {
    // Only load if not already loaded
    if (translations[lang] !== null && Object.keys(translations[lang]).length > 0) {
        return;
    }
    
    try {
        const response = await fetch(`about-${lang}.json`);
        if (response.ok) {
            translations[lang] = await response.json();
        } else {
            console.warn(`Translation file for ${lang} not found, using English`);
            if (lang !== 'en') {
                // Fall back to English
                const enResponse = await fetch('about-en.json');
                if (enResponse.ok) {
                    translations['en'] = await enResponse.json();
                    translations[lang] = translations['en'];
                }
            }
        }
    } catch (error) {
        console.error(`Error loading translations for ${lang}:`, error);
    }
}

function applyTranslations() {
    const currentTranslations = translations[currentLanguage] || translations['en'] || {};
    
    // Find all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (currentTranslations[key]) {
            // Check if element has children that should be preserved
            if (element.children.length === 0) {
                element.textContent = currentTranslations[key];
            } else {
                // For elements with children (like buttons with icons), update text nodes only
                const walker = document.createTreeWalker(
                    element,
                    NodeFilter.SHOW_TEXT,
                    null,
                    false
                );
                
                let node;
                while (node = walker.nextNode()) {
                    if (node.nodeValue.trim()) {
                        node.nodeValue = currentTranslations[key];
                        break;
                    }
                }
            }
        }
    });
}

// ================================
// 2. DARK MODE
// ================================
function initDarkMode() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    
    // Load saved preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
        toggle.checked = true;
    }
    
    // Save preference on change
    toggle.addEventListener('change', () => {
        localStorage.setItem('darkMode', toggle.checked);
    });
}

// ================================
// 3. SCROLL ANIMATIONS
// ================================
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe sections
    const sections = document.querySelectorAll('.about-content, .leadership-section, .owner-vision, .values-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Observe cards
    const cards = document.querySelectorAll('.leader-card, .value-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// ================================
// 4. SMOOTH SCROLL
// ================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ================================
// 5. COUNTER ANIMATION
// ================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = counter.textContent.replace(/[^0-9]/g, '');
                const suffix = counter.textContent.replace(/[0-9]/g, '');
                const duration = 2000;
                const step = (target / duration) * 10;
                
                let current = 0;
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        counter.textContent = target + suffix;
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current) + suffix;
                    }
                }, 10);
                
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

// Initialize counter animation
window.addEventListener('load', animateCounters);
