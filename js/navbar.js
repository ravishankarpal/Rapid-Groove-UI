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


const mobileCategoriesToggle = document.querySelector('#mobile-menu a[href="#"]');
const mobileCategoriesSubmenu = document.querySelector('#mobile-menu div[class*="px-4"]');

if (mobileCategoriesToggle && mobileCategoriesSubmenu) {
    mobileCategoriesSubmenu.classList.add('hidden');

    mobileCategoriesToggle.addEventListener('click', function(e) {
        e.preventDefault(); 
        mobileCategoriesSubmenu.classList.toggle('hidden');
    
        this.classList.toggle('active');
    });


    const categoryItems = mobileCategoriesSubmenu.querySelectorAll('a');
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileCategoriesSubmenu.classList.add('hidden');
            mobileCategoriesToggle.classList.remove('active');
        });
    });
}



const accountDropdownToggle = document.querySelector('.accountDropDown');
const accountSubDropdown = document.querySelector('.accountsubDropDown');
if (accountDropdownToggle && accountSubDropdown) {
    accountDropdownToggle.addEventListener('click', (e) => {
        e.preventDefault(); 
        accountSubDropdown.classList.toggle('hidden'); 
    });
}


let searchTimeout;
    
searchInput.addEventListener('input', function(e) {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();
    
    if (query.length < 2) {
        suggestionsList.innerHTML = '';
        suggestionsList.classList.add('hidden');
        return;
    }

});


function displaySuggestions(products) {
    if (!products.length) {
        suggestionsList.innerHTML = '<li class="text-gray-500">No products found</li>';
        suggestionsList.classList.remove('hidden');
        return;
    }

    suggestionsList.innerHTML = products
        .map(product => `
            <li class="hover:bg-gray-100" onclick="handleProductSelect('${product.name}')">
                <div class="flex justify-between items-center">
                    <span>${product.name}</span>
                    <span class="text-gray-500">₹${product.price}</span>
                </div>
            </li>
        `)
        .join('');
    
    suggestionsList.classList.remove('hidden');
}

window.handleProductSelect = function(productName) {
    searchInput.value = productName;
    suggestionsList.classList.add('hidden');
    window.location.href = `/search.html?query=${encodeURIComponent(productName)}`;
};

searchButton.addEventListener('click', function() {
    const query = searchInput.value.trim();
    if (query) {
        window.location.href = `/search.html?query=${encodeURIComponent(query)}`;
    }
});

searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const query = this.value.trim();
        if (query) {
            window.location.href = `/search.html?query=${encodeURIComponent(query)}`;
        }
    }
});


           
// Mobile Search Elements
const mobileSearchInput = document.getElementById('mobileSearchInput');
const mobileSearchButton = document.getElementById('mobileSearchButton');

function handleSearch(inputElement) {
    const query = inputElement.value.trim();
    if (query) {
        window.location.href = `/search.html?query=${encodeURIComponent(query)}`;
    } else {
        alert('Please enter a search term.');
    }
}

if (mobileSearchButton) {
    mobileSearchButton.addEventListener('click', function () {
        handleSearch(mobileSearchInput);
    });
}

if (mobileSearchInput) {
    mobileSearchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            handleSearch(mobileSearchInput);
        }
    });
}

export function showLogin(){
    const categoriesD = document.querySelector('.dropdown');
const categoriesM = categoriesDropdown ? categoriesDropdown.querySelector('.dropdown-menu') : null;

if (categoriesD && categoriesM) {
    categoriesD.addEventListener('mouseover', () => {
        categoriesMenu.classList.remove('hidden');
    });

    categoriesD.addEventListener('mouseleave', () => {
        categoriesM.classList.add('hidden');
    });
}
}
