
// Global state
let currentUser = null;
let currentTab = 'dashboard';
let userBookings = [];
let selectedFacility = null;

// Mock data
const mockFacilities = [
    {
        id: 1,
        name: "Green Valley Cold Storage",
        type: "Cold Room",
        location: "North Region",
        capacity: "500 tons",
        temperature: "-2°C to 4°C",
        pricePerDay: 50,
        rating: 4.8,
        available: true,
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&h=200&fit=crop",
        features: ["24/7 Monitoring", "Humidity Control", "Security System"]
    },
    {
        id: 2,
        name: "Harvest Grain Silo",
        type: "Grain Silo",
        location: "South Region",
        capacity: "1000 tons",
        temperature: "Ambient",
        pricePerDay: 30,
        rating: 4.6,
        available: true,
        image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop",
        features: ["Pest Control", "Quality Testing", "Easy Access"]
    },
    {
        id: 3,
        name: "Sunshine Dryer Facility",
        type: "Dryer",
        location: "East Region",
        capacity: "200 tons/day",
        temperature: "40°C - 60°C",
        pricePerDay: 80,
        rating: 4.9,
        available: true,
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&h=200&fit=crop",
        features: ["Advanced Drying", "Quality Control", "Fast Processing"]
    },
    {
        id: 4,
        name: "Central Valley Warehouse",
        type: "Warehouse",
        location: "West Region",
        capacity: "800 tons",
        temperature: "Ambient",
        pricePerDay: 25,
        rating: 4.4,
        available: true,
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&h=200&fit=crop",
        features: ["Large Space", "Loading Docks", "Flexible Terms"]
    },
    {
        id: 5,
        name: "Premium Cold Storage",
        type: "Cold Room",
        location: "North Region",
        capacity: "300 tons",
        temperature: "-5°C to 0°C",
        pricePerDay: 75,
        rating: 4.7,
        available: false,
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&h=200&fit=crop",
        features: ["Ultra-low Temperature", "Premium Service", "Quick Access"]
    }
];

// Utility functions
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    toastMessage.textContent = message;
    
    // Reset classes
    toast.className = 'fixed top-4 right-4 text-white px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 z-50';
    
    if (type === 'error') {
        toast.classList.add('bg-red-600');
    } else if (type === 'warning') {
        toast.classList.add('bg-yellow-600');
    } else {
        toast.classList.add('bg-green-600');
    }
    
    toast.classList.remove('translate-x-full');
    
    setTimeout(() => {
        toast.classList.add('translate-x-full');
    }, 3000);
}

function getStatusBadge(status) {
    const badges = {
        'active': 'bg-green-100 text-green-800',
        'completed': 'bg-green-100 text-green-800',
        'pending': 'bg-yellow-100 text-yellow-800',
        'cancelled': 'bg-red-100 text-red-800'
    };
    
    const icons = {
        'active': 'fa-check-circle',
        'completed': 'fa-check-circle',
        'pending': 'fa-clock',
        'cancelled': 'fa-times-circle'
    };
    
    return `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badges[status] || 'bg-gray-100 text-gray-800'}">
        <i class="fas ${icons[status] || 'fa-circle'} mr-1"></i>
        ${status.charAt(0).toUpperCase() + status.slice(1)}
    </span>`;
}

// Page navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        targetPage.classList.add('active');
    }
}

// getting the active tab
const dashboardTab = document.querySelectorAll('.tab-btn');
function showTab(tabName, event) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-white', 'shadow-sm');
        btn.classList.add('text-gray-500', 'hover:text-gray-700');
    });
    
    event.target.classList.add('active', 'bg-white', 'shadow-sm');
    event.target.classList.remove('text-gray-500', 'hover:text-gray-700');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    const targetTab = document.getElementById(`${tabName}-tab`);
    if (targetTab) {
        targetTab.classList.remove('hidden');
    }
    
    currentTab = tabName;
    
    // Load content based on tab
    if (tabName === 'booking') {
        loadFacilities();
    } else if (tabName === 'my-bookings') {
        loadUserBookings();
    }
}

