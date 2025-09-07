// Catalog functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize catalog functionality
    initializeFilters();
    initializeViewControls();
    updateResultsCount();
    updateFavoriteButtons();

    // Parse URL parameters for search
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('type') || urlParams.has('operation') || urlParams.has('location')) {
        document.getElementById('propertyType').value = urlParams.get('type') || '';
        document.getElementById('operation').value = urlParams.get('operation') || '';
        document.getElementById('district').value = urlParams.get('location') || '';
        applyFilters();
    }
});

function initializeFilters() {
    // Add event listeners to filter inputs
    const filterInputs = document.querySelectorAll('#propertyType, #operation, #priceFrom, #priceTo, #rooms, #district');
    filterInputs.forEach(input => {
        input.addEventListener('change', applyFilters);
        if (input.type === 'text' || input.type === 'number') {
            input.addEventListener('input', debounce(applyFilters, 500));
        }
    });
}

function initializeViewControls() {
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const grid = document.getElementById('propertiesGrid');
            if (this.dataset.view === 'list') {
                grid.classList.add('list-view');
            } else {
                grid.classList.remove('list-view');
            }
        });
    });
}

function applyFilters() {
    const filters = {
        type: document.getElementById('propertyType').value,
        operation: document.getElementById('operation').value,
        priceFrom: parseInt(document.getElementById('priceFrom').value) || 0,
        priceTo: parseInt(document.getElementById('priceTo').value) || Infinity,
        rooms: document.getElementById('rooms').value,
        district: document.getElementById('district').value.toLowerCase()
    };

    const properties = document.querySelectorAll('.property-card');
    let visibleCount = 0;

    // Add loading effect
    const grid = document.getElementById('propertiesGrid');
    grid.classList.add('loading');

    setTimeout(() => {
        properties.forEach(property => {
            const matches = checkPropertyMatch(property, filters);
            
            if (matches) {
                property.classList.remove('hidden');
                visibleCount++;
            } else {
                property.classList.add('hidden');
            }
        });

        updateResultsCount(visibleCount);
        grid.classList.remove('loading');
    }, 300);
}

function checkPropertyMatch(property, filters) {
    // Check type
    if (filters.type && property.dataset.type !== filters.type) {
        return false;
    }

    // Check operation
    if (filters.operation && property.dataset.operation !== filters.operation) {
        return false;
    }

    // Check price range
    const price = parseInt(property.dataset.price);
    if (price < filters.priceFrom || price > filters.priceTo) {
        return false;
    }

    // Check rooms
    if (filters.rooms) {
        const propertyRooms = parseInt(property.dataset.rooms);
        const filterRooms = parseInt(filters.rooms);
        
        if (filterRooms === 4) {
            // 4+ rooms
            if (propertyRooms < 4) return false;
        } else {
            if (propertyRooms !== filterRooms) return false;
        }
    }

    // Check district
    if (filters.district) {
        const location = property.querySelector('.location').textContent.toLowerCase();
        if (!location.includes(filters.district)) {
            return false;
        }
    }

    return true;
}

function resetFilters() {
    document.getElementById('propertyType').value = '';
    document.getElementById('operation').value = '';
    document.getElementById('priceFrom').value = '';
    document.getElementById('priceTo').value = '';
    document.getElementById('rooms').value = '';
    document.getElementById('district').value = '';
    
    applyFilters();
}

function sortProperties() {
    const sortBy = document.getElementById('sortBy').value;
    const grid = document.getElementById('propertiesGrid');
    const properties = Array.from(grid.querySelectorAll('.property-card:not(.hidden)'));
    
    properties.sort((a, b) => {
        switch (sortBy) {
            case 'price-asc':
                return parseInt(a.dataset.price) - parseInt(b.dataset.price);
            case 'price-desc':
                return parseInt(b.dataset.price) - parseInt(a.dataset.price);
            case 'area':
                const areaA = parseInt(a.querySelector('.property-details span:last-child').textContent);
                const areaB = parseInt(b.querySelector('.property-details span:last-child').textContent);
                return areaB - areaA;
            case 'date':
                // For demo purposes, sort by DOM order (newest first)
                return 0;
            default:
                return 0;
        }
    });

    // Remove all properties from grid
    properties.forEach(property => property.remove());
    
    // Add back in sorted order
    properties.forEach(property => grid.appendChild(property));
}

function updateResultsCount(count = null) {
    if (count === null) {
        count = document.querySelectorAll('.property-card:not(.hidden)').length;
    }
    
    document.getElementById('resultsCount').textContent = count;
}

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

