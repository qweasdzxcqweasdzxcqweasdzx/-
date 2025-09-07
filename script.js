// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for anchor links
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

    // Search form functionality
    const searchBtn = document.querySelector('.search-btn');
    const searchInputs = document.querySelectorAll('.search-select, .search-input');
    
    searchBtn.addEventListener('click', function() {
        const searchData = {
            type: searchInputs[0].value,
            operation: searchInputs[1].value,
            location: searchInputs[2].value
        };
        
        // Here you would typically send this data to a server
        console.log('Search parameters:', searchData);
        
        // For demo purposes, show an alert
        if (searchData.location.trim() === '') {
            alert('Пожалуйста, укажите город или район для поиска');
        } else {
            alert(`Поиск: ${searchData.type} для ${searchData.operation} в ${searchData.location}`);
            // Redirect to catalog page with search parameters
            window.location.href = `catalog.html?type=${encodeURIComponent(searchData.type)}&operation=${encodeURIComponent(searchData.operation)}&location=${encodeURIComponent(searchData.location)}`;
        }
    });

    // Property card hover effects
    const propertyCards = document.querySelectorAll('.property-card');
    propertyCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Animated counter for statistics
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateValue(entry.target);
            }
        });
    }, observerOptions);

    // Observe all stat items
    document.querySelectorAll('.stat-item h3').forEach(stat => {
        observer.observe(stat);
    });

    function animateValue(element) {
        const target = parseInt(element.textContent.replace(/\D/g, ''));
        const increment = target / 50;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            let suffix = element.textContent.replace(/\d/g, '').replace(/\s/g, '');
            element.textContent = Math.floor(current) + suffix;
        }, 30);
    }

    // Form validation helper
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePhone(phone) {
        const re = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return re.test(phone);
    }

    // Add to global scope for use in other pages
    window.validateEmail = validateEmail;
    window.validatePhone = validatePhone;

    // Property favorites functionality
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    function toggleFavorite(propertyId) {
        const index = favorites.indexOf(propertyId);
        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(propertyId);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoriteButtons();
    }

    function updateFavoriteButtons() {
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            const propertyId = btn.dataset.propertyId;
            if (favorites.includes(propertyId)) {
                btn.classList.add('active');
                btn.innerHTML = '<i class="fas fa-heart"></i>';
            } else {
                btn.classList.remove('active');
                btn.innerHTML = '<i class="far fa-heart"></i>';
            }
        });
    }

    // Add to global scope
    window.toggleFavorite = toggleFavorite;
    window.updateFavoriteButtons = updateFavoriteButtons;

    // Initialize favorites
    updateFavoriteButtons();

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // Back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        z-index: 1000;
        transition: all 0.3s;
    `;
    
    document.body.appendChild(backToTopBtn);

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    // Loading animation
    function showLoading() {
        const loader = document.createElement('div');
        loader.className = 'loader';
        loader.innerHTML = '<div class="spinner"></div>';
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255,255,255,0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;
        
        const spinner = loader.querySelector('.spinner');
        spinner.style.cssText = `
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #007bff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        `;
        
        document.body.appendChild(loader);
        return loader;
    }

    function hideLoading(loader) {
        if (loader) {
            loader.remove();
        }
    }

    // Add CSS animation for spinner
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    `;
    document.head.appendChild(style);

    // Add to global scope
    window.showLoading = showLoading;
    window.hideLoading = hideLoading;
});