// Authentication functions
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const role = document.getElementById('login-role').value;
    
    if (!email || !password || !role) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Mock authentication
    currentUser = {
        email: email,
        role: role,
        name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    };
    
    showToast(`Welcome back, ${currentUser.name}!`);
    
    // Update UI
    document.getElementById('user-role-badge').textContent = role.charAt(0).toUpperCase() + role.slice(1).replace('-', ' ');
    document.getElementById('user-info').textContent = `Welcome, ${currentUser.name}`;
    
    // Load dashboard data
    loadDashboard();
    
    // Show dashboard
    showPage('dashboard-page');
}

function handleSignup(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('signup-first-name').value;
    const lastName = document.getElementById('signup-last-name').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const role = document.getElementById('signup-role').value;
    const agreeTerms = document.getElementById('agree-terms').checked;
    
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword || !role) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showToast('Please agree to the terms and conditions', 'error');
        return;
    }
    
    // Mock user creation
    currentUser = {
        email: email,
        role: role,
        name: `${firstName} ${lastName}`,
        phone: phone
    };
    
    showToast(`Account created successfully! Welcome ${currentUser.name}!`);
    
    // Update UI
    document.getElementById('user-role-badge').textContent = role.charAt(0).toUpperCase() + role.slice(1).replace('-', ' ');
    document.getElementById('user-info').textContent = `Welcome, ${currentUser.name}`;
    
    // Load dashboard data
    loadDashboard();
    
    // Show dashboard
    showPage('dashboard-page');
}

function logout() {
    currentUser = null;
    userBookings = [];
    showPage('landing-page');
    showToast('Successfully logged out');
    
    // Reset forms
    document.getElementById('login-form').reset();
    document.getElementById('signup-form').reset();
}

// Dashboard functions
function loadDashboard() {
    updateStatsCards();
    loadRecentActivity();
    loadFacilities();
}

function updateStatsCards() {
    const activeBookings = userBookings.filter(b => b.status === 'active').length;
    document.getElementById('active-bookings-count').textContent = activeBookings;
    document.getElementById('logistics-count').textContent = '0';
}

function loadRecentActivity() {
    const activityContainer = document.getElementById('recent-activity');
    
    const activities = [
        {
            icon: 'fa-warehouse',
            color: 'text-green-600',
            title: 'Welcome to AgroFlow!',
            description: 'Your account has been created successfully',
            time: 'Just now'
        },
        {
            icon: 'fa-info-circle',
            color: 'text-blue-600',
            title: 'Explore Storage Options',
            description: 'Browse available storage facilities in the Book Storage tab',
            time: 'Get started'
        },
        {
            icon: 'fa-phone',
            color: 'text-purple-600',
            title: 'Need Help?',
            description: 'Contact our support team for assistance',
            time: 'Available 24/7'
        }
    ];
    
    activityContainer.innerHTML = activities.map(activity => `
        <div class="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
            <div class="flex-shrink-0">
                <i class="fas ${activity.icon} ${activity.color}"></i>
            </div>
            <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">${activity.title}</p>
                <p class="text-sm text-gray-500">${activity.description}</p>
            </div>
            <div class="text-xs text-gray-400">${activity.time}</div>
        </div>
    `).join('');
}

