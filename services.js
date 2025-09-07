// Services page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeServiceInteractions();
    initializePricingCalculator();
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

    // Observe all animatable elements
    const animateElements = document.querySelectorAll('.service-card, .additional-card, .benefit-card, .pricing-card, .process-step');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

function initializeServiceInteractions() {
    // Service card hover effects
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Service button interactions
    const serviceButtons = document.querySelectorAll('.service-btn, .pricing-btn');
    serviceButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const serviceName = this.closest('.service-card, .pricing-card').querySelector('h3').textContent;
            showServiceModal(serviceName);
        });
    });

    // Additional service cards interactions
    const additionalCards = document.querySelectorAll('.additional-card');
    additionalCards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceName = this.querySelector('h4').textContent;
            const price = this.querySelector('.additional-price').textContent;
            
            if (confirm(`Заказать услугу "${serviceName}" (${price})?`)) {
                window.location.href = `contacts.html?service=${encodeURIComponent(serviceName)}`;
            }
        });
        
        card.style.cursor = 'pointer';
    });
}

function showServiceModal(serviceName) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'service-modal-overlay';
    modal.innerHTML = `
        <div class="service-modal">
            <div class="modal-header">
                <h3>Заказать услугу: ${serviceName}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-content">
                <p>Вы выбрали услугу: <strong>${serviceName}</strong></p>
                <p>Заполните форму ниже, и мы свяжемся с вами в ближайшее время:</p>
                
                <form class="quick-order-form">
                    <div class="form-group">
                        <input type="text" placeholder="Ваше имя" required>
                    </div>
                    <div class="form-group">
                        <input type="tel" placeholder="Телефон" required>
                    </div>
                    <div class="form-group">
                        <input type="email" placeholder="Email">
                    </div>
                    <div class="form-group">
                        <textarea placeholder="Дополнительная информация" rows="3"></textarea>
                    </div>
                    <div class="modal-actions">
                        <button type="submit" class="btn-primary">Отправить заявку</button>
                        <button type="button" class="btn-secondary modal-cancel">Отмена</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyles = `
        .service-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: modalFadeIn 0.3s ease;
        }
        
        .service-modal {
            background: white;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            animation: modalSlideIn 0.3s ease;
        }
        
        .modal-header {
            padding: 1.5rem;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-header h3 {
            margin: 0;
            color: #333;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-content {
            padding: 1.5rem;
        }
        
        .quick-order-form .form-group {
            margin-bottom: 1rem;
        }
        
        .quick-order-form input,
        .quick-order-form textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
        }
        
        .modal-actions {
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;
        }
        
        .modal-actions button {
            flex: 1;
            padding: 0.75rem;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s;
        }
        
        @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes modalSlideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    
    // Add styles to head if not already added
    if (!document.querySelector('#modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = modalStyles;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(modal);
    
    // Handle modal interactions
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    const form = modal.querySelector('.quick-order-form');
    
    function closeModal() {
        modal.style.animation = 'modalFadeIn 0.3s ease reverse';
        setTimeout(() => modal.remove(), 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simulate form submission
        const submitBtn = form.querySelector('.btn-primary');
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
            closeModal();
        }, 1500);
    });
}

function initializePricingCalculator() {
    // Add calculation functionality for pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        const priceElement = card.querySelector('.price');
        const originalPrice = priceElement.textContent;
        
        // Add hover effect to show price examples
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('calculating')) {
                this.classList.add('calculating');
                showPriceExample(this, originalPrice);
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('calculating');
            priceElement.textContent = originalPrice;
        });
    });
}

function showPriceExample(card, originalPrice) {
    const priceElement = card.querySelector('.price');
    const examples = [
        { property: '5 млн ₽', calculation: '50,000 ₽' },
        { property: '10 млн ₽', calculation: '100,000 ₽' },
        { property: '15 млн ₽', calculation: '150,000 ₽' }
    ];
    
    const percentage = parseInt(originalPrice);
    let currentExample = 0;
    
    const interval = setInterval(() => {
        if (card.classList.contains('calculating')) {
            const example = examples[currentExample];
            const calculatedPrice = Math.round(parseInt(example.property.replace(/\D/g, '')) * percentage / 100);
            priceElement.innerHTML = `${calculatedPrice.toLocaleString()} ₽<br><small>от ${example.property}</small>`;
            currentExample = (currentExample + 1) % examples.length;
        } else {
            clearInterval(interval);
        }
    }, 1500);
}

// Process step animations
function animateProcessSteps() {
    const steps = document.querySelectorAll('.process-step');
    
    steps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateX(-50px)';
        
        setTimeout(() => {
            step.style.transition = 'all 0.6s ease';
            step.style.opacity = '1';
            step.style.transform = 'translateX(0)';
        }, index * 200);
    });
}

// Initialize process animation when section comes into view
const processSection = document.querySelector('.process-section');
if (processSection) {
    const processObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProcessSteps();
                processObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    processObserver.observe(processSection);
}

// Benefit cards interactive effects
const benefitCards = document.querySelectorAll('.benefit-card');
benefitCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.benefit-icon');
        icon.style.transform = 'scale(1.1) rotate(360deg)';
        icon.style.transition = 'transform 0.6s ease';
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.benefit-icon');
        icon.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Smooth scroll for CTA buttons
document.querySelectorAll('.cta-buttons a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
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

// Add loading states to all buttons
document.querySelectorAll('.service-btn, .pricing-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (!this.classList.contains('loading')) {
            const originalText = this.textContent;
            this.classList.add('loading');
            this.textContent = 'Загрузка...';
            
            setTimeout(() => {
                this.classList.remove('loading');
                this.textContent = originalText;
            }, 1000);
        }
    });
});

// Add ripple effect to buttons
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = button.querySelector('.ripple');
    if (ripple) {
        ripple.remove();
    }
    
    button.appendChild(circle);
}

// Add ripple effect styles
const rippleStyles = `
    .service-btn, .pricing-btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 600ms linear;
        background-color: rgba(255, 255, 255, 0.6);
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

const rippleStyleSheet = document.createElement('style');
rippleStyleSheet.textContent = rippleStyles;
document.head.appendChild(rippleStyleSheet);

// Add ripple effect to buttons
document.querySelectorAll('.service-btn, .pricing-btn').forEach(btn => {
    btn.addEventListener('click', createRipple);
});