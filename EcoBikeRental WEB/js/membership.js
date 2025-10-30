// Membership Module for EcoRide Bicycle Rentals

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const membershipSection = document.getElementById('membership-section');
    const upgradeButtons = document.querySelectorAll('.btn-primary:contains("Upgrade to Gold")');
    const membershipPlans = document.querySelectorAll('.stat-card[style*="position: relative"]');
    const pointsProgress = document.querySelector('div[style*="inline-size: 60%"]');
    const pointsDisplay = document.querySelector('span:contains("points to Gold")');
    const membershipCard = document.querySelector('div[style*="background: linear-gradient(135deg, #6c5ce7, #a29bfe)"]');

    // Membership data structure
    const membershipLevels = {
        basic: {
            name: 'Basic',
            icon: '🚲',
            color: '#95a5a6',
            benefits: [
                'Standard rates',
                'Email support',
                'Online booking'
            ],
            pointsRequired: 0
        },
        silver: {
            name: 'Silver',
            icon: '🥈',
            color: '#bdc3c7',
            benefits: [
                '10% discount on all rentals',
                'Free helmet with each rental',
                'Priority booking (24h advance)',
                '24/7 customer support',
                'Earn points with each ride'
            ],
            pointsRequired: 100
        },
        gold: {
            name: 'Gold',
            icon: '🥇',
            color: '#f1c40f',
            benefits: [
                '20% discount on all rentals',
                'All accessories included free',
                'VIP booking (2 weeks advance)',
                'Personal assistant support',
                'Free bike delivery & pickup'
            ],
            pointsRequired: 300
        }
    };

    // Initialize membership data
    function initMembership() {
        const user = JSON.parse(localStorage.getItem('ecoride_user') || '{}');
        if (!user.membership) {
            user.membership = {
                level: 'basic',
                points: 0,
                validUntil: null
            };
            localStorage.setItem('ecoride_user', JSON.stringify(user));
        }
        updateMembershipDisplay();
    }

    // Update membership display
    function updateMembershipDisplay() {
        const user = JSON.parse(localStorage.getItem('ecoride_user') || '{}');
        const membership = user.membership || { level: 'basic', points: 0 };

        // Update membership card
        if (membershipCard) {
            const memberLevel = membershipLevels[membership.level];
            membershipCard.querySelector('span:last-child').textContent = membership.level.toUpperCase();
            membershipCard.style.background = `linear-gradient(135deg, ${memberLevel.color}, ${adjustColor(memberLevel.color, 20)})`;
        }

        // Update points progress
        if (pointsProgress && pointsDisplay) {
            const currentLevel = membershipLevels[membership.level];
            const nextLevel = membership.level === 'basic' ? 'silver' : 'gold';
            const nextLevelPoints = membershipLevels[nextLevel].pointsRequired;
            const progress = (membership.points / nextLevelPoints) * 100;
            
            pointsProgress.style.width = `${progress}%`;
            pointsDisplay.textContent = `${nextLevelPoints - membership.points} points to ${nextLevel.charAt(0).toUpperCase() + nextLevel.slice(1)}`;
        }

        // Update membership status in dashboard
        const membershipStatus = document.querySelector('.stat-card .stat-value:contains("Silver")');
        if (membershipStatus) {
            membershipStatus.textContent = membership.level.charAt(0).toUpperCase() + membership.level.slice(1);
        }
    }

    // Handle membership upgrade
    function handleUpgrade() {
        const user = JSON.parse(localStorage.getItem('ecoride_user') || '{}');
        const membership = user.membership || { level: 'basic', points: 0 };

        if (membership.level === 'basic') {
            membership.level = 'silver';
            membership.validUntil = new Date();
            membership.validUntil.setMonth(membership.validUntil.getMonth() + 1);
        } else if (membership.level === 'silver') {
            membership.level = 'gold';
            membership.validUntil = new Date();
            membership.validUntil.setMonth(membership.validUntil.getMonth() + 1);
        }

        user.membership = membership;
        localStorage.setItem('ecoride_user', JSON.stringify(user));
        updateMembershipDisplay();

        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = `Congratulations! You've been upgraded to ${membership.level.charAt(0).toUpperCase() + membership.level.slice(1)} membership!`;
        membershipSection.insertBefore(successMessage, membershipSection.firstChild);

        // Remove success message after 3 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    }

    // Add points to membership
    function addPoints(points) {
        const user = JSON.parse(localStorage.getItem('ecoride_user') || '{}');
        const membership = user.membership || { level: 'basic', points: 0 };
        
        membership.points += points;
        user.membership = membership;
        localStorage.setItem('ecoride_user', JSON.stringify(user));
        updateMembershipDisplay();
    }

    // Helper function to adjust color brightness
    function adjustColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return `#${(1 << 24 | (R < 255 ? R < 1 ? 0 : R : 255) << 16 | (G < 255 ? G < 1 ? 0 : G : 255) << 8 | (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)}`;
    }

    // Event Listeners
    if (upgradeButtons) {
        upgradeButtons.forEach(button => {
            button.addEventListener('click', handleUpgrade);
        });
    }

    // Initialize membership when the section is loaded
    if (membershipSection) {
        initMembership();
    }

    // Expose functions to window for external use
    window.membershipModule = {
        addPoints,
        updateMembershipDisplay,
        initMembership
    };
}); 