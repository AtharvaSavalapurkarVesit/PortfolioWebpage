// Slideshow functionality
let slideIndex = 0;
let slides = [];
let dots = [];
let slideInterval;

// Initialize slideshow
function showSlides() {
    // Make sure we have slides to work with
    if (slides.length === 0) return;
    
    // Hide all slides
    slides.forEach(slide => {
        slide.style.opacity = '0';
        slide.classList.remove('active');
    });
    
    // Remove active class from all dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Show current slide
    slides[slideIndex].style.opacity = '1';
    slides[slideIndex].classList.add('active');
    
    // Activate current dot
    if (dots[slideIndex]) {
        dots[slideIndex].classList.add('active');
    }
}

// Function to show specific slide
function currentSlide(n) {
    slideIndex = n - 1;
    showSlides();
}

// Auto-advance slides
function autoAdvance() {
    if (slides.length === 0) return;
    
    slideIndex++;
    if (slideIndex >= slides.length) {
        slideIndex = 0;
    }
    showSlides();
}

// Start auto-advance
function startSlideshow() {
    // Clear any existing interval
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    
    // Start auto-advance every 2 seconds
    slideInterval = setInterval(autoAdvance, 2000);
}

// Stop auto-advance
function stopSlideshow() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

// Initialize slideshow when DOM is ready
function initSlideshow() {
    slides = document.querySelectorAll('.slide');
    dots = document.querySelectorAll('.dot');
    
    console.log('Found slides:', slides.length);
    console.log('Found dots:', dots.length);
    
    if (slides.length > 0) {
        // Show first slide
        showSlides();
        
        // Start auto-advance
        startSlideshow();
        
        // Add hover pause functionality
        const slideshowContainer = document.querySelector('.slideshow-container');
        if (slideshowContainer) {
            slideshowContainer.addEventListener('mouseenter', stopSlideshow);
            slideshowContainer.addEventListener('mouseleave', startSlideshow);
        }
        
        // Add touch events
        addTouchEvents();
        
        console.log('Slideshow initialized successfully');
    } else {
        console.log('No slides found, slideshow not initialized');
    }
}

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Show success message (in a real application, you would send this to a server)
        alert('Thank you for your message! I will get back to you soon.');
        
        // Reset form
        this.reset();
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme toggle
    initializeThemeToggle();
    
    // Initialize slideshow properly
    initSlideshow();
    
    // Add animation to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Add animation to portfolio items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
});

// Navbar scroll effect
let lastScrollY = window.scrollY;
let ticking = false;

function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScrollY = scrollY;
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick, { passive: true });

// Theme Toggle Functionality
function initializeThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = themeToggleBtn?.querySelector('.theme-icon');

    if (themeToggleBtn && themeIcon) {
        // Check for saved theme preference or default to 'light'
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateThemeIcon(currentTheme, themeIcon);

        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            // Use requestAnimationFrame for smooth theme switching
            requestAnimationFrame(() => {
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateThemeIcon(newTheme, themeIcon);
            });
        });
    }
}

// Initialize theme immediately if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
} else {
    // DOM is already loaded, initialize theme immediately
    initializeThemeToggle();
    // Also initialize slideshow if DOM is ready
    initSlideshow();
}

function updateThemeIcon(theme, themeIcon) {
    if (themeIcon) {
        if (theme === 'dark') {
            themeIcon.textContent = '☀️';
        } else {
            themeIcon.textContent = '🌙';
        }
    }
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Keyboard navigation for slideshow
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        slideIndex = (slideIndex - 1 + slides.length) % slides.length;
        showSlides();
    } else if (e.key === 'ArrowRight') {
        slideIndex = (slideIndex + 1) % slides.length;
        showSlides();
    }
});

// Touch/swipe support for mobile slideshow
let touchStartX = 0;
let touchEndX = 0;

// Add touch events after slideshow is initialized
function addTouchEvents() {
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        slideshowContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            slideIndex = (slideIndex + 1) % slides.length;
        } else {
            // Swipe right - previous slide
            slideIndex = (slideIndex - 1 + slides.length) % slides.length;
        }
        showSlides();
    }
} 