// Facilities and booking functions
function loadFacilities() {
    const facilitiesList = document.getElementById('facilities-list');
    
    facilitiesList.innerHTML = mockFacilities.map(facility => `
        <div class="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${!facility.available ? 'opacity-60' : ''}">
            <img src="${facility.image}" alt="${facility.name}" class="w-full h-48 object-cover">
            <div class="p-6">
                <div class="flex items-start justify-between mb-3">
                    <h4 class="font-semibold text-lg">${facility.name}</h4>
                    <div class="flex items-center text-yellow-500">
                        <i class="fas fa-star text-sm"></i>
                        <span class="ml-1 text-sm text-gray-600">${facility.rating}</span>
                    </div>
                </div>
                
                <div class="space-y-2 mb-4">
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="fas fa-tag w-4 mr-3"></i>
                        <span>${facility.type}</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="fas fa-map-marker-alt w-4 mr-3"></i>
                        <span>${facility.location}</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="fas fa-weight w-4 mr-3"></i>
                        <span>${facility.capacity}</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="fas fa-thermometer-half w-4 mr-3"></i>
                        <span>${facility.temperature}</span>
                    </div>
                </div>
                
                <div class="flex flex-wrap gap-1 mb-4">
                    ${facility.features.map(feature => `
                        <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">${feature}</span>
                    `).join('')}
                </div>
                
                <div class="flex items-center justify-between">
                    <span class="text-xl font-bold text-primary">$${facility.pricePerDay}/day</span>
                    <button onclick="openBookingModal(${facility.id})" 
                            class="bg-primary hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors ${!facility.available ? 'opacity-50 cursor-not-allowed' : ''}"
                            ${!facility.available ? 'disabled' : ''}>
                        ${facility.available ? 'Book Now' : 'Unavailable'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterFacilities() {
    const type = document.getElementById('filter-type').value;
    const location = document.getElementById('filter-location').value;
    const startDate = document.getElementById('filter-start-date').value;
    const duration = document.getElementById('filter-duration').value;
    
    let filteredFacilities = mockFacilities.filter(facility => {
        if (type && facility.type !== type) return false;
        if (location && facility.location !== location) return false;
        // Add more filtering logic as needed
        return true;
    });
    
    const facilitiesList = document.getElementById('facilities-list');
    
    if (filteredFacilities.length === 0) {
        facilitiesList.innerHTML = `
            <div class="col-span-2 text-center py-12">
                <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600">No facilities found matching your criteria</p>
                <button onclick="loadFacilities()" class="mt-4 text-primary hover:underline">Clear filters</button>
            </div>
        `;
        return;
    }
    
    facilitiesList.innerHTML = filteredFacilities.map(facility => `
        <div class="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${!facility.available ? 'opacity-60' : ''}">
            <img src="${facility.image}" alt="${facility.name}" class="w-full h-48 object-cover">
            <div class="p-6">
                <div class="flex items-start justify-between mb-3">
                    <h4 class="font-semibold text-lg">${facility.name}</h4>
                    <div class="flex items-center text-yellow-500">
                        <i class="fas fa-star text-sm"></i>
                        <span class="ml-1 text-sm text-gray-600">${facility.rating}</span>
                    </div>
                </div>
                
                <div class="space-y-2 mb-4">
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="fas fa-tag w-4 mr-3"></i>
                        <span>${facility.type}</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="fas fa-map-marker-alt w-4 mr-3"></i>
                        <span>${facility.location}</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="fas fa-weight w-4 mr-3"></i>
                        <span>${facility.capacity}</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="fas fa-thermometer-half w-4 mr-3"></i>
                        <span>${facility.temperature}</span>
                    </div>
                </div>
                
                <div class="flex flex-wrap gap-1 mb-4">
                    ${facility.features.map(feature => `
                        <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">${feature}</span>
                    `).join('')}
                </div>
                
                <div class="flex items-center justify-between">
                    <span class="text-xl font-bold text-primary">$${facility.pricePerDay}/day</span>
                    <button onclick="openBookingModal(${facility.id})" 
                            class="bg-primary hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors ${!facility.available ? 'opacity-50 cursor-not-allowed' : ''}"
                            ${!facility.available ? 'disabled' : ''}>
                        ${facility.available ? 'Book Now' : 'Unavailable'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    showToast(`Found ${filteredFacilities.length} facilities matching your criteria`);
}

function openBookingModal(facilityId) {
    if (!currentUser) {
        showToast('Please log in to book a facility', 'error');
        showPage('login-page');
        return;
    }
    
    selectedFacility = mockFacilities.find(f => f.id === facilityId);
    if (!selectedFacility) return;
    
    document.getElementById('booking-facility').value = selectedFacility.name;
    document.getElementById('booking-modal').classList.remove('hidden');
    
    // Set default dates
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    document.getElementById('booking-start-date').value = today.toISOString().split('T')[0];
    document.getElementById('booking-end-date').value = nextWeek.toISOString().split('T')[0];
    
    calculateBookingCost();
}

function closeBookingModal() {
    document.getElementById('booking-modal').classList.add('hidden');
    document.getElementById('booking-form').reset();
    selectedFacility = null;
}

function calculateBookingCost() {
    if (!selectedFacility) return;
    
    const startDate = new Date(document.getElementById('booking-start-date').value);
    const endDate = new Date(document.getElementById('booking-end-date').value);
    
    if (startDate && endDate && endDate > startDate) {
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const totalCost = days * selectedFacility.pricePerDay;
        document.getElementById('booking-total-cost').textContent = `$${totalCost}`;
    } else {
        document.getElementById('booking-total-cost').textContent = '$0';
    }
}

function handleBooking(event) {
    event.preventDefault();
    
    const crop = document.getElementById('booking-crop').value;
    const quantity = document.getElementById('booking-quantity').value;
    const startDate = document.getElementById('booking-start-date').value;
    const endDate = document.getElementById('booking-end-date').value;
    
    if (!crop || !quantity || !startDate || !endDate) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (new Date(endDate) <= new Date(startDate)) {
        showToast('End date must be after start date', 'error');
        return;
    }
    
    // Create booking
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const totalCost = days * selectedFacility.pricePerDay;
    
    const booking = {
        id: userBookings.length + 1,
        facilityId: selectedFacility.id,
        facilityName: selectedFacility.name,
        facilityType: selectedFacility.type,
        crop: crop,
        quantity: quantity,
        startDate: startDate,
        endDate: endDate,
        status: 'pending',
        totalCost: totalCost,
        createdAt: new Date().toISOString()
    };
    
    userBookings.push(booking);
    
    showToast(`Booking request submitted for ${selectedFacility.name}!`);
    closeBookingModal();
    updateStatsCards();
    
    // Switch to my bookings tab if on dashboard
    if (currentTab === 'booking') {
        showTab('my-bookings');
        // Simulate clicking the tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-white', 'shadow-sm');
            btn.classList.add('text-gray-500', 'hover:text-gray-700');
        });
        document.querySelector('.tab-btn:nth-child(3)').classList.add('active', 'bg-white', 'shadow-sm');
        document.querySelector('.tab-btn:nth-child(3)').classList.remove('text-gray-500', 'hover:text-gray-700');
    }
}