// Property interaction functions
function showPropertyDetails(propertyId) {
    // In a real application, this would open a detailed view
    alert(`Показать детали для объекта ${propertyId}`);
}

function contactAboutProperty(propertyId) {
    // In a real application, this would open a contact form
    const property = document.querySelector(`[data-property-id="${propertyId}"]`);
    const title = property.closest('.property-card').querySelector('h3').textContent;
    
    const message = `Здравствуйте! Меня интересует объект: ${title}`;
    const phone = '+7 (495) 123-45-67';
    
    if (confirm(`Связаться по поводу "${title}"?\nВам позвонят по указанному номеру.`)) {
        // Here you would typically open a contact form or initiate a call
        window.location.href = `tel:${phone}`;
    }
}

// Enhanced property card interactions
document.addEventListener('click', function(e) {
    // Handle property action buttons
    if (e.target.classList.contains('btn-primary')) {
        const card = e.target.closest('.property-card');
        const propertyId = card.querySelector('.favorite-btn').dataset.propertyId;
        showPropertyDetails(propertyId);
    }
    
    if (e.target.classList.contains('btn-secondary')) {
        const card = e.target.closest('.property-card');
        const propertyId = card.querySelector('.favorite-btn').dataset.propertyId;
        contactAboutProperty(propertyId);
    }
    
    // Handle pagination
    if (e.target.classList.contains('pagination-btn') && !e.target.disabled) {
        const currentPage = document.querySelector('.pagination-btn.active');
        const allPages = document.querySelectorAll('.pagination-btn');
        
        if (e.target.textContent === '←') {
            // Previous page
            const prevIndex = Array.from(allPages).indexOf(currentPage) - 1;
            if (prevIndex > 0) {
                currentPage.classList.remove('active');
                allPages[prevIndex].classList.add('active');
            }
        } else if (e.target.textContent === '→') {
            // Next page
            const nextIndex = Array.from(allPages).indexOf(currentPage) + 1;
            if (nextIndex < allPages.length - 1) {
                currentPage.classList.remove('active');
                allPages[nextIndex].classList.add('active');
            }
        } else if (!isNaN(e.target.textContent)) {
            // Specific page
            allPages.forEach(page => page.classList.remove('active'));
            e.target.classList.add('active');
        }
        
        // Scroll to top when changing pages
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Add property comparison functionality
let comparisonList = JSON.parse(localStorage.getItem('comparison')) || [];

function addToComparison(propertyId) {
    if (comparisonList.length >= 3) {
        alert('Можно сравнить максимум 3 объекта');
        return;
    }
    
    if (!comparisonList.includes(propertyId)) {
        comparisonList.push(propertyId);
        localStorage.setItem('comparison', JSON.stringify(comparisonList));
        updateComparisonButton();
        showComparisonNotification();
    }
}

function removeFromComparison(propertyId) {
    comparisonList = comparisonList.filter(id => id !== propertyId);
    localStorage.setItem('comparison', JSON.stringify(comparisonList));
    updateComparisonButton();
}

function updateComparisonButton() {
    let comparisonBtn = document.querySelector('.comparison-btn');
    
    if (!comparisonBtn && comparisonList.length > 0) {
        comparisonBtn = document.createElement('button');
        comparisonBtn.className = 'comparison-btn';
        comparisonBtn.innerHTML = `<i class="fas fa-balance-scale"></i> Сравнить (${comparisonList.length})`;
        comparisonBtn.onclick = showComparison;
        
        comparisonBtn.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: #28a745;
            color: white;
            border: none;
            padding: 1rem;
            border-radius: 25px;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            transition: all 0.3s;
        `;
        
        document.body.appendChild(comparisonBtn);
    } else if (comparisonBtn) {
        if (comparisonList.length === 0) {
            comparisonBtn.remove();
        } else {
            comparisonBtn.innerHTML = `<i class="fas fa-balance-scale"></i> Сравнить (${comparisonList.length})`;
        }
    }
}

function showComparison() {
    if (comparisonList.length === 0) {
        alert('Нет объектов для сравнения');
        return;
    }
    
    // In a real application, this would open a comparison view
    alert(`Сравнение ${comparisonList.length} объектов: ${comparisonList.join(', ')}`);
}

function showComparisonNotification() {
    const notification = document.createElement('div');
    notification.textContent = 'Объект добавлен к сравнению';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem;
        border-radius: 5px;
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize comparison button on page load
updateComparisonButton();