// Admin Dashboard Module for EcoRide Bicycle Rentals

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin
    function isAdmin() {
        const user = JSON.parse(localStorage.getItem('ecoride_user') || '{}');
        return user.role === 'admin';
    }

    // Initialize Charts
    function initCharts() {
        // Rental Analytics Chart
        const rentalCtx = document.getElementById('rentalAnalyticsChart').getContext('2d');
        new Chart(rentalCtx, {
            type: 'line',
            data: {
                labels: ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM'],
                datasets: [{
                    label: 'Rentals per Hour',
                    data: [5, 12, 18, 25, 20, 30, 15, 8],
                    borderColor: '#2ecc71',
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(46, 204, 113, 0.1)'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Daily Rental Distribution'
                    }
                }
            }
        });

        // Bike Type Distribution Chart
        const bikeTypeCtx = document.getElementById('bikeTypeChart').getContext('2d');
        new Chart(bikeTypeCtx, {
            type: 'doughnut',
            data: {
                labels: ['Mountain Bikes', 'City Bikes', 'Electric Bikes', 'Kids Bikes'],
                datasets: [{
                    data: [35, 25, 30, 10],
                    backgroundColor: ['#3498db', '#e74c3c', '#f1c40f', '#9b59b6']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Bike Type Distribution'
                    }
                }
            }
        });

        // Revenue Chart
        const revenueCtx = document.getElementById('revenueChart').getContext('2d');
        new Chart(revenueCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Monthly Revenue',
                    data: [12500, 15000, 18000, 16500, 21000, 19500],
                    backgroundColor: '#2ecc71'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Monthly Revenue'
                    }
                }
            }
        });

        // Location Preference Chart
        const locationCtx = document.getElementById('locationChart').getContext('2d');
        new Chart(locationCtx, {
            type: 'radar',
            data: {
                labels: ['Downtown', 'Central Park', 'Riverside', 'University', 'Mountain Trail', 'Hillside'],
                datasets: [{
                    label: 'Rental Distribution by Location',
                    data: [80, 65, 75, 55, 85, 60],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Location Preferences'
                    }
                }
            }
        });
    }

    // Update System Health Status
    function updateSystemHealth() {
        const metrics = {
            cpu: Math.floor(Math.random() * 30) + 20, // 20-50% CPU usage
            memory: Math.floor(Math.random() * 40) + 30, // 30-70% Memory usage
            disk: Math.floor(Math.random() * 20) + 10, // 10-30% Disk usage
            response: Math.floor(Math.random() * 200) + 100 // 100-300ms response time
        };

        document.getElementById('cpuUsage').style.width = metrics.cpu + '%';
        document.getElementById('cpuUsageText').textContent = metrics.cpu + '%';
        
        document.getElementById('memoryUsage').style.width = metrics.memory + '%';
        document.getElementById('memoryUsageText').textContent = metrics.memory + '%';
        
        document.getElementById('diskUsage').style.width = metrics.disk + '%';
        document.getElementById('diskUsageText').textContent = metrics.disk + '%';
        
        document.getElementById('responseTime').textContent = metrics.response + 'ms';
    }

    // Update Financial Summary
    function updateFinancialSummary() {
        const summary = {
            totalRevenue: 102500,
            outstandingPayments: 3200,
            pendingRefunds: 850,
            averageOrderValue: 45
        };

        document.getElementById('totalRevenue').textContent = '$' + summary.totalRevenue.toLocaleString();
        document.getElementById('outstandingPayments').textContent = '$' + summary.outstandingPayments.toLocaleString();
        document.getElementById('pendingRefunds').textContent = '$' + summary.pendingRefunds.toLocaleString();
        document.getElementById('averageOrderValue').textContent = '$' + summary.averageOrderValue.toLocaleString();
    }

    // Initialize Admin Dashboard
    function initAdminDashboard() {
        if (!isAdmin()) {
            console.log('Access denied: User is not an admin');
            return;
        }

        // Initialize all charts
        initCharts();

        // Update system health status
        updateSystemHealth();
        setInterval(updateSystemHealth, 30000); // Update every 30 seconds

        // Update financial summary
        updateFinancialSummary();

        // Add event listeners for date range selectors
        const dateRangeSelectors = document.querySelectorAll('.date-range-selector');
        dateRangeSelectors.forEach(selector => {
            selector.addEventListener('change', function() {
                // Update charts based on selected date range
                initCharts();
            });
        });

        // Add event listeners for export buttons
        const exportButtons = document.querySelectorAll('.export-btn');
        exportButtons.forEach(button => {
            button.addEventListener('click', function() {
                const reportType = this.getAttribute('data-report');
                exportReport(reportType);
            });
        });
    }

    // Export Report Function
    function exportReport(reportType) {
        console.log(`Exporting ${reportType} report...`);
        // Implement export functionality here
    }

    // Initialize if admin section is present
    const adminSection = document.getElementById('admin-section');
    if (adminSection) {
        initAdminDashboard();
    }
}); 