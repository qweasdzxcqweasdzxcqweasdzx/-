// Contacts page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeFAQ();
    initializePhoneMask();
});

function initializeContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.submit-btn');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearError(this);
        });
    });
}

function validateForm() {
    const form = document.getElementById('contactForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const formGroup = field.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    let isValid = true;
    let message = '';
    
    // Remove previous error state
    clearError(field);
    
    // Check required fields
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        message = 'Это поле обязательно для заполнения';
    }
    
    // Specific validation for different field types
    if (field.value.trim()) {
        switch (field.type) {
            case 'email':
                if (!validateEmail(field.value)) {
                    isValid = false;
                    message = 'Введите корректный email адрес';
                }
                break;
                
            case 'tel':
                if (!validatePhone(field.value)) {
                    isValid = false;
                    message = 'Введите корректный номер телефона';
                }
                break;
        }
    }
    
    // Check checkbox agreement
    if (field.type === 'checkbox' && field.id === 'agreement' && !field.checked) {
        isValid = false;
        message = 'Необходимо согласие с политикой конфиденциальности';
    }
    
    if (!isValid) {
        showError(field, message);
    }
    
    return isValid;
}

function showError(field, message) {
    const formGroup = field.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    formGroup.classList.add('error');
    errorMessage.textContent = message;
}

function clearError(field) {
    const formGroup = field.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    formGroup.classList.remove('error');
    errorMessage.textContent = '';
}

function submitForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.submit-btn');
    const formData = new FormData(form);
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // In a real application, you would send the data to a server
        console.log('Form data:', Object.fromEntries(formData));
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        form.reset();
        
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Scroll to success message
        document.querySelector('.success-message').scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        
    }, 2000);
}

function showSuccessMessage() {
    let successMessage = document.querySelector('.success-message');
    
    if (!successMessage) {
        successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <strong>Спасибо!</strong> Ваша заявка успешно отправлена. 
            Мы свяжемся с вами в ближайшее время.
        `;
        
        const formContainer = document.querySelector('.form-container');
        formContainer.insertBefore(successMessage, formContainer.firstChild);
    }
    
    successMessage.classList.add('show');
    
    // Hide message after 10 seconds
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 10000);
}

function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

function initializePhoneMask() {
    const phoneInput = document.getElementById('phone');
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            if (value[0] === '8') {
                value = '7' + value.slice(1);
            }
            
            if (value[0] === '7') {
                const formattedValue = formatPhoneNumber(value);
                e.target.value = formattedValue;
            }
        }
    });
    
    phoneInput.addEventListener('keydown', function(e) {
        // Allow backspace, delete, tab, escape, enter
        if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
            // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true) ||
            // Allow home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            return;
        }
        
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
}

function formatPhoneNumber(value) {
    if (value.length <= 1) return '+' + value;
    if (value.length <= 4) return `+${value.slice(0, 1)} (${value.slice(1)}`;
    if (value.length <= 7) return `+${value.slice(0, 1)} (${value.slice(1, 4)}) ${value.slice(4)}`;
    if (value.length <= 9) return `+${value.slice(0, 1)} (${value.slice(1, 4)}) ${value.slice(4, 7)}-${value.slice(7)}`;
    return `+${value.slice(0, 1)} (${value.slice(1, 4)}) ${value.slice(4, 7)}-${value.slice(7, 9)}-${value.slice(9, 11)}`;
}

// Team member contact interactions
document.addEventListener('click', function(e) {
    if (e.target.closest('.member-contacts a')) {
        const link = e.target.closest('a');
        const href = link.getAttribute('href');
        
        if (href.startsWith('tel:')) {
            // Phone call confirmation
            const phone = href.replace('tel:', '');
            if (confirm(`Позвонить по номеру ${phone}?`)) {
                window.location.href = href;
            }
            e.preventDefault();
        } else if (href.startsWith('mailto:')) {
            // Email confirmation
            const email = href.replace('mailto:', '');
            if (confirm(`Отправить email на ${email}?`)) {
                window.location.href = href;
            }
            e.preventDefault();
        }
    }
});

// Smooth scrolling for internal links
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

// Contact card hover effects
const contactCards = document.querySelectorAll('.contact-card');
contactCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Team member hover effects
const teamMembers = document.querySelectorAll('.team-member');
teamMembers.forEach(member => {
    member.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    member.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Auto-hide success message on scroll
window.addEventListener('scroll', function() {
    const successMessage = document.querySelector('.success-message.show');
    if (successMessage) {
        const rect = successMessage.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
            successMessage.classList.remove('show');
        }
    }
});

// Form field focus effects
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(field => {
    field.addEventListener('focus', function() {
        this.closest('.form-group').classList.add('focused');
    });
    
    field.addEventListener('blur', function() {
        this.closest('.form-group').classList.remove('focused');
    });
});

// Add focused class styling
const style = document.createElement('style');
style.textContent = `
    .form-group.focused label {
        color: #007bff;
    }
    
    .form-group.focused input,
    .form-group.focused select,
    .form-group.focused textarea {
        border-color: #007bff;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
`;
document.head.appendChild(style);