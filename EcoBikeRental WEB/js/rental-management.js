// Rental Management Module for EcoRide Bicycle Rentals

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements for Rental Section
    const rentalsSection = document.getElementById('rentals-section');
    const rentalHistoryTable = document.querySelector('#rentals-section .rental-history tbody');
    const tabButtons = document.querySelectorAll('#rentals-section .tab-buttons .tab-btn');
    const extendButtons = document.querySelectorAll('#rentals-section .extend-rental');
    const returnButtons = document.querySelectorAll('#rentals-section .btn-primary[style*="Return"]');
    const cancelButtons = document.querySelectorAll('#rentals-section .btn-danger');
    const extendDurationSelect = document.querySelector('#rentals-section select.form-control');
    const extendNowButton = document.querySelector('#rentals-section button:contains("Extend Now")');
    
    // Update active rental details
    function updateRentalDetails(rentalId) {
        // In a real app, this would fetch the specific rental details from backend
        let userRentals = JSON.parse(localStorage.getItem('ecoride_rentals') || '[]');
        const rental = userRentals.find(r => r.rental_id === rentalId) || userRentals[0];
        
        if (!rental) return;
        
        // Example of how we might update the UI with the selected rental info
        const rentalDetailsSections = document.querySelectorAll('#rentals-section .featured-section');
        if (rentalDetailsSections.length >= 2) {
            const detailsSection = rentalDetailsSections[1]; // The second section is rental details
            
            // Update rental details if the elements exist
            const startDateElement = detailsSection.querySelector('p:contains("Start Date")');
            if (startDateElement) {
                const startDate = new Date(rental.start_time);
                startDateElement.innerHTML = `<strong>Start Date:</strong> ${startDate.toLocaleString()}`;
            }
            
            const endDateElement = detailsSection.querySelector('p:contains("End Date")');
            if (endDateElement) {
                const endDate = new Date(rental.end_time);
                endDateElement.innerHTML = `<strong>End Date:</strong> ${endDate.toLocaleString()}`;
            }
            
            const locationElement = detailsSection.querySelector('p:contains("Location")');
            if (locationElement) {
                locationElement.innerHTML = `<strong>Location:</strong> ${rental.location}`;
            }
            
            const totalCostElement = detailsSection.querySelector('p:contains("Total Cost")');
            if (totalCostElement) {
                totalCostElement.innerHTML = `<strong>Total Cost:</strong> $${parseFloat(rental.total_amount).toFixed(2)}`;
            }
        }
    }
    
    // Filter rentals by status
    function filterRentals(status) {
        if (!rentalHistoryTable) return;
        
        const rows = rentalHistoryTable.querySelectorAll('tr');
        
        rows.forEach(row => {
            const statusCell = row.querySelector('td:nth-child(6)');
            if (!statusCell) return;
            
            const statusText = statusCell.textContent.toLowerCase();
            
            if (status === 'all' || statusText.includes(status)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    // Load rental data
    function loadRentals() {
        if (!rentalHistoryTable) return;
        
        // Clear existing content
        rentalHistoryTable.innerHTML = '';
        
        // Get rentals from localStorage
        let userRentals = JSON.parse(localStorage.getItem('ecoride_rentals') || '[]');
        
        if (userRentals.length === 0) {
            // Add a dummy rental for demonstration if none exist
            const dummyRentals = [
                {
                    rental_id: 'RNT-123456',
                    bike_name: 'Mountain Explorer',
                    bike_type: 'Mountain Bike',
                    price_per_hour: 15,
                    start_time: new Date(2023, 4, 15, 9, 0).toISOString(),
                    end_time: new Date(2023, 4, 15, 15, 0).toISOString(),
                    location: 'Central Park',
                    total_amount: 90,
                    status: 'completed'
                },
                {
                    rental_id: 'RNT-234567',
                    bike_name: 'City Cruiser',
                    bike_type: 'City Bike',
                    price_per_hour: 12,
                    start_time: new Date(2023, 4, 20, 10, 0).toISOString(),
                    end_time: new Date(2023, 4, 20, 12, 0).toISOString(),
                    location: 'Downtown Station',
                    total_amount: 24,
                    status: 'completed'
                },
                {
                    rental_id: 'RNT-345678',
                    bike_name: 'E-Bike Pro',
                    bike_type: 'Electric Bike',
                    price_per_hour: 25,
                    start_time: new Date(2023, 5, 2, 8, 0).toISOString(),
                    end_time: new Date(2023, 5, 3, 8, 0).toISOString(),
                    location: 'Riverside Hub',
                    total_amount: 150,
                    status: 'active'
                },
                {
                    rental_id: 'RNT-456789',
                    bike_name: 'Road Racer Pro',
                    bike_type: 'Road Bike',
                    price_per_hour: 18,
                    start_time: new Date(2023, 5, 10, 7, 0).toISOString(),
                    end_time: new Date(2023, 5, 10, 10, 0).toISOString(),
                    location: 'University Center',
                    total_amount: 54,
                    status: 'pending'
                }
            ];
            
            userRentals = dummyRentals;
            localStorage.setItem('ecoride_rentals', JSON.stringify(dummyRentals));
        }
        
        // Add rows to the table
        userRentals.forEach(rental => {
            const row = document.createElement('tr');
            
            // Format dates
            const startDate = new Date(rental.start_time);
            const endDate = new Date(rental.end_time);
            
            // Create status badge class
            let statusClass = '';
            switch(rental.status) {
                case 'active': statusClass = 'status-active'; break;
                case 'pending': statusClass = 'status-pending'; break;
                case 'completed': statusClass = 'status-completed'; break;
                case 'cancelled': statusClass = 'status-cancelled'; break;
            }
            
            // Create action buttons based on status
            let actionButtons = '';
            if (rental.status === 'active') {
                actionButtons = `
                    <div class="d-flex">
                        <a href="#" class="btn btn-secondary extend-rental" data-id="${rental.rental_id}" style="font-size: 12px; padding: 5px 10px; margin-inline-end: 5px;">Extend</a>
                        <a href="#" class="btn btn-primary return-rental" data-id="${rental.rental_id}" style="font-size: 12px; padding: 5px 10px;">Return</a>
                    </div>
                `;
            } else if (rental.status === 'pending') {
                actionButtons = `<a href="#" class="btn btn-danger cancel-rental" data-id="${rental.rental_id}" style="font-size: 12px; padding: 5px 10px;">Cancel</a>`;
            } else {
                actionButtons = `<a href="#" class="view-rental" data-id="${rental.rental_id}">Details</a>`;
            }
            
            row.innerHTML = `
                <td>${rental.bike_name}</td>
                <td>${startDate.toLocaleString()}</td>
                <td>${endDate.toLocaleString()}</td>
                <td>${rental.location}</td>
                <td>$${parseFloat(rental.total_amount).toFixed(2)}</td>
                <td><span class="status-badge ${statusClass}">${rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}</span></td>
                <td>${actionButtons}</td>
            `;
            
            rentalHistoryTable.appendChild(row);
        });
        
        // Add event listeners to new buttons
        addRentalButtonListeners();
        
        // Update active rental details if there is one
        const activeRental = userRentals.find(r => r.status === 'active');
        if (activeRental) {
            updateRentalDetails(activeRental.rental_id);
        }
    }
    
    // Add event listeners to rental action buttons
    function addRentalButtonListeners() {
        // Extend rental buttons
        const extendButtons = document.querySelectorAll('.extend-rental');
        extendButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const rentalId = this.getAttribute('data-id');
                // Show the rental details section and scroll to it
                updateRentalDetails(rentalId);
                
                // In a real app, we would also highlight the selected rental
                alert('Rental details updated. Scroll down to see extension options.');
            });
        });
        
        // Return rental buttons
        const returnButtons = document.querySelectorAll('.return-rental');
        returnButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const rentalId = this.getAttribute('data-id');
                
                // Update rental status in localStorage
                let userRentals = JSON.parse(localStorage.getItem('ecoride_rentals') || '[]');
                const rentalIndex = userRentals.findIndex(r => r.rental_id === rentalId);
                
                if (rentalIndex !== -1) {
                    userRentals[rentalIndex].status = 'completed';
                    localStorage.setItem('ecoride_rentals', JSON.stringify(userRentals));
                    
                    // Reload rentals
                    loadRentals();
                    
                    // Show confirmation
                    alert('Bike returned successfully! Thank you for using EcoRide.');
                    
                    // Refresh dashboard data
                    if (typeof window.initDashboard === 'function') {
                        window.initDashboard();
                    }
                }
            });
        });
        
        // Cancel rental buttons
        const cancelButtons = document.querySelectorAll('.cancel-rental');
        cancelButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const rentalId = this.getAttribute('data-id');
                
                if (confirm('Are you sure you want to cancel this rental?')) {
                    // Update rental status in localStorage
                    let userRentals = JSON.parse(localStorage.getItem('ecoride_rentals') || '[]');
                    const rentalIndex = userRentals.findIndex(r => r.rental_id === rentalId);
                    
                    if (rentalIndex !== -1) {
                        userRentals[rentalIndex].status = 'cancelled';
                        localStorage.setItem('ecoride_rentals', JSON.stringify(userRentals));
                        
                        // Reload rentals
                        loadRentals();
                        
                        // Show confirmation
                        alert('Rental cancelled successfully.');
                        
                        // Refresh dashboard data
                        if (typeof window.initDashboard === 'function') {
                            window.initDashboard();
                        }
                    }
                }
            });
        });
        
        // View rental details
        const viewButtons = document.querySelectorAll('.view-rental');
        viewButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const rentalId = this.getAttribute('data-id');
                updateRentalDetails(rentalId);
                alert('Rental details updated. Scroll down to see the details.');
            });
        });
    }
    
    // Load rentals when entering the rentals section
    if (rentalsSection) {
        // Tab button event listeners
        if (tabButtons) {
            tabButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Update active tab
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Get status from button text
                    const status = this.textContent.toLowerCase();
                    
                    // Filter rentals
                    filterRentals(status);
                });
            });
        }
        
        // Extend now button
        if (document.querySelector('button.btn-primary:contains("Extend Now")')) {
            document.querySelector('button.btn-primary:contains("Extend Now")').addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get selected duration from dropdown
                const durationSelect = document.querySelector('select.form-control');
                const selectedDuration = durationSelect ? durationSelect.value : '1 hour ($25)';
                
                // Extract hours and price
                const durationMatch = selectedDuration.match(/(\d+)\s+hour/);
                const priceMatch = selectedDuration.match(/\$(\d+)/);
                
                const hours = durationMatch ? parseInt(durationMatch[1]) : 1;
                const price = priceMatch ? parseInt(priceMatch[1]) : 25;
                
                // In a real app, we would update the rental in the database
                
                // Show confirmation
                alert(`Rental extended by ${hours} hour(s) for $${price}. Your rental period has been updated.`);
                
                // Update the end date in the UI
                const endDateElement = document.querySelector('p:contains("End Date")');
                if (endDateElement) {
                    const currentEndDate = new Date();
                    currentEndDate.setHours(currentEndDate.getHours() + hours);
                    endDateElement.innerHTML = `<strong>End Date:</strong> ${currentEndDate.toLocaleString()}`;
                }
            });
        }
        
        // Initialize rentals when the section is viewed
        document.querySelectorAll('.nav-link[data-section="rentals-section"]').forEach(link => {
            link.addEventListener('click', function() {
                setTimeout(loadRentals, 100); // Slight delay to ensure the section is visible
            });
        });
    }
    
    // Initial load for rentals section
    if (window.location.hash === '#rentals' || document.getElementById('rentals-section').classList.contains('active')) {
        loadRentals();
    }
}); 