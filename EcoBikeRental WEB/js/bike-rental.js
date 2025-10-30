// Bike Rental Module for EcoRide Bicycle Rentals

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const bookSection = document.getElementById('book-section');
    const bookButtons = document.querySelectorAll('.btn[data-section="book-section"]');
    const locationSelect = document.getElementById('location');
    const bikeTypeSelect = document.getElementById('bike-type');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const searchButton = document.querySelector('#book-section .form-actions .btn-primary');
    const resetButton = document.querySelector('#book-section .form-actions .btn-secondary');
    const bookBikeButtons = document.querySelectorAll('#book-section .bike-card .btn-primary');
    const accessoryButtons = document.querySelectorAll('#book-section .bike-card .btn-secondary');

    // Set default dates
    if (startDateInput && endDateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        startDateInput.valueAsDate = today;
        endDateInput.valueAsDate = tomorrow;
    }

    // Apply membership discount to prices
    function applyMembershipDiscount() {
        const user = JSON.parse(localStorage.getItem('ecoride_user') || '{}');
        const membership = user.membership || { level: 'basic' };
        
        // Get discount percentage based on membership level
        let discount = 0;
        switch(membership.level) {
            case 'silver':
                discount = 0.10; // 10% discount
                break;
            case 'gold':
                discount = 0.20; // 20% discount
                break;
        }

        // Apply discount to all bike prices
        const priceElements = document.querySelectorAll('.price-value');
        priceElements.forEach(element => {
            const originalPrice = parseFloat(element.textContent.replace('$', ''));
            const discountedPrice = originalPrice * (1 - discount);
            
            // If there's a discount, show both prices
            if (discount > 0) {
                element.innerHTML = `
                    <span style="text-decoration: line-through; color: #999; font-size: 0.8em;">$${originalPrice.toFixed(2)}</span>
                    <span style="color: var(--success);">$${discountedPrice.toFixed(2)}</span>
                `;
            }
        });

        // Update accessory prices if any
        const accessoryPrices = document.querySelectorAll('.bike-card[style*="grid-template-columns"] .price-value');
        accessoryPrices.forEach(element => {
            const originalPrice = parseFloat(element.textContent.replace('$', ''));
            const discountedPrice = originalPrice * (1 - discount);
            
            if (discount > 0) {
                element.innerHTML = `
                    <span style="text-decoration: line-through; color: #999; font-size: 0.8em;">$${originalPrice.toFixed(2)}</span>
                    <span style="color: var(--success);">$${discountedPrice.toFixed(2)}</span>
                `;
            }
        });
    }

    // Handle bike booking
    function handleBooking(e) {
        e.preventDefault();
        
        const bikeCard = this.closest('.bike-card');
        const bikeName = bikeCard.querySelector('.bike-name').textContent;
        const priceElement = bikeCard.querySelector('.price-value');
        const price = parseFloat(priceElement.textContent.replace('$', ''));
        
        // Get user data
        const user = JSON.parse(localStorage.getItem('ecoride_user') || '{}');
        
        // Create rental object
        const rental = {
            rental_id: 'R' + Date.now(),
            bike_name: bikeName,
            start_time: startDateInput.value,
            end_time: endDateInput.value,
            location: locationSelect.value,
            total_amount: price,
            status: 'pending',
            user_id: user.email
        };
        
        // Save rental to local storage
        const rentals = JSON.parse(localStorage.getItem('ecoride_rentals') || '[]');
        rentals.push(rental);
        localStorage.setItem('ecoride_rentals', JSON.stringify(rentals));
        
        // Add points for the rental
        if (window.membershipModule) {
            const points = Math.floor(price); // 1 point per dollar spent
            window.membershipModule.addPoints(points);
        }
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = `Successfully booked ${bikeName}! Check your rentals for details.`;
        bookSection.insertBefore(successMessage, bookSection.firstChild);
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
        
        // Navigate to rentals section
        if (typeof window.setActiveSection === 'function') {
            setTimeout(() => {
                window.setActiveSection('rentals-section');
            }, 1500);
        }
    }

    // Navigation to book section
    if (bookButtons) {
        bookButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const sectionId = this.getAttribute('data-section');
                if (typeof window.setActiveSection === 'function') {
                    window.setActiveSection(sectionId);
                }
            });
        });
    }

    // Book bike buttons
    if (bookBikeButtons) {
        bookBikeButtons.forEach(button => {
            button.addEventListener('click', handleBooking);
        });
    }

    // Reset button
    if (resetButton) {
        resetButton.addEventListener('click', function(e) {
            e.preventDefault();
            locationSelect.value = '';
            bikeTypeSelect.value = '';
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            startDateInput.valueAsDate = today;
            endDateInput.valueAsDate = tomorrow;
        });
    }

    // Apply membership discounts when the section is shown
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active')) {
                applyMembershipDiscount();
            }
        });
    });

    if (bookSection) {
        observer.observe(bookSection, { attributes: true });
        
        // Also apply on initial load if section is active
        if (bookSection.classList.contains('active')) {
            applyMembershipDiscount();
        }
    }
}); 