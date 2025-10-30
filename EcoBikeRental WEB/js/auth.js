// Auth Module for EcoRide Bicycle Rentals

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const authSection = document.getElementById('auth-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginTab = document.querySelector('.auth-tab[data-tab="login"]');
    const registerTab = document.querySelector('.auth-tab[data-tab="register"]');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const socialBtns = document.querySelectorAll('.social-btn');

    // Initially hide dashboard and show login
    dashboardSection.style.display = 'none';
    authSection.style.display = 'flex';

    // Event Listeners
    if (loginBtn) loginBtn.addEventListener('click', handleLogin);
    if (registerBtn) registerBtn.addEventListener('click', handleRegister);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (socialBtns) {
        socialBtns.forEach(btn => {
            btn.addEventListener('click', handleSocialLogin);
        });
    }

    // Handle Login
    function handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Simple validation
        if (!email || !password) {
            showError(loginForm, 'Please fill in all fields');
            return;
        }
        
        // Show loading state
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        
        // Simulate API call delay
        setTimeout(() => {
            // Simulate login success
            const user = {
                name: email.split('@')[0],
                email: email,
                role: email.includes('admin') ? 'admin' : 'user'
            };
            
            // Save user data
            localStorage.setItem('ecoride_user', JSON.stringify(user));
            
            // Show success message
            showSuccess(loginForm, 'Login successful! Redirecting to dashboard...');
            
            // Redirect to dashboard after delay
            setTimeout(showDashboard, 1500);
            
            // Reset button state
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login';
            
            // Update UI for user role
            updateUIForUserRole(user);
        }, 1000);
    }

    // Handle Register
    function handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;
        
        // Simple validation
        if (!name || !email || !password || !confirm) {
            showError(registerForm, 'Please fill in all fields');
            return;
        }
        
        if (password !== confirm) {
            showError(registerForm, 'Passwords do not match');
            return;
        }
        
        // Show loading state
        registerBtn.disabled = true;
        registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        
        // Simulate API call delay
        setTimeout(() => {
            // Create user object with initial membership
            const user = {
                name: name,
                email: email,
                role: email.includes('admin') ? 'admin' : 'user'
            };
            
            // Save user data
            localStorage.setItem('ecoride_user', JSON.stringify(user));
            
            // Show success message
            showSuccess(registerForm, 'Registration successful! Redirecting to dashboard...');
            
            // Redirect to dashboard after delay
            setTimeout(showDashboard, 1500);
            
            // Reset button state
            registerBtn.disabled = false;
            registerBtn.textContent = 'Create Account';
            
            // Update UI for user role
            updateUIForUserRole(user);
        }, 1000);
    }

    // Handle Social Login
    function handleSocialLogin(e) {
        e.preventDefault();
        
        const button = e.currentTarget;
        const originalContent = button.innerHTML;
        
        // Show loading state
        button.style.pointerEvents = 'none';
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        // Simulate social login delay
        setTimeout(() => {
            // Simulate social login success
            const user = {
                name: 'John Doe',
                email: 'john@example.com',
                role: 'customer',
                credits: 0,
                membership: {
                    level: 'basic',
                    points: 0,
                    validUntil: null
                }
            };
            
            // Save user data
            localStorage.setItem('ecoride_user', JSON.stringify(user));
            
            // Show success message
            showSuccess(loginForm, 'Login successful! Redirecting to dashboard...');
            
            // Redirect to dashboard after delay
            setTimeout(showDashboard, 1500);
            
            // Reset button state
            button.style.pointerEvents = 'auto';
            button.innerHTML = originalContent;
            
            // Update UI for user role
            updateUIForUserRole(user);
        }, 1000);
    }

    // Handle Logout
    function handleLogout(e) {
        e.preventDefault();
        
        // Show loading state
        logoutBtn.disabled = true;
        logoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
        
        // Simulate logout delay
        setTimeout(() => {
            // Clear user data
            localStorage.removeItem('ecoride_user');
            localStorage.removeItem('ecoride_rentals');
            
            // Show login screen
            showLogin();
            
            // Reset button state
            logoutBtn.disabled = false;
            logoutBtn.innerHTML = '<span class="icon">⬅️</span> <span>Logout</span>';
        }, 500);
    }

    // Show Error Message
    function showError(form, message) {
        // Remove any existing messages
        const existingMessage = form.querySelector('.success-message, .error-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.backgroundColor = '#ff4444';
        errorDiv.style.color = 'white';
        errorDiv.style.padding = '10px';
        errorDiv.style.borderRadius = '4px';
        errorDiv.style.marginBottom = '15px';
        errorDiv.textContent = message;
        
        // Insert error message
        form.insertBefore(errorDiv, form.firstChild);
        
        // Remove error message after 3 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    // Show Success Message
    function showSuccess(form, message) {
        // Remove any existing messages
        const existingMessage = form.querySelector('.success-message, .error-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.backgroundColor = '#00C851';
        successDiv.style.color = 'white';
        successDiv.style.padding = '10px';
        successDiv.style.borderRadius = '4px';
        successDiv.style.marginBottom = '15px';
        successDiv.textContent = message;
        
        // Insert success message
        form.insertBefore(successDiv, form.firstChild);
    }

    function showDashboard() {
        // Add fade out effect to auth section
        authSection.style.opacity = '0';
        authSection.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            // Hide auth section and reset opacity
            authSection.style.display = 'none';
            authSection.style.opacity = '1';
            
            // Show dashboard with fade in effect
            dashboardSection.style.opacity = '0';
            dashboardSection.style.display = 'block';
            
            setTimeout(() => {
                dashboardSection.style.opacity = '1';
                dashboardSection.style.transition = 'opacity 0.5s ease';
                
                // Apply logged-in class to body
                document.body.classList.add('logged-in');
                
                // Update user info in dashboard header
                updateUserInfoInDashboard();
                
                // Initialize dashboard data
                if (typeof window.initDashboard === 'function') {
                    window.initDashboard();
                }
            }, 50);
        }, 500);
    }

    function showLogin() {
        // Add fade out effect to dashboard
        dashboardSection.style.opacity = '0';
        dashboardSection.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            // Hide dashboard and reset opacity
            dashboardSection.style.display = 'none';
            dashboardSection.style.opacity = '1';
            
            // Show auth section with fade in effect
            authSection.style.opacity = '0';
            authSection.style.display = 'flex';
            
            setTimeout(() => {
                authSection.style.opacity = '1';
                authSection.style.transition = 'opacity 0.5s ease';
                
                // Remove logged-in class from body
                document.body.classList.remove('logged-in');
                
                // Reset forms
                document.getElementById('login-email').value = '';
                document.getElementById('login-password').value = '';
                if (document.getElementById('register-name')) document.getElementById('register-name').value = '';
                if (document.getElementById('register-email')) document.getElementById('register-email').value = '';
                if (document.getElementById('register-password')) document.getElementById('register-password').value = '';
                if (document.getElementById('register-confirm')) document.getElementById('register-confirm').value = '';
                
                // Reset form state
                const formGroups = document.querySelectorAll('.form-group');
                formGroups.forEach(group => {
                    group.classList.remove('focused');
                });
            }, 50);
        }, 500);
    }

    function updateUserInfoInDashboard() {
        const user = JSON.parse(localStorage.getItem('ecoride_user') || '{}');
        
        // Update user name and role
        if (user.name) {
            const userNameElement = document.querySelector('.user-name');
            const userRoleElement = document.querySelector('.user-role');
            const userNameDisplays = document.querySelectorAll('.user-name-display');
            
            if (userNameElement) {
                userNameElement.textContent = user.name;
            }
            
            if (userRoleElement) {
                userRoleElement.textContent = user.role ? 
                    user.role.charAt(0).toUpperCase() + user.role.slice(1) : 
                    'Customer';
            }
            
            if (userNameDisplays) {
                userNameDisplays.forEach(display => {
                    display.textContent = user.name;
                });
            }
        }
    }

    function updateUIForUserRole(user) {
        const adminOnlyElements = document.querySelectorAll('.admin-only');
        if (adminOnlyElements) {
            adminOnlyElements.forEach(element => {
                element.style.display = user.role === 'admin' ? 'block' : 'none';
            });
        }
    }

    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('ecoride_user') !== null;
    if (isLoggedIn) {
        // Show dashboard without animation for initial load
        dashboardSection.style.display = 'block';
        authSection.style.display = 'none';
        document.body.classList.add('logged-in');
        updateUserInfoInDashboard();
        if (typeof window.initDashboard === 'function') {
            window.initDashboard();
        }
    }

    // Tab Switching
    if (loginTab && registerTab) {
        loginTab.addEventListener('click', function() {
            switchTab('login');
        });

        registerTab.addEventListener('click', function() {
            switchTab('register');
        });
    }

    function switchTab(tab) {
        // Update tab styles
        loginTab.classList.toggle('active', tab === 'login');
        registerTab.classList.toggle('active', tab === 'register');
        
        // Show/hide forms with fade effect
        if (tab === 'login') {
            registerForm.style.opacity = '0';
            setTimeout(() => {
                registerForm.style.display = 'none';
                loginForm.style.display = 'block';
                setTimeout(() => {
                    loginForm.style.opacity = '1';
                }, 50);
            }, 300);
        } else {
            loginForm.style.opacity = '0';
            setTimeout(() => {
                loginForm.style.display = 'none';
                registerForm.style.display = 'block';
                setTimeout(() => {
                    registerForm.style.opacity = '1';
                }, 50);
            }, 300);
        }
    }
}); 