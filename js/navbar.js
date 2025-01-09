// navigation.js



// DOM Elements - Desktop
const userGreeting = document.getElementById('userGreeting');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userInfo = document.getElementById('userInfo');
const guestMenu = document.getElementById('guestMenu');
const loggedInMenu = document.getElementById('loggedInMenu');
const accountMenu = document.getElementById('accountMenu');
const accountButton = document.getElementById('accountButton');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const suggestionsList = document.getElementById('suggestionsList');

// DOM Elements - Mobile
const mobileUserInfo = document.getElementById('mobileUserInfo');
const mobileUserName = document.getElementById('mobileUserName');
const mobileUserEmail = document.getElementById('mobileUserEmail');
const mobileGuestMenu = document.getElementById('mobileGuestMenu');
const mobileLoggedInMenu = document.getElementById('mobileLoggedInMenu');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileSearchInput = document.getElementById('mobileSearchInput');
const mobileSearchButton = document.getElementById('mobileSearchButton');

function updateUIForLoggedInUser(sessionData) {
    // Desktop UI
    if (userGreeting) userGreeting.textContent = `Hello, ${sessionData.name}`;
    if (userEmail) userEmail.textContent = sessionData.email;
    if (userInfo) userInfo.classList.remove('hidden');
    if (loggedInMenu) loggedInMenu.classList.remove('hidden');
    if (guestMenu) guestMenu.classList.add('hidden');

    // Mobile UI
    if (mobileUserName) mobileUserName.textContent = `Hello, ${sessionData.name}`;
    if (mobileUserEmail) mobileUserEmail.textContent = sessionData.email;
    if (mobileUserInfo) mobileUserInfo.classList.remove('hidden');
    if (mobileLoggedInMenu) mobileLoggedInMenu.classList.remove('hidden');
    if (mobileGuestMenu) mobileGuestMenu.classList.add('hidden');
}

function updateUIForGuestUser() {
    // Desktop UI
    if (userGreeting) userGreeting.textContent = 'Account';
    if (userInfo) userInfo.classList.add('hidden');
    if (loggedInMenu) loggedInMenu.classList.add('hidden');
    if (guestMenu) guestMenu.classList.remove('hidden');

    // Mobile UI
    if (mobileUserInfo) mobileUserInfo.classList.add('hidden');
    if (mobileLoggedInMenu) mobileLoggedInMenu.classList.add('hidden');
    if (mobileGuestMenu) mobileGuestMenu.classList.remove('hidden');
}

// Check authentication state on load
function checkAuthState() {
    SessionManager.cleanupSessions();
    const currentSession = SessionManager.getCurrentSession();
    
    if (currentSession) {
        updateUIForLoggedInUser(currentSession);
    } else {
        updateUIForGuestUser();
    }
}

// Initial auth check
checkAuthState();

// Account dropdown toggle
if (accountButton) {
    accountButton.addEventListener('mouseover', () => {
        if (accountMenu) accountMenu.classList.remove('hidden');
    });
}

if (accountMenu) {
    accountMenu.addEventListener('mouseleave', () => {
        accountMenu.classList.add('hidden');
    });
}

// Logout functionality
async function handleLogout(e) {
    e.preventDefault();
    SessionManager.cleanupSessions();
    updateUIForGuestUser();
    window.location.href = '/login.html';
}

const logoutButton = document.getElementById('logoutButton');
const mobileLogoutButton = document.getElementById('mobileLogoutButton');
if (logoutButton) logoutButton.addEventListener('click', handleLogout);
if (mobileLogoutButton) mobileLogoutButton.addEventListener('click', handleLogout);

// Categories dropdown
const categoriesDropdown = document.querySelector('.dropdown');
const categoriesMenu = categoriesDropdown?.querySelector('.dropdown-menu');

if (categoriesDropdown && categoriesMenu) {
    categoriesDropdown.addEventListener('mouseover', () => {
        categoriesMenu.classList.remove('hidden');
    });

    categoriesDropdown.addEventListener('mouseleave', () => {
        categoriesMenu.classList.add('hidden');
    });
}

// Mobile menu toggle
if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Mobile categories submenu
const mobileCategoriesToggle = document.querySelector('#mobile-menu a[href="#"]');
const mobileCategoriesSubmenu = document.querySelector('#mobile-menu div[class*="px-4"]');

if (mobileCategoriesToggle && mobileCategoriesSubmenu) {
    mobileCategoriesSubmenu.classList.add('hidden');

    mobileCategoriesToggle.addEventListener('click', (e) => {
        e.preventDefault();
        mobileCategoriesSubmenu.classList.toggle('hidden');
        mobileCategoriesToggle.classList.toggle('active');
    });

    const categoryItems = mobileCategoriesSubmenu.querySelectorAll('a');
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileCategoriesSubmenu.classList.add('hidden');
            mobileCategoriesToggle.classList.remove('active');
        });
    });
}

// Search functionality
let searchTimeout;

async function fetchSearchSuggestions(query) {
    try {
        const response = await fetch(
            API_URLS.SEARCH_PRODUCTS(query, 0, 5),
            { headers: API_URLS.HEADERS() }
        );
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Search error:', error);
        return [];
    }
}

function displaySuggestions(products) {
    if (!suggestionsList) return;

    if (!products.length) {
        suggestionsList.innerHTML = '<li class="text-gray-500">No products found</li>';
        suggestionsList.classList.remove('hidden');
        return;
    }

    suggestionsList.innerHTML = products
        .map(product => `
            <li class="hover:bg-gray-100 p-2 cursor-pointer" onclick="handleProductSelect('${product.name}')">
                <div class="flex justify-between items-center">
                    <span>${product.name}</span>
                    <span class="text-gray-500">₹${product.price}</span>
                </div>
            </li>
        `)
        .join('');
    
    suggestionsList.classList.remove('hidden');
}

// Search input handler
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        if (query.length < 2) {
            if (suggestionsList) {
                suggestionsList.innerHTML = '';
                suggestionsList.classList.add('hidden');
            }
            return;
        }

        searchTimeout = setTimeout(async () => {
            const products = await fetchSearchSuggestions(query);
            displaySuggestions(products);
        }, 300);
    });
}

// Search selection handler
window.handleProductSelect = function(productName) {
    if (searchInput) searchInput.value = productName;
    if (suggestionsList) suggestionsList.classList.add('hidden');
    window.location.href = `/search.html?query=${encodeURIComponent(productName)}`;
};

// Search button click handler
function handleSearch(inputElement) {
    const query = inputElement.value.trim();
    if (query) {
        window.location.href = `/search.html?query=${encodeURIComponent(query)}`;
    }
}

if (searchButton) {
    searchButton.addEventListener('click', () => handleSearch(searchInput));
}

if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch(searchInput);
        }
    });
}

// Mobile search handlers
if (mobileSearchButton) {
    mobileSearchButton.addEventListener('click', () => handleSearch(mobileSearchInput));
}

if (mobileSearchInput) {
    mobileSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch(mobileSearchInput);
        }
    });
}

// Export if needed
//export { checkAuthState, updateUIForLoggedInUser, updateUIForGuestUser };