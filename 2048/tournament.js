// Tournament Director - Main JavaScript

// Version Management
const APP_VERSION = '1.2.0'; // Update this when you make changes
const VERSION_KEY = 'appVersion';
const UPDATE_DISMISSED_KEY = 'updateDismissed';

// Data Storage
let tournaments = [];
let participants = [];
let sponsors = [];
let prizePools = [];
let schedules = [];
let laneAssignments = [];
let tournamentRegistrations = [];
let bowlerDatabase = [];
let currentUser = null;

// Toast Notification System
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };
    
    toast.className = `${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 transform transition-all duration-300 translate-x-0 opacity-100 min-w-[300px]`;
    toast.innerHTML = `
        <i class="fas ${icons[type]} text-xl"></i>
        <span class="flex-1 font-medium">${message}</span>
        <button onclick="this.parentElement.remove()" class="text-white hover:text-gray-200">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.getElementById('toastContainer').appendChild(toast);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    checkForUpdates();
    checkAuthentication();
});

// Dark Mode Functions
function toggleDarkMode() {
    const body = document.body;
    const icon = document.getElementById('darkModeIcon');
    
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('darkMode', 'disabled');
    }
}

function loadDarkModePreference() {
    const darkMode = localStorage.getItem('darkMode');
    const body = document.body;
    const icon = document.getElementById('darkModeIcon');
    
    if (darkMode === 'enabled') {
        body.classList.add('dark-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

// Authentication Functions
function checkAuthentication() {
    const loggedInUser = localStorage.getItem('currentUser');
    
    if (loggedInUser) {
        currentUser = JSON.parse(loggedInUser);
        hideLoginModal();
        initializeApp();
    } else {
        showLoginModal();
    }
}

function showLoginModal() {
    document.getElementById('loginModal').classList.remove('hidden');
    document.getElementById('loginModal').classList.add('flex');
}

function hideLoginModal() {
    document.getElementById('loginModal').classList.add('hidden');
    document.getElementById('loginModal').classList.remove('flex');
}

function showSignupForm() {
    document.getElementById('loginFormContainer').classList.add('hidden');
    document.getElementById('signupFormContainer').classList.remove('hidden');
}

function showLoginForm() {
    document.getElementById('signupFormContainer').classList.add('hidden');
    document.getElementById('loginFormContainer').classList.remove('hidden');
}

function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const role = document.getElementById('signupRole').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showToast('Passwords do not match!', 'error');
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
        showToast('An account with this email already exists!', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        role: role,
        password: password, // In production, this should be hashed
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login after signup
    currentUser = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Reset form
    document.getElementById('signupForm').reset();
    
    // Hide login modal and initialize app
    hideLoginModal();
    initializeApp();
    
    showToast('Account created successfully!', 'success');
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        showToast('Invalid email or password!', 'error');
        return;
    }
    
    // Set current user
    currentUser = { id: user.id, name: user.name, email: user.email, role: user.role };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Reset form
    document.getElementById('loginForm').reset();
    
    // Hide login modal and initialize app
    hideLoginModal();
    initializeApp();
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        currentUser = null;
        location.reload();
    }
}

function initializeApp() {
    // Display user name and role
    document.getElementById('userNameDisplay').textContent = currentUser.name;
    document.getElementById('userRoleDisplay').textContent = getRoleDisplayName(currentUser.role);
    
    // Apply role-based permissions
    applyRolePermissions();
    
    // Load data and initialize
    loadFromLocalStorage();
    updateDashboard();
    populateSelects();
    loadDarkModePreference();
}

function getRoleDisplayName(role) {
    const roleNames = {
        'admin': 'Administrator',
        'director': 'Tournament Director',
        'bowler': 'Bowler'
    };
    return roleNames[role] || role;
}

function applyRolePermissions() {
    const role = currentUser.role;
    
    // Get all navigation items
    const navItems = {
        dashboard: document.querySelector('a[onclick*="dashboard"]'),
        tournaments: document.querySelector('a[onclick*="tournaments"]'),
        brackets: document.querySelector('a[onclick*="brackets"]'),
        scheduling: document.querySelector('a[onclick*="scheduling"]'),
        lanes: document.querySelector('a[onclick*="lanes"]'),
        prizes: document.querySelector('a[onclick*="prizes"]'),
        sponsors: document.querySelector('a[onclick*="sponsors"]'),
        participants: document.querySelector('a[onclick*="participants"]'),
        myRegistrations: document.getElementById('myRegistrationsNav')
    };
    
    // Role-based access control
    if (role === 'bowler') {
        // Bowlers can only view dashboard, brackets, and tournaments (read-only)
        hideNavItem(navItems.scheduling);
        hideNavItem(navItems.lanes);
        hideNavItem(navItems.prizes);
        hideNavItem(navItems.sponsors);
        hideNavItem(navItems.participants);
        
        // Show My Registrations for bowlers
        if (navItems.myRegistrations) {
            navItems.myRegistrations.style.display = 'flex';
        }
        
        // Disable create buttons for bowlers
        disableCreateButtons();
        
    } else if (role === 'director') {
        // Tournament Directors have access to most features except sponsors
        // They can manage tournaments, brackets, scheduling, lanes, prizes, and participants
        // Full access to all features
        
    } else if (role === 'admin') {
        // Admins have full access to everything
        // No restrictions
    }
}

function hideNavItem(navItem) {
    if (navItem) {
        navItem.style.display = 'none';
    }
}

function disableCreateButtons() {
    // This will be called when sections load to disable create/edit buttons for bowlers
    window.isBowler = true;
}

// Local Storage Functions
function saveToLocalStorage() {
    localStorage.setItem('tournaments', JSON.stringify(tournaments));
    localStorage.setItem('participants', JSON.stringify(participants));
    localStorage.setItem('sponsors', JSON.stringify(sponsors));
    localStorage.setItem('prizePools', JSON.stringify(prizePools));
    localStorage.setItem('schedules', JSON.stringify(schedules));
    localStorage.setItem('laneAssignments', JSON.stringify(laneAssignments));
    localStorage.setItem('tournamentRegistrations', JSON.stringify(tournamentRegistrations));
    localStorage.setItem('bowlerDatabase', JSON.stringify(bowlerDatabase));
}

function loadFromLocalStorage() {
    tournaments = JSON.parse(localStorage.getItem('tournaments')) || [];
    participants = JSON.parse(localStorage.getItem('participants')) || [];
    sponsors = JSON.parse(localStorage.getItem('sponsors')) || [];
    prizePools = JSON.parse(localStorage.getItem('prizePools')) || [];
    schedules = JSON.parse(localStorage.getItem('schedules')) || [];
    laneAssignments = JSON.parse(localStorage.getItem('laneAssignments')) || [];
    tournamentRegistrations = JSON.parse(localStorage.getItem('tournamentRegistrations')) || [];
    bowlerDatabase = JSON.parse(localStorage.getItem('bowlerDatabase')) || [];
}

// Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active', 'text-white');
        item.classList.add('text-gray-700');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.remove('hidden');
    
    // Add active class to clicked nav item
    event.target.closest('.nav-item').classList.add('active', 'text-white');
    event.target.closest('.nav-item').classList.remove('text-gray-700');
    
    // Load section-specific data
    switch(sectionId) {
        case 'tournaments':
            loadTournaments();
            hideCreateButtonForBowlers('tournaments');
            break;
        case 'brackets':
            populateBracketSelect();
            break;
        case 'scheduling':
            populateScheduleSelect();
            break;
        case 'lanes':
            populateLaneSelect();
            break;
        case 'prizes':
            loadPrizePools();
            hideCreateButtonForBowlers('prizes');
            break;
        case 'sponsors':
            loadSponsors();
            hideCreateButtonForBowlers('sponsors');
            break;
        case 'myRegistrations':
            loadMyRegistrations();
            break;
        case 'bowlerDatabase':
            loadBowlerDatabase();
            break;
    }
}

function hideCreateButtonForBowlers(section) {
    if (currentUser && currentUser.role === 'bowler') {
        // Hide create buttons for bowlers
        setTimeout(() => {
            const buttons = document.querySelectorAll(`#${section} button[onclick*="show"]`);
            buttons.forEach(btn => {
                if (btn.textContent.includes('Create') || btn.textContent.includes('Add')) {
                    btn.style.display = 'none';
                }
            });
        }, 100);
    }
}

// Modal Functions
function showCreateTournamentModal() {
    document.getElementById('createTournamentModal').classList.remove('hidden');
    document.getElementById('createTournamentModal').classList.add('flex');
}

function showParticipantModal() {
    document.getElementById('participantModal').classList.remove('hidden');
    document.getElementById('participantModal').classList.add('flex');
}

function showPrizeModal() {
    populatePrizeTournamentSelect();
    document.getElementById('prizeModal').classList.remove('hidden');
    document.getElementById('prizeModal').classList.add('flex');
    updatePrizeDistribution();
}

function showSponsorModal() {
    populateSponsorTournamentSelect();
    document.getElementById('sponsorModal').classList.remove('hidden');
    document.getElementById('sponsorModal').classList.add('flex');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    document.getElementById(modalId).classList.remove('flex');
}

