// About page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeStatistics();
    initializeTestimonials();
    initializeParallax();
});

function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Add animation class to elements
    const animateElements = document.querySelectorAll('.value-card, .stat-card, .management-card, .award-card, .reason-item');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

function initializeStatistics() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateStatistics();
            }
        });
    }, { threshold: 0.5 });

    if (statNumbers.length > 0) {
        statsObserver.observe(statNumbers[0].closest('.company-stats'));
    }
}

function animateStatistics() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach((card, index) => {
        setTimeout(() => {
            const numberElement = card.querySelector('.stat-number');
            const targetText = numberElement.textContent;
            
            // Extract number and suffix
            const matches = targetText.match(/(\d+)(.*)$/);
            if (matches) {
                const targetNumber = parseInt(matches[1]);
                const suffix = matches[2];
                
                animateNumber(numberElement, 0, targetNumber, suffix, 2000);
            }
        }, index * 200);
    });
}

function animateNumber(element, start, end, suffix, duration) {
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(start + (end - start) * easeOutQuart);
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

function initializeTestimonials() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentTestimonial = 0;
    const totalTestimonials = testimonialCards.length;
    
    function showTestimonial(index) {
        // Hide all testimonials
        testimonialCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current testimonial
        testimonialCards[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentTestimonial = index;
    }
    
    function nextTestimonial() {
        const next = (currentTestimonial + 1) % totalTestimonials;
        showTestimonial(next);
    }
    
    function prevTestimonial() {
        const prev = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
        showTestimonial(prev);
    }
    
    // Event listeners
    nextBtn.addEventListener('click', nextTestimonial);
    prevBtn.addEventListener('click', prevTestimonial);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showTestimonial(index));
    });
    
    // Auto-advance testimonials
    setInterval(nextTestimonial, 5000);
    
    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    const slider = document.querySelector('.testimonials-slider');
    
    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    slider.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextTestimonial();
            } else {
                prevTestimonial();
            }
        }
    }
}

function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.about-header, .company-stats');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rate = scrolled * -0.3;
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Interactive hover effects for management cards
const managementCards = document.querySelectorAll('.management-card');
managementCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Value cards interactive effects
const valueCards = document.querySelectorAll('.value-card');
valueCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.value-icon');
        icon.style.transform = 'scale(1.2) rotate(360deg)';
        icon.style.transition = 'transform 0.6s ease';
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.value-icon');
        icon.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Award cards interactive effects
const awardCards = document.querySelectorAll('.award-card');
awardCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.award-icon');
        icon.style.transform = 'scale(1.1) rotate(-10deg)';
        icon.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.award-icon');
        icon.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Reason items hover effects
const reasonItems = document.querySelectorAll('.reason-item');
reasonItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        const number = this.querySelector('.reason-number');
        number.style.transform = 'scale(1.2) rotate(360deg)';
        number.style.transition = 'transform 0.5s ease';
    });
    
    item.addEventListener('mouseleave', function() {
        const number = this.querySelector('.reason-number');
        number.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Manager contact interactions
document.addEventListener('click', function(e) {
    if (e.target.closest('.manager-contacts a')) {
        const link = e.target.closest('a');
        const href = link.getAttribute('href');
        const managerName = link.closest('.management-card').querySelector('h3').textContent;
        
        if (href.startsWith('mailto:')) {
            const email = href.replace('mailto:', '');
            if (confirm(`Отправить email ${managerName} (${email})?`)) {
                window.location.href = href;
            }
            e.preventDefault();
        }
    }
});

// Smooth scroll for internal links
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

// Dynamic content loading simulation
function loadDynamicContent() {
    const statCards = document.querySelectorAll('.stat-card');
    
    // Simulate loading updated statistics
    const updatedStats = [
        { number: '1547', label: 'Объектов в базе' },
        { number: '823', label: 'Довольных клиентов' },
        { number: '15', label: 'Лет на рынке' },
        { number: '52', label: 'Сделок в месяц' },
        { number: '98', label: 'Положительных отзывов' },
        { number: '5', label: 'Офисов в городе' }
    ];
    
    statCards.forEach((card, index) => {
        if (updatedStats[index]) {
            const numberElement = card.querySelector('.stat-number');
            const currentNumber = parseInt(numberElement.textContent);
            const newNumber = parseInt(updatedStats[index].number);
            
            if (currentNumber !== newNumber) {
                setTimeout(() => {
                    const suffix = numberElement.textContent.replace(/\d/g, '');
                    animateNumber(numberElement, currentNumber, newNumber, suffix, 1000);
                }, index * 100);
            }
        }
    });
}

// Add scroll-triggered animations for story section
const storySection = document.querySelector('.company-story');
if (storySection) {
    const storyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const textElement = entry.target.querySelector('.story-text');
                const imageElement = entry.target.querySelector('.story-image');
                
                if (textElement) {
                    textElement.style.animation = 'slideInLeft 0.8s ease forwards';
                }
                if (imageElement) {
                    imageElement.style.animation = 'slideInRight 0.8s ease forwards';
                }
                
                storyObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    storyObserver.observe(storySection);
}

// Add CSS animations
const additionalStyles = `
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .story-text,
    .story-image {
        opacity: 0;
    }
`;

const additionalStyleSheet = document.createElement('style');
additionalStyleSheet.textContent = additionalStyles;
document.head.appendChild(additionalStyleSheet);

// Initialize dynamic content update every 30 seconds
setInterval(loadDynamicContent, 30000);

// Add keyboard navigation for testimonials
document.addEventListener('keydown', function(e) {
    if (document.querySelector('.testimonials-slider')) {
        switch(e.key) {
            case 'ArrowLeft':
                document.querySelector('.prev-btn').click();
                break;
            case 'ArrowRight':
                document.querySelector('.next-btn').click();
                break;
        }
    }
});

// Performance optimization: pause animations when page is not visible
document.addEventListener('visibilitychange', function() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    if (document.hidden) {
        // Pause auto-advance when page is hidden
        clearInterval(window.testimonialInterval);
    } else {
        // Resume auto-advance when page becomes visible
        window.testimonialInterval = setInterval(() => {
            document.querySelector('.next-btn').click();
        }, 5000);
    }
});