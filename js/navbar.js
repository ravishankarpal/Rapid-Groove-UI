const user = localStorage.getItem('userName');
const email = localStorage.getItem('userEmail');
const token = localStorage.getItem('userJwtToken');
const userGreeting = document.getElementById('userGreeting');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userInfo = document.getElementById('userInfo');
const guestMenu = document.getElementById('guestMenu');
const loggedInMenu = document.getElementById('loggedInMenu');
const accountMenu = document.getElementById('accountMenu');
const accountButton = document.getElementById('accountButton');

// Mobile elements
const mobileUserInfo = document.getElementById('mobileUserInfo');
const mobileUserName = document.getElementById('mobileUserName');
const mobileUserEmail = document.getElementById('mobileUserEmail');
const mobileGuestMenu = document.getElementById('mobileGuestMenu');
const mobileLoggedInMenu = document.getElementById('mobileLoggedInMenu');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

function updateUIForLoggedInUser() {
    // Desktop UI
    // userName.textContent = `Hello, ${user}`;
    userEmail.textContent = email;
    userGreeting.textContent = `Hello, ${user}`;
    userInfo.classList.remove('hidden');
    loggedInMenu.classList.remove('hidden');
    guestMenu.classList.add('hidden');

    // Mobile UI
    mobileUserName.textContent = `Hello, ${user}`;
    mobileUserEmail.textContent = email;
    mobileUserInfo.classList.remove('hidden');
    mobileLoggedInMenu.classList.remove('hidden');
    mobileGuestMenu.classList.add('hidden');
}

function updateUIForGuestUser() {
    // Desktop UI
    userGreeting.textContent = 'Account';
    userInfo.classList.add('hidden');
    loggedInMenu.classList.add('hidden');
    guestMenu.classList.remove('hidden');

    // Mobile UI
    mobileUserInfo.classList.add('hidden');
    mobileLoggedInMenu.classList.add('hidden');
    mobileGuestMenu.classList.remove('hidden');
}

// Check authentication state on load
if (token && user) {
    updateUIForLoggedInUser();
} else {
    updateUIForGuestUser();
}

// Account dropdown toggle
accountButton.addEventListener('mouseover', () => {
    accountMenu.classList.remove('hidden');
});

accountMenu.addEventListener('mouseleave', () => {
    accountMenu.classList.add('hidden');
});

// Logout functionality
function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userJwtToken');
    updateUIForGuestUser();
    window.location.href = '/login.html';
}

const logoutButton = document.getElementById('logoutButton');
const mobileLogoutButton = document.getElementById('mobileLogoutButton');
if (logoutButton) logoutButton.addEventListener('click', handleLogout);
if (mobileLogoutButton) mobileLogoutButton.addEventListener('click', handleLogout);

const categoriesDropdown = document.querySelector('.dropdown');
const categoriesMenu = categoriesDropdown ? categoriesDropdown.querySelector('.dropdown-menu') : null;

if (categoriesDropdown && categoriesMenu) {
    categoriesDropdown.addEventListener('mouseover', () => {
        categoriesMenu.classList.remove('hidden');
    });

    categoriesDropdown.addEventListener('mouseleave', () => {
        categoriesMenu.classList.add('hidden');
    });
}


mobileMenuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});





if (logoutButton) {
    logoutButton.addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userJwtToken');
        updateUIForGuestUser();
        window.location.href = '/login.html';
    });
}