// Tournament Functions
function createTournament(event) {
    event.preventDefault();
    
    const tournament = {
        id: Date.now(),
        name: document.getElementById('tournamentName').value,
        format: document.getElementById('tournamentFormat').value,
        startDate: document.getElementById('tournamentStartDate').value,
        registrationDeadline: document.getElementById('tournamentRegistrationDeadline').value,
        maxParticipants: parseInt(document.getElementById('tournamentMaxParticipants').value),
        description: document.getElementById('tournamentDescription').value,
        participants: [],
        registrations: [],
        bracket: null,
        status: 'upcoming'
    };
    
    tournaments.push(tournament);
    saveToLocalStorage();
    updateDashboard();
    loadTournaments();
    populateSelects();
    closeModal('createTournamentModal');
    document.getElementById('createTournamentForm').reset();
    
    addActivity(`Created tournament: ${tournament.name}`);
    showToast(`Tournament "${tournament.name}" created successfully!`, 'success');
}

function loadTournaments() {
    const container = document.getElementById('tournamentsList');
    const isBowler = currentUser.role === 'bowler';
    
    if (tournaments.length === 0) {
        container.innerHTML = '<p class="text-gray-500 col-span-full text-center py-8">No tournaments created yet</p>';
        return;
    }
    
    container.innerHTML = tournaments.map(tournament => {
        const isRegistered = isBowler && isUserRegistered(tournament.id);
        const deadlinePassed = new Date(tournament.registrationDeadline) < new Date();
        const isFull = (tournament.registrations || []).length >= tournament.maxParticipants;
        
        return `
        <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-xl font-bold text-gray-900">${tournament.name}</h3>
                    <span class="px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tournament.status)}">
                        ${tournament.status}
                    </span>
                </div>
                <p class="text-gray-600 text-sm mb-4">${tournament.description || 'No description'}</p>
                <div class="space-y-2 text-sm text-gray-600">
                    <div class="flex items-center">
                        <i class="fas fa-calendar mr-2"></i>
                        <span>${new Date(tournament.startDate).toLocaleDateString()}</span>
                    </div>
                    <div class="flex items-center">
                        <i class="fas fa-clock mr-2"></i>
                        <span>Deadline: ${new Date(tournament.registrationDeadline).toLocaleString()}</span>
                    </div>
                    <div class="flex items-center">
                        <i class="fas fa-sitemap mr-2"></i>
                        <span>${formatTournamentType(tournament.format)}</span>
                    </div>
                    <div class="flex items-center">
                        <i class="fas fa-users mr-2"></i>
                        <span>${(tournament.registrations || []).length} / ${tournament.maxParticipants} registered</span>
                    </div>
                </div>
                ${isBowler ? `
                    <div class="mt-4">
                        ${isRegistered ? `
                            <div class="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                                <i class="fas fa-check-circle text-green-600 mr-2"></i>
                                <span class="text-green-700 font-medium">You're Registered!</span>
                            </div>
                        ` : deadlinePassed ? `
                            <div class="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                                <i class="fas fa-times-circle text-red-600 mr-2"></i>
                                <span class="text-red-700 font-medium">Registration Closed</span>
                            </div>
                        ` : isFull ? `
                            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                                <i class="fas fa-exclamation-circle text-yellow-600 mr-2"></i>
                                <span class="text-yellow-700 font-medium">Tournament Full</span>
                            </div>
                        ` : `
                            <button onclick="showBowlerRegistrationModal(${tournament.id})" class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                                <i class="fas fa-user-plus mr-2"></i>Register Now
                            </button>
                        `}
                    </div>
                ` : `
                    <div class="mt-4 space-y-2">
                        <button onclick="viewTournament(${tournament.id})" class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                            <i class="fas fa-eye mr-2"></i>View Details
                        </button>
                        <div class="flex space-x-2">
                            <button onclick="showManageBowlersModal(${tournament.id})" class="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                                <i class="fas fa-users mr-1"></i>Bowlers
                            </button>
                            <button onclick="showEditTournamentModal(${tournament.id})" class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="deleteTournament(${tournament.id})" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `}
            </div>
        </div>
    `;
    }).join('');
}

let currentViewingTournamentId = null;