function loadUserBookings() {
    const bookingsList = document.getElementById('user-bookings-list');
    
    if (userBookings.length === 0) {
        bookingsList.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-calendar text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600 mb-4">You don't have any bookings yet</p>
                <button onclick="showTab('booking')" class="bg-primary hover:bg-green-700 text-white px-6 py-3 rounded-md">
                    Book Storage Now
                </button>
            </div>
        `;
        return;
    }
    
    bookingsList.innerHTML = userBookings.map(booking => `
        <div class="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
                <h4 class="font-semibold text-lg">${booking.facilityName}</h4>
                ${getStatusBadge(booking.status)}
            </div>
            
            <div class="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                    <p class="text-sm text-gray-600">Type: ${booking.facilityType}</p>
                    <p class="text-sm text-gray-600">Crop: ${booking.crop}</p>
                    <p class="text-sm text-gray-600">Quantity: ${booking.quantity} tons</p>
                </div>
                <div>
                    <p class="text-sm text-gray-600">Start: ${booking.startDate}</p>
                    <p class="text-sm text-gray-600">End: ${booking.endDate}</p>
                    <p class="text-sm text-gray-600">Total Cost: $${booking.totalCost}</p>
                </div>
            </div>
            
            <div class="flex space-x-2">
                <button class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
                    View Details
                </button>
                ${booking.status === 'pending' ? `
                    <button onclick="cancelBooking(${booking.id})" class="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 text-sm">
                        Cancel
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function cancelBooking(bookingId) {
    const booking = userBookings.find(b => b.id === bookingId);
    if (booking && booking.status === 'pending') {
        booking.status = 'cancelled';
        showToast('Booking cancelled successfully');
        loadUserBookings();
        updateStatsCards();
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Signup form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Booking form
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBooking);
    }
    
    // Booking date change listeners
    const startDateInput = document.getElementById('booking-start-date');
    const endDateInput = document.getElementById('booking-end-date');
    
    if (startDateInput && endDateInput) {
        startDateInput.addEventListener('change', calculateBookingCost);
        endDateInput.addEventListener('change', calculateBookingCost);
    }
    
    // Initialize active tab styling
    const activeTabBtn = document.querySelector('.tab-btn.active');
    if (activeTabBtn) {
        activeTabBtn.classList.add('bg-white', 'shadow-sm');
        activeTabBtn.classList.remove('text-gray-500');
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeBookingModal();
            }
        });
    }
});

// Global functions for HTML onclick handlers
window.showPage = showPage;
window.showTab = showTab;
window.logout = logout;
window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;
window.filterFacilities = filterFacilities;
window.cancelBooking = cancelBooking;