function viewTournament(id) {
    const tournament = tournaments.find(t => t.id === id);
    if (!tournament) return;
    
    currentViewingTournamentId = id;
    
    // Populate header
    document.getElementById('viewTournamentName').textContent = tournament.name;
    document.getElementById('viewTournamentFormat').textContent = formatTournamentType(tournament.format);
    document.getElementById('viewTournamentStatusBadge').textContent = tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1);
    document.getElementById('viewTournamentStatusBadge').className = `px-4 py-2 rounded-full bg-white font-semibold ${
        tournament.status === 'upcoming' ? 'text-blue-600' :
        tournament.status === 'ongoing' ? 'text-green-600' : 'text-gray-600'
    }`;
    
    // Populate stats
    const registrationCount = (tournament.registrations || []).length;
    document.getElementById('viewTournamentRegistered').textContent = `${registrationCount} / ${tournament.maxParticipants}`;
    document.getElementById('viewTournamentStartDate').textContent = new Date(tournament.startDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    document.getElementById('viewTournamentDeadline').textContent = new Date(tournament.registrationDeadline).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    document.getElementById('viewTournamentBracket').textContent = tournament.bracket ? 'Generated' : 'Not Generated';
    
    // Populate description
    document.getElementById('viewTournamentDescription').textContent = tournament.description || 'No description provided';
    
    // Populate registered bowlers list
    const bowlersList = document.getElementById('viewTournamentBowlersList');
    if (registrationCount === 0) {
        bowlersList.innerHTML = '<p class="text-gray-500 text-center py-4">No registrations yet</p>';
    } else {
        bowlersList.innerHTML = tournament.registrations.map((reg, index) => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                <div class="flex items-center space-x-3">
                    <div class="bg-purple-100 rounded-full w-10 h-10 flex items-center justify-center">
                        <span class="font-bold text-purple-600">${index + 1}</span>
                    </div>
                    <div>
                        <p class="font-semibold text-gray-900">${reg.name}</p>
                        <p class="text-sm text-gray-500">${reg.email}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-sm font-medium text-gray-700">Avg: ${reg.bowlingAverage || 'N/A'}</p>
                    <p class="text-xs text-gray-500">${reg.discordName || 'No Discord'}</p>
                </div>
            </div>
        `).join('');
    }
    
    // Show modal
    document.getElementById('viewTournamentModal').classList.remove('hidden');
    document.getElementById('viewTournamentModal').classList.add('flex');
}

function editTournamentFromView() {
    if (currentViewingTournamentId) {
        closeModal('viewTournamentModal');
        showEditTournamentModal(currentViewingTournamentId);
    }
}

function viewTournamentBracket() {
    if (currentViewingTournamentId) {
        closeModal('viewTournamentModal');
        // Switch to brackets section
        showSection('brackets');
        document.getElementById('bracketTournamentSelect').value = currentViewingTournamentId;
        loadBracket();
    }
}

// Manage Tournament Bowlers Functions
let currentManagingTournamentId = null;
let selectedBowlersForTournament = [];

function showManageBowlersModal(tournamentId) {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return;
    
    currentManagingTournamentId = tournamentId;
    
    // Initialize with current registrations (convert to bowler database format)
    selectedBowlersForTournament = (tournament.registrations || []).map(reg => {
        // Try to find in database, or create temporary entry
        let bowler = bowlerDatabase.find(b => b.email === reg.email);
        if (!bowler) {
            bowler = {
                id: reg.userId || reg.id,
                name: reg.name,
                email: reg.email,
                discordName: reg.discordName,
                robloxName: reg.robloxName,
                bowlingAverage: reg.bowlingAverage,
                status: 'active'
            };
        }
        return bowler;
    });
    
    document.getElementById('manageBowlersTournamentName').textContent = tournament.name;
    
    updateSelectedBowlersList();
    filterAvailableBowlers();
    
    document.getElementById('manageBowlersModal').classList.remove('hidden');
    document.getElementById('manageBowlersModal').classList.add('flex');
}

function updateSelectedBowlersList() {
    const container = document.getElementById('selectedBowlersList');
    const countSpan = document.getElementById('selectedBowlersCount');
    
    countSpan.textContent = selectedBowlersForTournament.length;
    
    if (selectedBowlersForTournament.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">No bowlers selected yet</p>';
        return;
    }
    
    container.innerHTML = selectedBowlersForTournament.map(bowler => `
        <div class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 mb-2">
            <div class="flex items-center space-x-3">
                <div class="bg-green-100 rounded-full w-10 h-10 flex items-center justify-center">
                    <i class="fas fa-bowling-ball text-green-600"></i>
                </div>
                <div>
                    <p class="font-semibold text-gray-900">${bowler.name}</p>
                    <p class="text-sm text-gray-500">${bowler.email}</p>
                </div>
            </div>
            <div class="flex items-center space-x-3">
                <span class="text-sm font-medium text-gray-700">Avg: ${bowler.bowlingAverage || 'N/A'}</span>
                <button onclick="removeBowlerFromSelection(${bowler.id})" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-times-circle text-xl"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function filterAvailableBowlers() {
    const searchTerm = document.getElementById('manageBowlersSearch').value.toLowerCase();
    const container = document.getElementById('availableBowlersList');
    
    // Filter out already selected bowlers and apply search
    const availableBowlers = bowlerDatabase.filter(bowler => {
        const isNotSelected = !selectedBowlersForTournament.some(sb => sb.id === bowler.id);
        const matchesSearch = !searchTerm || 
            bowler.name.toLowerCase().includes(searchTerm) ||
            bowler.email.toLowerCase().includes(searchTerm) ||
            (bowler.discordName && bowler.discordName.toLowerCase().includes(searchTerm));
        
        return isNotSelected && matchesSearch && bowler.status === 'active';
    });
    
    if (availableBowlers.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">No available bowlers found</p>';
        return;
    }
    
    container.innerHTML = availableBowlers.map(bowler => `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-200">
            <div class="flex items-center space-x-3">
                <div class="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center">
                    <i class="fas fa-bowling-ball text-blue-600"></i>
                </div>
                <div>
                    <p class="font-semibold text-gray-900">${bowler.name}</p>
                    <p class="text-sm text-gray-500">${bowler.email}</p>
                </div>
            </div>
            <div class="flex items-center space-x-3">
                <span class="text-sm font-medium text-gray-700">Avg: ${bowler.bowlingAverage || 'N/A'}</span>
                <button onclick="addBowlerToSelection(${bowler.id})" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    <i class="fas fa-plus mr-1"></i>Add
                </button>
            </div>
        </div>
    `).join('');
}

function addBowlerToSelection(bowlerId) {
    const bowler = bowlerDatabase.find(b => b.id === bowlerId);
    if (!bowler) return;
    
    if (!selectedBowlersForTournament.some(sb => sb.id === bowlerId)) {
        selectedBowlersForTournament.push(bowler);
        updateSelectedBowlersList();
        filterAvailableBowlers();
        showToast(`${bowler.name} added to tournament`, 'success');
    }
}

function removeBowlerFromSelection(bowlerId) {
    selectedBowlersForTournament = selectedBowlersForTournament.filter(b => b.id !== bowlerId);
    updateSelectedBowlersList();
    filterAvailableBowlers();
}

function saveTournamentBowlers() {
    const tournament = tournaments.find(t => t.id === currentManagingTournamentId);
    if (!tournament) return;
    
    // Convert selected bowlers to registration format
    tournament.registrations = selectedBowlersForTournament.map(bowler => ({
        id: Date.now() + Math.random(),
        tournamentId: currentManagingTournamentId,
        userId: bowler.id,
        name: bowler.name,
        email: bowler.email,
        discordName: bowler.discordName || null,
        robloxName: bowler.robloxName || null,
        bowlingAverage: bowler.bowlingAverage || 0,
        skillLevel: bowler.skillLevel || 'intermediate',
        registeredAt: new Date().toISOString(),
        status: 'confirmed'
    }));
    
    saveToLocalStorage();
    loadTournaments();
    closeModal('manageBowlersModal');
    
    showToast(`${selectedBowlersForTournament.length} bowlers added to ${tournament.name}`, 'success');
    addActivity(`Updated bowlers for tournament: ${tournament.name}`);
}

function showEditTournamentModal(id) {
    const tournament = tournaments.find(t => t.id === id);
    if (!tournament) return;
    
    document.getElementById('editTournamentId').value = tournament.id;
    document.getElementById('editTournamentName').value = tournament.name;
    document.getElementById('editTournamentFormat').value = tournament.format;
    document.getElementById('editTournamentStartDate').value = tournament.startDate;
    document.getElementById('editTournamentRegistrationDeadline').value = tournament.registrationDeadline;
    document.getElementById('editTournamentMaxParticipants').value = tournament.maxParticipants;
    document.getElementById('editTournamentStatus').value = tournament.status;
    document.getElementById('editTournamentDescription').value = tournament.description || '';
    
    document.getElementById('editTournamentModal').classList.remove('hidden');
    document.getElementById('editTournamentModal').classList.add('flex');
}

function updateTournament(event) {
    event.preventDefault();
    
    const id = parseInt(document.getElementById('editTournamentId').value);
    const tournament = tournaments.find(t => t.id === id);
    
    if (!tournament) {
        showToast('Tournament not found!', 'error');
        return;
    }
    
    tournament.name = document.getElementById('editTournamentName').value;
    tournament.format = document.getElementById('editTournamentFormat').value;
    tournament.startDate = document.getElementById('editTournamentStartDate').value;
    tournament.registrationDeadline = document.getElementById('editTournamentRegistrationDeadline').value;
    tournament.maxParticipants = parseInt(document.getElementById('editTournamentMaxParticipants').value);
    tournament.status = document.getElementById('editTournamentStatus').value;
    tournament.description = document.getElementById('editTournamentDescription').value;
    
    saveToLocalStorage();
    loadTournaments();
    populateSelects();
    closeModal('editTournamentModal');
    
    addActivity(`Updated tournament: ${tournament.name}`);
    showToast(`Tournament "${tournament.name}" updated successfully!`, 'success');
}

function deleteTournament(id) {
    if (confirm('⚠️ Delete Tournament?\n\nThis will permanently delete the tournament and all its data. This action cannot be undone.')) {
        tournaments = tournaments.filter(t => t.id !== id);
        saveToLocalStorage();
        updateDashboard();
        loadTournaments();
        populateSelects();
        addActivity(`Deleted a tournament`);
    }
}

// Participant Functions
function addParticipant(event) {
    event.preventDefault();
    
    const participant = {
        id: Date.now(),
        name: document.getElementById('participantName').value,
        email: document.getElementById('participantEmail').value,
        bowlingAverage: parseInt(document.getElementById('participantAverage').value) || 0,
        skillLevel: document.getElementById('participantSkillLevel').value
    };
    
    participants.push(participant);
    saveToLocalStorage();
    updateDashboard();
    loadParticipants();
    closeModal('participantModal');
    document.getElementById('participantForm').reset();
    
    addActivity(`Added participant: ${participant.name}`);
    showToast(`${participant.name} added as participant!`, 'success');
}

function loadParticipants() {
    const tbody = document.getElementById('participantsTableBody');
    
    if (participants.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">No participants added yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = participants.map(participant => `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${participant.name}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">${participant.email}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-semibold text-gray-900">${participant.bowlingAverage || 'N/A'}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSkillLevelColor(participant.skillLevel)}">
                    ${participant.skillLevel}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="deleteParticipant(${participant.id})" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
        </tr>
    `).join('');
}

function deleteParticipant(id) {
    if (confirm('Are you sure you want to delete this participant?')) {
        participants = participants.filter(p => p.id !== id);
        saveToLocalStorage();
        updateDashboard();
        loadParticipants();
        addActivity(`Removed a participant`);
    }
}

function filterParticipants() {
    const searchTerm = document.getElementById('participantSearch').value.toLowerCase();
    const filteredParticipants = participants.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.email.toLowerCase().includes(searchTerm)
    );
    
    const tbody = document.getElementById('participantsTableBody');
    tbody.innerHTML = filteredParticipants.map(participant => `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${participant.name}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">${participant.email}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSkillLevelColor(participant.skillLevel)}">
                    ${participant.skillLevel}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${participant.rating}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="deleteParticipant(${participant.id})" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Bracket Functions
function populateBracketSelect() {
    const select = document.getElementById('bracketTournamentSelect');
    select.innerHTML = '<option value="">Select Tournament</option>' + 
        tournaments.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
}

function loadBracket() {
    const tournamentId = parseInt(document.getElementById('bracketTournamentSelect').value);
    const tournament = tournaments.find(t => t.id === tournamentId);
    
    if (!tournament) {
        document.getElementById('bracketView').innerHTML = '<p class="text-gray-500 text-center py-8">Select a tournament to view brackets</p>';
        return;
    }
    
    if (!tournament.bracket) {
        document.getElementById('bracketView').innerHTML = `
            <div class="text-center py-8">
                <p class="text-gray-500 mb-4">No bracket generated yet</p>
                <button onclick="generateBracket(${tournamentId})" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                    Generate Bracket
                </button>
            </div>
        `;
        return;
    }
    
    // Add tournament ID to bracket for score entry
    tournament.bracket.tournamentId = tournamentId;
    displayBracket(tournament.bracket);
}

function generateBracket(tournamentId) {
    const tournament = tournaments.find(t => t.id === tournamentId);
    
    // Get registered bowlers for this tournament
    const registeredBowlers = (tournament.registrations || []).map(reg => ({
        id: reg.userId || reg.id,
        name: reg.name,
        email: reg.email,
        bowlingAverage: reg.bowlingAverage || 160,
        skillLevel: reg.skillLevel
    }));
    
    if (!tournament || registeredBowlers.length < 1) {
        showToast('Need at least 1 registered bowler to generate bracket', 'warning');
        return;
    }
    
    const bracketSize = Math.pow(2, Math.ceil(Math.log2(registeredBowlers.length)));
    const bracket = {
        rounds: [],
        participants: registeredBowlers
    };
    
    // Generate single elimination bracket
    let currentRound = [];
    
    // First round - use registered bowlers
    for (let i = 0; i < bracketSize / 2; i++) {
        currentRound.push({
            id: Date.now() + i,
            player1: registeredBowlers[i * 2]?.id || null,
            player2: registeredBowlers[i * 2 + 1]?.id || null,
            winner: null,
            score: null
        });
    }
    bracket.rounds.push(currentRound);
    
    // Subsequent rounds
    let numMatches = bracketSize / 2;
    while (numMatches > 1) {
        numMatches = numMatches / 2;
        currentRound = [];
        for (let i = 0; i < numMatches; i++) {
            currentRound.push({
                id: Date.now() + i + 1000,
                player1: null,
                player2: null,
                winner: null,
                score: null
            });
        }
        bracket.rounds.push(currentRound);
    }
    
    tournament.bracket = bracket;
    saveToLocalStorage();
    loadBracket();
    addActivity(`Generated bracket for ${tournament.name} with ${registeredBowlers.length} bowlers`);
    showToast(`Bracket generated with ${registeredBowlers.length} registered bowlers!`, 'success');
}

function autoSeedBracket() {
    const tournamentId = parseInt(document.getElementById('bracketTournamentSelect').value);
    const tournament = tournaments.find(t => t.id === tournamentId);
    
    if (!tournament) {
        showToast('Please select a tournament first', 'warning');
        return;
    }
    
    if (!tournament.registrations || tournament.registrations.length === 0) {
        showToast('No registered bowlers to seed', 'warning');
        return;
    }
    
    // Sort registered bowlers by bowling average (highest to lowest)
    const sortedRegistrations = [...tournament.registrations]
        .sort((a, b) => (b.bowlingAverage || 0) - (a.bowlingAverage || 0));
    
    tournament.registrations = sortedRegistrations;
    saveToLocalStorage();
    
    // Regenerate bracket with seeded bowlers
    generateBracket(tournamentId);
    addActivity(`Auto-seeded bracket for ${tournament.name} by bowling average`);
    showToast('Bracket seeded by bowling average!', 'success');
}

function displayBracket(bracket) {
    const container = document.getElementById('bracketView');
    
    let html = '<div class="flex space-x-8 overflow-x-auto pb-4">';
    
    bracket.rounds.forEach((round, roundIndex) => {
        html += `
            <div class="flex flex-col justify-around min-w-[250px]">
                <h4 class="text-center font-bold mb-4 text-gray-700">
                    ${roundIndex === bracket.rounds.length - 1 ? 'Finals' : `Round ${roundIndex + 1}`}
                </h4>
        `;
        
        round.forEach((match, matchIndex) => {
            const player1 = bracket.participants.find(p => p.id === match.player1);
            const player2 = bracket.participants.find(p => p.id === match.player2);
            
            html += `
                <div class="match-card bg-white border-2 border-gray-200 rounded-lg p-4 mb-4">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm font-medium text-gray-500">Match ${matchIndex + 1}</span>
                        ${player1 && player2 && !match.winner ? `
                            <button onclick="showScoreModal(${bracket.tournamentId || 'null'}, ${roundIndex}, ${matchIndex})" class="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded">
                                <i class="fas fa-plus-circle mr-1"></i>Score
                            </button>
                        ` : ''}
                    </div>
                    <div class="space-y-2">
                        <div class="flex justify-between items-center p-2 rounded ${match.winner === match.player1 ? 'bg-green-100' : 'bg-gray-50'}">
                            <div class="flex-1">
                                <span class="font-medium">${player1 ? player1.name : 'TBD'}</span>
                                ${player1 && player1.bowlingAverage ? `<span class="text-xs text-gray-500 ml-2">${player1.bowlingAverage} avg</span>` : ''}
                            </div>
                            ${match.score && match.score.player1 !== undefined ? `<span class="font-bold text-lg ml-2">${match.score.player1}</span>` : ''}
                        </div>
                        <div class="flex justify-between items-center p-2 rounded ${match.winner === match.player2 ? 'bg-green-100' : 'bg-gray-50'}">
                            <div class="flex-1">
                                <span class="font-medium">${player2 ? player2.name : 'TBD'}</span>
                                ${player2 && player2.bowlingAverage ? `<span class="text-xs text-gray-500 ml-2">${player2.bowlingAverage} avg</span>` : ''}
                            </div>
                            ${match.score && match.score.player2 !== undefined ? `<span class="font-bold text-lg ml-2">${match.score.player2}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Scheduling Functions
function populateScheduleSelect() {
    const select = document.getElementById('scheduleTournamentSelect');
    select.innerHTML = '<option value="">Select Tournament</option>' + 
        tournaments.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
}

function generateSchedule() {
    const tournamentId = parseInt(document.getElementById('scheduleTournamentSelect').value);
    const startDate = document.getElementById('scheduleStartDate').value;
    const matchDuration = parseInt(document.getElementById('matchDuration').value);
    
    if (!tournamentId || !startDate) {
        showToast('Please select tournament and start date', 'warning');
        return;
    }
    
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament || !tournament.bracket) {
        showToast('Tournament must have a bracket generated first', 'warning');
        return;
    }
    
    const schedule = {
        tournamentId: tournamentId,
        matches: []
    };
    
    let currentTime = new Date(startDate);
    
    tournament.bracket.rounds.forEach((round, roundIndex) => {
        round.forEach((match, matchIndex) => {
            schedule.matches.push({
                matchId: match.id,
                round: roundIndex + 1,
                time: new Date(currentTime),
                duration: matchDuration,
                lane: null
            });
            currentTime = new Date(currentTime.getTime() + matchDuration * 60000);
        });
        // Add break between rounds
        currentTime = new Date(currentTime.getTime() + 30 * 60000);
    });
    
    schedules = schedules.filter(s => s.tournamentId !== tournamentId);
    schedules.push(schedule);
    saveToLocalStorage();
    displaySchedule(schedule);
    addActivity(`Generated schedule for ${tournament.name}`);
}

function displaySchedule(schedule) {
    const container = document.getElementById('scheduleContent');
    
    let html = '<div class="space-y-4">';
    
    schedule.matches.forEach((match, index) => {
        html += `
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                    <div class="font-medium">Round ${match.round} - Match ${index + 1}</div>
                    <div class="text-sm text-gray-500">
                        ${match.time.toLocaleString()} (${match.duration} min)
                    </div>
                </div>
                <div class="text-sm text-gray-600">
                    ${match.lane ? `Lane ${match.lane}` : 'No lane assigned'}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Lane Assignment Functions
function populateLaneSelect() {
    const select = document.getElementById('laneTournamentSelect');
    select.innerHTML = '<option value="">Select Tournament</option>' + 
        tournaments.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
}

function autoAssignLanes() {
    const tournamentId = parseInt(document.getElementById('laneTournamentSelect').value);
    const totalLanes = parseInt(document.getElementById('totalLanes').value);
    const method = document.getElementById('laneAssignmentMethod').value;
    
    if (!tournamentId) {
        showToast('Please select a tournament', 'warning');
        return;
    }
    
    const schedule = schedules.find(s => s.tournamentId === tournamentId);
    if (!schedule) {
        showToast('Please generate a schedule first', 'warning');
        return;
    }
    
    // Assign lanes based on method
    schedule.matches.forEach((match, index) => {
        switch(method) {
            case 'random':
                match.lane = Math.floor(Math.random() * totalLanes) + 1;
                break;
            case 'sequential':
                match.lane = (index % totalLanes) + 1;
                break;
            case 'balanced':
                match.lane = (index % totalLanes) + 1;
                break;
        }
    });
    
    saveToLocalStorage();
    displayLaneAssignments(schedule, totalLanes);
    
    const tournament = tournaments.find(t => t.id === tournamentId);
    addActivity(`Assigned lanes for ${tournament.name}`);
}

function displayLaneAssignments(schedule, totalLanes) {
    const container = document.getElementById('laneContent');
    
    let html = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
    
    for (let lane = 1; lane <= totalLanes; lane++) {
        const laneMatches = schedule.matches.filter(m => m.lane === lane);
        
        html += `
            <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-bold text-lg mb-3">Lane ${lane}</h4>
                <div class="space-y-2">
                    ${laneMatches.length > 0 ? laneMatches.map(match => `
                        <div class="bg-white p-2 rounded text-sm">
                            Round ${match.round} - ${match.time.toLocaleTimeString()}
                        </div>
                    `).join('') : '<p class="text-gray-500 text-sm">No matches assigned</p>'}
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

// Prize Pool Functions
function populatePrizeTournamentSelect() {
    const select = document.getElementById('prizeTournamentSelect');
    select.innerHTML = '<option value="">Select Tournament</option>' + 
        tournaments.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
}

function updatePrizeDistribution() {
    const type = document.getElementById('prizeDistributionType').value;
    const total = parseFloat(document.getElementById('totalPrizePool').value) || 0;
    const container = document.getElementById('prizeBreakdown');
    
    let distribution = [];
    
    switch(type) {
        case 'standard':
            distribution = [
                { place: '1st', percentage: 50, amount: total * 0.5 },
                { place: '2nd', percentage: 30, amount: total * 0.3 },
                { place: '3rd', percentage: 20, amount: total * 0.2 }
            ];
            break;
        case 'top-heavy':
            distribution = [
                { place: '1st', percentage: 70, amount: total * 0.7 },
                { place: '2nd', percentage: 20, amount: total * 0.2 },
                { place: '3rd', percentage: 10, amount: total * 0.1 }
            ];
            break;
        case 'balanced':
            distribution = [
                { place: '1st', percentage: 40, amount: total * 0.4 },
                { place: '2nd', percentage: 30, amount: total * 0.3 },
                { place: '3rd', percentage: 20, amount: total * 0.2 },
                { place: '4th', percentage: 10, amount: total * 0.1 }
            ];
            break;
        case 'custom':
            container.innerHTML = '<p class="text-sm text-gray-600">Custom distribution - Enter amounts manually</p>';
            return;
    }
    
    let html = '<div class="space-y-2">';
    distribution.forEach(item => {
        html += `
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span class="font-medium">${item.place} Place</span>
                <span class="text-gray-600">${item.percentage}% - $${item.amount.toFixed(2)}</span>
            </div>
        `;
    });
    html += '</div>';
    
    container.innerHTML = html;
}

function addPrizePool(event) {
    event.preventDefault();
    
    const tournamentId = parseInt(document.getElementById('prizeTournamentSelect').value);
    const total = parseFloat(document.getElementById('totalPrizePool').value);
    const type = document.getElementById('prizeDistributionType').value;
    
    const prizePool = {
        id: Date.now(),
        tournamentId: tournamentId,
        total: total,
        distributionType: type,
        distribution: calculateDistribution(total, type)
    };
    
    prizePools = prizePools.filter(p => p.tournamentId !== tournamentId);
    prizePools.push(prizePool);
    saveToLocalStorage();
    loadPrizePools();
    closeModal('prizeModal');
    
    const tournament = tournaments.find(t => t.id === tournamentId);
    addActivity(`Added prize pool for ${tournament.name}`);
}

function calculateDistribution(total, type) {
    switch(type) {
        case 'standard':
            return [
                { place: 1, amount: total * 0.5 },
                { place: 2, amount: total * 0.3 },
                { place: 3, amount: total * 0.2 }
            ];
        case 'top-heavy':
            return [
                { place: 1, amount: total * 0.7 },
                { place: 2, amount: total * 0.2 },
                { place: 3, amount: total * 0.1 }
            ];
        case 'balanced':
            return [
                { place: 1, amount: total * 0.4 },
                { place: 2, amount: total * 0.3 },
                { place: 3, amount: total * 0.2 },
                { place: 4, amount: total * 0.1 }
            ];
        default:
            return [];
    }
}

function loadPrizePools() {
    const container = document.getElementById('prizesList');
    
    if (prizePools.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No prize pools configured yet</p>';
        return;
    }
    
    container.innerHTML = prizePools.map(pool => {
        const tournament = tournaments.find(t => t.id === pool.tournamentId);
        return `
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-xl font-bold mb-4">${tournament ? tournament.name : 'Unknown Tournament'}</h3>
                <div class="mb-4">
                    <p class="text-2xl font-bold text-green-600">$${pool.total.toFixed(2)}</p>
                    <p class="text-sm text-gray-500">${pool.distributionType} distribution</p>
                </div>
                <div class="space-y-2">
                    ${pool.distribution.map(item => `
                        <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span class="font-medium">${getPlaceSuffix(item.place)} Place</span>
                            <span class="text-green-600 font-semibold">$${item.amount.toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                <button onclick="deletePrizePool(${pool.id})" class="mt-4 w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Delete Prize Pool
                </button>
            </div>
        `;
    }).join('');
}

function deletePrizePool(id) {
    if (confirm('Are you sure you want to delete this prize pool?')) {
        prizePools = prizePools.filter(p => p.id !== id);
        saveToLocalStorage();
        loadPrizePools();
        addActivity(`Deleted a prize pool`);
    }
}

// Sponsor Functions
function populateSponsorTournamentSelect() {
    const select = document.getElementById('sponsorTournamentSelect');
    select.innerHTML = '<option value="">All Tournaments</option>' + 
        tournaments.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
}

function addSponsor(event) {
    event.preventDefault();
    
    const sponsor = {
        id: Date.now(),
        company: document.getElementById('sponsorCompany').value,
        contact: document.getElementById('sponsorContact').value,
        email: document.getElementById('sponsorEmail').value,
        amount: parseFloat(document.getElementById('sponsorAmount').value),
        startDate: document.getElementById('sponsorStartDate').value,
        endDate: document.getElementById('sponsorEndDate').value,
        tournamentId: document.getElementById('sponsorTournamentSelect').value || null,
        benefits: document.getElementById('sponsorBenefits').value
    };
    
    sponsors.push(sponsor);
    saveToLocalStorage();
    updateDashboard();
    loadSponsors();
    closeModal('sponsorModal');
    document.getElementById('sponsorForm').reset();
    
    addActivity(`Added sponsor: ${sponsor.company}`);
}

function loadSponsors() {
    const container = document.getElementById('sponsorsList');
    
    if (sponsors.length === 0) {
        container.innerHTML = '<p class="text-gray-500 col-span-full text-center py-8">No sponsors added yet</p>';
        return;
    }
    
    container.innerHTML = sponsors.map(sponsor => {
        const tournament = sponsor.tournamentId ? tournaments.find(t => t.id === parseInt(sponsor.tournamentId)) : null;
        const isActive = new Date(sponsor.endDate) >= new Date();
        
        return `
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-xl font-bold text-gray-900">${sponsor.company}</h3>
                    <span class="px-3 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                        ${isActive ? 'Active' : 'Expired'}
                    </span>
                </div>
                <div class="space-y-2 text-sm mb-4">
                    <div class="flex items-center text-gray-600">
                        <i class="fas fa-user mr-2"></i>
                        <span>${sponsor.contact}</span>
                    </div>
                    <div class="flex items-center text-gray-600">
                        <i class="fas fa-envelope mr-2"></i>
                        <span>${sponsor.email}</span>
                    </div>
                    <div class="flex items-center text-gray-600">
                        <i class="fas fa-dollar-sign mr-2"></i>
                        <span class="font-semibold text-green-600">$${sponsor.amount.toFixed(2)}</span>
                    </div>
                    <div class="flex items-center text-gray-600">
                        <i class="fas fa-calendar mr-2"></i>
                        <span>${new Date(sponsor.startDate).toLocaleDateString()} - ${new Date(sponsor.endDate).toLocaleDateString()}</span>
                    </div>
                    ${tournament ? `
                        <div class="flex items-center text-gray-600">
                            <i class="fas fa-trophy mr-2"></i>
                            <span>${tournament.name}</span>
                        </div>
                    ` : ''}
                </div>
                ${sponsor.benefits ? `
                    <div class="p-3 bg-gray-50 rounded text-sm text-gray-600 mb-4">
                        ${sponsor.benefits}
                    </div>
                ` : ''}
                <button onclick="deleteSponsor(${sponsor.id})" class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Delete Sponsor
                </button>
            </div>
        `;
    }).join('');
}

function deleteSponsor(id) {
    if (confirm('Are you sure you want to delete this sponsor?')) {
        sponsors = sponsors.filter(s => s.id !== id);
        saveToLocalStorage();
        updateDashboard();
        loadSponsors();
        addActivity(`Removed a sponsor`);
    }
}

// Dashboard Functions
function updateDashboard() {
    document.getElementById('activeTournaments').textContent = tournaments.filter(t => t.status === 'upcoming' || t.status === 'ongoing').length;
    document.getElementById('totalParticipants').textContent = participants.length;
    
    let totalMatches = 0;
    schedules.forEach(schedule => {
        totalMatches += schedule.matches.length;
    });
    document.getElementById('scheduledMatches').textContent = totalMatches;
    
    const activeSponsors = sponsors.filter(s => new Date(s.endDate) >= new Date()).length;
    document.getElementById('activeSponsors').textContent = activeSponsors;
}

function addActivity(message) {
    const container = document.getElementById('recentActivity');
    const time = new Date().toLocaleTimeString();
    
    const activityHTML = `
        <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <i class="fas fa-circle text-blue-500 text-xs mt-1"></i>
            <div class="flex-1">
                <p class="text-sm text-gray-900">${message}</p>
                <p class="text-xs text-gray-500">${time}</p>
            </div>
        </div>
    `;
    
    if (container.querySelector('.text-center')) {
        container.innerHTML = activityHTML;
    } else {
        container.insertAdjacentHTML('afterbegin', activityHTML);
    }
    
    // Keep only last 10 activities
    const activities = container.querySelectorAll('.flex.items-start');
    if (activities.length > 10) {
        activities[activities.length - 1].remove();
    }
}

// Utility Functions
function populateSelects() {
    // Populate all tournament selects
    const selects = [
        'bracketTournamentSelect',
        'scheduleTournamentSelect',
        'laneTournamentSelect'
    ];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">Select Tournament</option>' + 
                tournaments.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
        }
    });
}

function getStatusColor(status) {
    switch(status) {
        case 'upcoming': return 'bg-blue-100 text-blue-800';
        case 'ongoing': return 'bg-green-100 text-green-800';
        case 'completed': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

function getSkillLevelColor(level) {
    switch(level) {
        case 'beginner': return 'bg-green-100 text-green-800';
        case 'intermediate': return 'bg-blue-100 text-blue-800';
        case 'advanced': return 'bg-purple-100 text-purple-800';
        case 'professional': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

function formatTournamentType(type) {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function getPlaceSuffix(place) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = place % 100;
    return place + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

// Bowler Registration Functions
function showBowlerRegistrationModal(tournamentId) {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return;
    
    document.getElementById('regTournamentId').value = tournamentId;
    document.getElementById('regTournamentName').value = tournament.name;
    document.getElementById('regBowlerName').value = currentUser.name;
    document.getElementById('regBowlerEmail').value = currentUser.email;
    
    document.getElementById('bowlerRegistrationModal').classList.remove('hidden');
    document.getElementById('bowlerRegistrationModal').classList.add('flex');
}

function submitBowlerRegistration(event) {
    event.preventDefault();
    
    const tournamentId = parseInt(document.getElementById('regTournamentId').value);
    const tournament = tournaments.find(t => t.id === tournamentId);
    
    if (!tournament) {
        alert('Tournament not found!');
        return;
    }
    
    // Check deadline
    if (new Date(tournament.registrationDeadline) < new Date()) {
        alert('Registration deadline has passed!');
        return;
    }
    
    // Check if already registered
    if (isUserRegistered(tournamentId)) {
        alert('You are already registered for this tournament!');
        return;
    }
    
    // Check if full
    if ((tournament.registrations || []).length >= tournament.maxParticipants) {
        alert('Tournament is full!');
        return;
    }
    
    const registration = {
        id: Date.now(),
        tournamentId: tournamentId,
        userId: currentUser.id,
        name: document.getElementById('regBowlerName').value,
        email: document.getElementById('regBowlerEmail').value,
        discordName: document.getElementById('regDiscordName').value,
        robloxName: document.getElementById('regRobloxName').value,
        bowlingAverage: parseInt(document.getElementById('regBowlingAverage').value) || 0,
        skillLevel: document.getElementById('regSkillLevel').value,
        registeredAt: new Date().toISOString(),
        status: 'confirmed'
    };
    
    // Add to tournament registrations
    if (!tournament.registrations) {
        tournament.registrations = [];
    }
    tournament.registrations.push(registration);
    
    // Add to global registrations
    tournamentRegistrations.push(registration);
    
    saveToLocalStorage();
    loadTournaments();
    closeModal('bowlerRegistrationModal');
    document.getElementById('bowlerRegistrationForm').reset();
    
    // Send email notification (simulated)
    sendRegistrationEmail(registration, tournament);
    
    showToast(`Successfully registered for ${tournament.name}!`, 'success');
    showToast(`Confirmation email sent to ${registration.email}`, 'info');
    addActivity(`Registered for tournament: ${tournament.name}`);
}

// Update Management System
function checkForUpdates() {
    const savedVersion = localStorage.getItem(VERSION_KEY);
    const updateDismissed = localStorage.getItem(UPDATE_DISMISSED_KEY);
    
    // First time user or new version available
    if (!savedVersion) {
        // First time - just save version
        localStorage.setItem(VERSION_KEY, APP_VERSION);
        return;
    }
    
    // Check if there's a new version
    if (savedVersion !== APP_VERSION) {
        // Check if user dismissed this update already
        if (updateDismissed === APP_VERSION) {
            return; // User chose "Remind Me Later"
        }
        
        // Show update modal
        showUpdateModal(savedVersion, APP_VERSION);
    }
}

function showUpdateModal(oldVersion, newVersion) {
    document.getElementById('currentVersion').textContent = oldVersion;
    document.getElementById('newVersion').textContent = newVersion;
    
    // Customize update features based on version
    const features = getUpdateFeatures(oldVersion, newVersion);
    const featuresList = document.getElementById('updateFeaturesList');
    featuresList.innerHTML = features.map(f => `<li>• ${f}</li>`).join('');
    
    // Show modal
    document.getElementById('updateModal').classList.remove('hidden');
    document.getElementById('updateModal').classList.add('flex');
}

function getUpdateFeatures(oldVersion, newVersion) {
    // You can customize this based on what changed
    const changeLog = {
        '1.2.0': [
            'Added manual bowler selection for tournaments',
            'Implemented base 160 average for new bowlers',
            'Beautiful profile modals for bowlers and tournaments',
            'Toast notification system',
            'Auto-update notification system'
        ],
        '1.1.0': [
            'Enhanced tournament management',
            'Improved bowler database with search',
            'Score entry and bracket progression',
            'Tournament editing capabilities'
        ],
        '1.0.0': [
            'Initial release',
            'Basic tournament management',
            'Bowler registration system'
        ]
    };
    
    return changeLog[newVersion] || [
        'New features and improvements',
        'Bug fixes and performance enhancements',
        'Enhanced user experience'
    ];
}

function applyUpdate() {
    // Save current section to restore after update
    const currentSection = document.querySelector('.section:not(.hidden)')?.id || 'dashboard';
    localStorage.setItem('lastActiveSection', currentSection);
    
    // Update version
    localStorage.setItem(VERSION_KEY, APP_VERSION);
    localStorage.removeItem(UPDATE_DISMISSED_KEY);
    
    // Close modal
    document.getElementById('updateModal').classList.add('hidden');
    document.getElementById('updateModal').classList.remove('flex');
    
    // Show success message
    showToast('✨ Update applied successfully!', 'success');
    showToast('All your data has been preserved', 'info');
    
    // Restore user's section
    setTimeout(() => {
        const lastSection = localStorage.getItem('lastActiveSection');
        if (lastSection && lastSection !== 'dashboard') {
            showSection(lastSection);
        }
    }, 500);
    
    // Add activity
    addActivity(`Updated to version ${APP_VERSION}`);
}

function dismissUpdate() {
    // Mark this version as dismissed
    localStorage.setItem(UPDATE_DISMISSED_KEY, APP_VERSION);
    
    // Close modal
    document.getElementById('updateModal').classList.add('hidden');
    document.getElementById('updateModal').classList.remove('flex');
    
    showToast('Update reminder dismissed', 'info');
}

// Save current section when navigating
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('bg-blue-100', 'text-blue-700');
        item.classList.add('text-gray-700');
    });
    
    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.remove('hidden');
        
        // Save current section
        localStorage.setItem('lastActiveSection', sectionId);
    }
    
    // Add active class to clicked nav item
    event?.target?.closest('.nav-item')?.classList.add('bg-blue-100', 'text-blue-700');
    event?.target?.closest('.nav-item')?.classList.remove('text-gray-700');
    
    // Load section-specific data
    switch(sectionId) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'tournaments':
            loadTournaments();
            hideCreateButtonForBowlers('tournaments');
            break;
        case 'brackets':
            loadBracket();
            break;
        case 'schedules':
            loadSchedules();
            hideCreateButtonForBowlers('schedules');
            break;
        case 'lanes':
            loadLaneAssignments();
            hideCreateButtonForBowlers('lanes');
            break;
        case 'prizes':
            loadPrizePools();
            hideCreateButtonForBowlers('prizes');
            break;
        case 'sponsors':
            loadSponsors();
            hideCreateButtonForBowlers('sponsors');
            break;
        case 'myRegistrations':
            loadMyRegistrations();
            break;
        case 'bowlerDatabase':
            loadBowlerDatabase();
            break;
    }
}

function isUserRegistered(tournamentId) {
    return tournamentRegistrations.some(reg => 
        reg.tournamentId === tournamentId && reg.userId === currentUser.id
    );
}

function sendRegistrationEmail(registration, tournament) {
    // Simulated email notification
    const emailContent = {
        to: registration.email,
        subject: `Tournament Registration Confirmation - ${tournament.name}`,
        body: `
            Dear ${registration.name},
            
            You have successfully registered for ${tournament.name}!
            
            Tournament Details:
            - Name: ${tournament.name}
            - Format: ${formatTournamentType(tournament.format)}
            - Start Date: ${new Date(tournament.startDate).toLocaleDateString()}
            - Registration Deadline: ${new Date(tournament.registrationDeadline).toLocaleString()}
            
            Your Registration Details:
            - Discord: ${registration.discordName}
            - Roblox: ${registration.robloxName}
            - Bowling Average: ${registration.bowlingAverage || 'Not provided'}
            - Skill Level: ${registration.skillLevel}
            - Registered: ${new Date(registration.registeredAt).toLocaleString()}
            
            Good luck in the tournament!
            
            Best regards,
            Tournament Director Team
        `
    };
    
    console.log('Email sent:', emailContent);
    // In production, this would call an actual email API
}

function loadMyRegistrations() {
    const container = document.getElementById('myRegistrationsList');
    const myRegs = tournamentRegistrations.filter(reg => reg.userId === currentUser.id);
    
    if (myRegs.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">You haven\'t registered for any tournaments yet</p>';
        return;
    }
    
    container.innerHTML = myRegs.map(reg => {
        const tournament = tournaments.find(t => t.id === reg.tournamentId);
        if (!tournament) return '';
        
        return `
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-xl font-bold text-gray-900">${tournament.name}</h3>
                        <p class="text-sm text-gray-500">Registered: ${new Date(reg.registeredAt).toLocaleDateString()}</p>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ${reg.status}
                    </span>
                </div>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p class="text-gray-500">Discord</p>
                        <p class="font-medium text-gray-900">${reg.discordName}</p>
                    </div>
                    <div>
                        <p class="text-gray-500">Roblox</p>
                        <p class="font-medium text-gray-900">${reg.robloxName}</p>
                    </div>
                    <div>
                        <p class="text-gray-500">Bowling Average</p>
                        <p class="font-medium text-gray-900">${reg.bowlingAverage || 'N/A'}</p>
                    </div>
                    <div>
                        <p class="text-gray-500">Skill Level</p>
                        <p class="font-medium text-gray-900">${reg.skillLevel}</p>
                    </div>
                    <div>
                        <p class="text-gray-500">Tournament Date</p>
                        <p class="font-medium text-gray-900">${new Date(tournament.startDate).toLocaleDateString()}</p>
                    </div>
                </div>
                <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p class="text-sm text-blue-800">
                        <i class="fas fa-info-circle mr-2"></i>
                        Confirmation email sent to ${reg.email}
                    </p>
                </div>
            </div>
        `;
    }).join('');
}

// Score Entry Functions
function showScoreModal(tournamentId, roundIndex, matchIndex) {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament || !tournament.bracket) return;
    
    const match = tournament.bracket.rounds[roundIndex][matchIndex];
    const player1 = tournament.bracket.participants.find(p => p.id === match.player1);
    const player2 = tournament.bracket.participants.find(p => p.id === match.player2);
    
    if (!player1 || !player2) {
        showToast('Both players must be assigned to enter scores', 'warning');
        return;
    }
    
    // Set hidden fields
    document.getElementById('scoreMatchId').value = match.id;
    document.getElementById('scoreTournamentId').value = tournamentId;
    document.getElementById('scoreRoundIndex').value = roundIndex;
    document.getElementById('scoreMatchIndex').value = matchIndex;
    
    // Set player names
    document.getElementById('scorePlayer1Name').textContent = player1.name;
    document.getElementById('scorePlayer2Name').textContent = player2.name;
    
    // Set match details
    document.getElementById('scoreMatchDetails').innerHTML = `
        <p><strong>Round ${roundIndex + 1}</strong> - Match ${matchIndex + 1}</p>
        <p class="mt-1">${player1.name} vs ${player2.name}</p>
    `;
    
    // Clear previous scores
    document.getElementById('scorePlayer1').value = '';
    document.getElementById('scorePlayer2').value = '';
    
    // Show modal
    document.getElementById('scoreModal').classList.remove('hidden');
    document.getElementById('scoreModal').classList.add('flex');
}

function submitMatchScore(event) {
    event.preventDefault();
    
    const tournamentId = parseInt(document.getElementById('scoreTournamentId').value);
    const roundIndex = parseInt(document.getElementById('scoreRoundIndex').value);
    const matchIndex = parseInt(document.getElementById('scoreMatchIndex').value);
    const score1 = parseInt(document.getElementById('scorePlayer1').value);
    const score2 = parseInt(document.getElementById('scorePlayer2').value);
    
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament || !tournament.bracket) return;
    
    const match = tournament.bracket.rounds[roundIndex][matchIndex];
    
    // Set scores
    match.score = {
        player1: score1,
        player2: score2
    };
    
    // Determine winner
    if (score1 > score2) {
        match.winner = match.player1;
    } else if (score2 > score1) {
        match.winner = match.player2;
    } else {
        showToast('Scores cannot be tied! Please enter different scores.', 'warning');
        return;
    }
    
    // Advance winner to next round if applicable
    const nextRoundIndex = roundIndex + 1;
    if (nextRoundIndex < tournament.bracket.rounds.length) {
        const nextMatchIndex = Math.floor(matchIndex / 2);
        const nextMatch = tournament.bracket.rounds[nextRoundIndex][nextMatchIndex];
        
        if (matchIndex % 2 === 0) {
            nextMatch.player1 = match.winner;
        } else {
            nextMatch.player2 = match.winner;
        }
    }
    
    saveToLocalStorage();
    loadBracket();
    closeModal('scoreModal');
    
    const player1 = tournament.bracket.participants.find(p => p.id === match.player1);
    const player2 = tournament.bracket.participants.find(p => p.id === match.player2);
    const winner = tournament.bracket.participants.find(p => p.id === match.winner);
    
    addActivity(`Match completed: ${winner.name} defeated ${winner.id === player1.id ? player2.name : player1.name} (${score1}-${score2})`);
    showToast(`${winner.name} wins ${score1}-${score2}!`, 'success');
    showToast('Winner advances to next round', 'info');
}

// Bowler Database Functions
function loadBowlerDatabase() {
    updateBowlerDatabaseStats();
    filterBowlerDatabase();
}

function updateBowlerDatabaseStats() {
    const totalBowlers = bowlerDatabase.length;
    const activeBowlers = bowlerDatabase.filter(b => b.status === 'active').length;
    const highAverages = bowlerDatabase.filter(b => b.bowlingAverage >= 200).length;
    
    const averages = bowlerDatabase.filter(b => b.bowlingAverage > 0).map(b => b.bowlingAverage);
    const avgBowlingAverage = averages.length > 0 ? Math.round(averages.reduce((a, b) => a + b, 0) / averages.length) : 0;
    
    document.getElementById('totalBowlersCount').textContent = totalBowlers;
    document.getElementById('activeBowlersCount').textContent = activeBowlers;
    document.getElementById('professionalCount').textContent = highAverages;
    document.getElementById('avgBowlingAverage').textContent = avgBowlingAverage;
}

function filterBowlerDatabase() {
    const searchTerm = document.getElementById('bowlerDatabaseSearch').value.toLowerCase();
    const skillFilter = document.getElementById('bowlerDatabaseSkillFilter').value;
    const statusFilter = document.getElementById('bowlerDatabaseStatusFilter').value;
    
    let filtered = bowlerDatabase.filter(bowler => {
        const matchesSearch = !searchTerm || 
            bowler.name.toLowerCase().includes(searchTerm) ||
            bowler.email.toLowerCase().includes(searchTerm) ||
            (bowler.discordName && bowler.discordName.toLowerCase().includes(searchTerm)) ||
            (bowler.robloxName && bowler.robloxName.toLowerCase().includes(searchTerm));
        
        const matchesStatus = !statusFilter || bowler.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });
    
    displayBowlerDatabase(filtered);
}

function displayBowlerDatabase(bowlers) {
    const tbody = document.getElementById('bowlerDatabaseTableBody');
    
    if (bowlers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="px-6 py-4 text-center text-gray-500">No bowlers found</td></tr>';
        return;
    }
    
    tbody.innerHTML = bowlers.map(bowler => {
        const tournamentCount = tournamentRegistrations.filter(r => r.email === bowler.email).length;
        
        return `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${bowler.name}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">${bowler.email}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">${bowler.discordName || 'N/A'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">${bowler.robloxName || 'N/A'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-semibold text-gray-900">${bowler.bowlingAverage || 'N/A'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bowler.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                        ${bowler.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${tournamentCount}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button onclick="viewBowlerDetails(${bowler.id})" class="text-blue-600 hover:text-blue-900">View</button>
                    <button onclick="showEditBowlerModal(${bowler.id})" class="text-yellow-600 hover:text-yellow-900">Edit</button>
                    <button onclick="deleteBowlerFromDatabase(${bowler.id})" class="text-red-600 hover:text-red-900">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

function showAddBowlerModal() {
    document.getElementById('addBowlerModal').classList.remove('hidden');
    document.getElementById('addBowlerModal').classList.add('flex');
}

function addBowlerToDatabase(event) {
    event.preventDefault();
    
    const bowler = {
        id: Date.now(),
        name: document.getElementById('dbBowlerName').value,
        email: document.getElementById('dbBowlerEmail').value,
        discordName: document.getElementById('dbBowlerDiscord').value || null,
        robloxName: document.getElementById('dbBowlerRoblox').value || null,
        bowlingAverage: parseInt(document.getElementById('dbBowlerAverage').value) || 0,
        status: document.getElementById('dbBowlerStatus').value,
        notes: document.getElementById('dbBowlerNotes').value || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    bowlerDatabase.push(bowler);
    saveToLocalStorage();
    loadBowlerDatabase();
    closeModal('addBowlerModal');
    document.getElementById('addBowlerForm').reset();
    
    addActivity(`Added ${bowler.name} to bowler database`);
    showToast(`${bowler.name} added to database!`, 'success');
}

function showEditBowlerModal(id) {
    const bowler = bowlerDatabase.find(b => b.id === id);
    if (!bowler) return;
    
    document.getElementById('editDbBowlerId').value = bowler.id;
    document.getElementById('editDbBowlerName').value = bowler.name;
    document.getElementById('editDbBowlerEmail').value = bowler.email;
    document.getElementById('editDbBowlerDiscord').value = bowler.discordName || '';
    document.getElementById('editDbBowlerRoblox').value = bowler.robloxName || '';
    document.getElementById('editDbBowlerAverage').value = bowler.bowlingAverage || '';
    document.getElementById('editDbBowlerStatus').value = bowler.status;
    document.getElementById('editDbBowlerNotes').value = bowler.notes || '';
    
    document.getElementById('editBowlerModal').classList.remove('hidden');
    document.getElementById('editBowlerModal').classList.add('flex');
}

function updateBowlerInDatabase(event) {
    event.preventDefault();
    
    const id = parseInt(document.getElementById('editDbBowlerId').value);
    const bowler = bowlerDatabase.find(b => b.id === id);
    
    if (!bowler) {
        showToast('Bowler not found!', 'error');
        return;
    }
    
    bowler.name = document.getElementById('editDbBowlerName').value;
    bowler.email = document.getElementById('editDbBowlerEmail').value;
    bowler.discordName = document.getElementById('editDbBowlerDiscord').value || null;
    bowler.robloxName = document.getElementById('editDbBowlerRoblox').value || null;
    bowler.bowlingAverage = parseInt(document.getElementById('editDbBowlerAverage').value) || 0;
    bowler.status = document.getElementById('editDbBowlerStatus').value;
    bowler.notes = document.getElementById('editDbBowlerNotes').value || null;
    bowler.updatedAt = new Date().toISOString();
    
    saveToLocalStorage();
    loadBowlerDatabase();
    closeModal('editBowlerModal');
    
    addActivity(`Updated ${bowler.name} in bowler database`);
    showToast(`${bowler.name}'s profile updated!`, 'success');
}

let currentViewingBowlerId = null;

function viewBowlerDetails(id) {
    const bowler = bowlerDatabase.find(b => b.id === id);
    if (!bowler) return;
    
    currentViewingBowlerId = id;
    const tournamentCount = tournamentRegistrations.filter(r => r.email === bowler.email).length;
    
    // Populate header
    document.getElementById('viewBowlerName').textContent = bowler.name;
    document.getElementById('viewBowlerEmail').textContent = bowler.email;
    document.getElementById('viewBowlerStatus').textContent = bowler.status.charAt(0).toUpperCase() + bowler.status.slice(1);
    document.getElementById('viewBowlerStatus').className = `inline-block px-4 py-2 rounded-full font-semibold text-sm ${
        bowler.status === 'active' ? 'bg-white text-green-600' : 'bg-white text-gray-600'
    }`;
    
    // Populate stats
    document.getElementById('viewBowlerAverage').textContent = bowler.bowlingAverage || 'N/A';
    document.getElementById('viewBowlerTournaments').textContent = tournamentCount;
    
    const createdDate = new Date(bowler.createdAt);
    document.getElementById('viewBowlerCreated').textContent = createdDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    // Populate gaming profiles
    document.getElementById('viewBowlerDiscord').textContent = bowler.discordName || 'Not provided';
    document.getElementById('viewBowlerRoblox').textContent = bowler.robloxName || 'Not provided';
    
    // Populate notes
    document.getElementById('viewBowlerNotes').textContent = bowler.notes || 'No notes available';
    
    // Populate timeline
    document.getElementById('viewBowlerCreatedFull').textContent = new Date(bowler.createdAt).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    document.getElementById('viewBowlerUpdated').textContent = new Date(bowler.updatedAt).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    
    // Show modal
    document.getElementById('viewBowlerModal').classList.remove('hidden');
    document.getElementById('viewBowlerModal').classList.add('flex');
}

function editBowlerFromView() {
    if (currentViewingBowlerId) {
        closeModal('viewBowlerModal');
        showEditBowlerModal(currentViewingBowlerId);
    }
}

function deleteBowlerFromDatabase(id) {
    const bowler = bowlerDatabase.find(b => b.id === id);
    if (!bowler) return;
    
    if (confirm(`⚠️ Delete Bowler?\n\nAre you sure you want to delete ${bowler.name} from the database?\n\nThis action cannot be undone.`)) {
        bowlerDatabase = bowlerDatabase.filter(b => b.id !== id);
        saveToLocalStorage();
        loadBowlerDatabase();
        addActivity(`Deleted ${bowler.name} from bowler database`);
    }
}

function exportBowlerDatabase() {
    if (bowlerDatabase.length === 0) {
        showToast('No bowlers in database to export!', 'warning');
        return;
    }
    
    // Create CSV content
    const headers = ['Name', 'Email', 'Discord', 'Roblox', 'Bowling Average', 'Status', 'Notes', 'Created', 'Updated'];
    const rows = bowlerDatabase.map(b => [
        b.name,
        b.email,
        b.discordName || '',
        b.robloxName || '',
        b.bowlingAverage || '',
        b.status,
        b.notes || '',
        new Date(b.createdAt).toLocaleString(),
        new Date(b.updatedAt).toLocaleString()
    ]);
    
    let csvContent = headers.join(',') + '\\n';
    rows.forEach(row => {
        csvContent += row.map(field => `"${field}"`).join(',') + '\\n';
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bowler_database_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addActivity('Exported bowler database to CSV');
    showToast('Bowler database exported successfully!', 'success');
}

// Auto-add bowlers to database when they register
function submitBowlerRegistration(event) {
    event.preventDefault();
    
    const tournamentId = parseInt(document.getElementById('regTournamentId').value);
    const tournament = tournaments.find(t => t.id === tournamentId);
    
    if (!tournament) {
        alert('Tournament not found!');
        return;
    }
    
    // Check deadline
    if (new Date(tournament.registrationDeadline) < new Date()) {
        alert('Registration deadline has passed!');
        return;
    }
    
    // Check if already registered
    if (isUserRegistered(tournamentId)) {
        alert('You are already registered for this tournament!');
        return;
    }
    
    // Check if full
    if ((tournament.registrations || []).length >= tournament.maxParticipants) {
        alert('Tournament is full!');
        return;
    }
    
    // Get bowling average or use default 160 for new bowlers
    let bowlingAverage = parseInt(document.getElementById('regBowlingAverage').value);
    if (!bowlingAverage || bowlingAverage === 0) {
        bowlingAverage = 160; // Default base average for new bowlers
    }
    
    const registration = {
        id: Date.now(),
        tournamentId: tournamentId,
        userId: currentUser.id,
        name: document.getElementById('regBowlerName').value,
        email: document.getElementById('regBowlerEmail').value,
        discordName: document.getElementById('regDiscordName').value,
        robloxName: document.getElementById('regRobloxName').value,
        bowlingAverage: bowlingAverage,
        skillLevel: document.getElementById('regSkillLevel').value,
        registeredAt: new Date().toISOString(),
        status: 'confirmed'
    };
    
    // Add to tournament registrations
    if (!tournament.registrations) {
        tournament.registrations = [];
    }
    tournament.registrations.push(registration);
    
    // Add to global registrations
    tournamentRegistrations.push(registration);
    
    // Auto-add to bowler database if not exists
    const existingBowler = bowlerDatabase.find(b => b.email === registration.email);
    if (!existingBowler) {
        const newBowler = {
            id: Date.now() + 1,
            name: registration.name,
            email: registration.email,
            discordName: registration.discordName,
            robloxName: registration.robloxName,
            bowlingAverage: bowlingAverage,
            status: 'active',
            notes: `Auto-added from tournament registration: ${tournament.name}. Starting average: ${bowlingAverage}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        bowlerDatabase.push(newBowler);
    } else {
        // Update existing bowler's average if they didn't have one
        if (!existingBowler.bowlingAverage || existingBowler.bowlingAverage === 0) {
            existingBowler.bowlingAverage = bowlingAverage;
            existingBowler.updatedAt = new Date().toISOString();
        }
    }
    
    saveToLocalStorage();
    loadTournaments();
    closeModal('bowlerRegistrationModal');
    document.getElementById('bowlerRegistrationForm').reset();
    
    // Send email notification (simulated)
    sendRegistrationEmail(registration, tournament);
    
    alert(`Successfully registered for ${tournament.name}!\\n\\nA confirmation email has been sent to ${registration.email}`);
    addActivity(`Registered for tournament: ${tournament.name}`);
}
