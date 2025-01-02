// Fetch API list
let apiList = [];
let openCategoryDiv = null;
let openEndpointDiv = null;

async function fetchApiList() {
    try {
        const response = await fetch('/api-list');
        const data = await response.json();
        apiList = data.apis;
        updateDashboard();
    } catch (error) {
        console.error('Error fetching API list:', error);
    }
}

function updateDashboard() {
    const totalEndpoints = apiList.length;
    const categories = new Set(apiList.map(api => api.category));
    const totalCategories = categories.size;

    const totalEndpointsEl = document.getElementById('totalEndpoints');
    const totalCategoriesEl = document.getElementById('totalCategories');

    totalEndpointsEl.textContent = totalEndpoints;
    totalCategoriesEl.textContent = totalCategories;

    // Remove loading animations
    totalEndpointsEl.classList.remove('loading-pulse');
    totalCategoriesEl.classList.remove('loading-pulse');

    renderCategories(apiList);
}

function createEndpointElement(endpoint) {
    const endpointDiv = document.createElement('div');
    endpointDiv.className = 'rounded-md mb-1';

    const endpointButton = document.createElement('button');
    endpointButton.className = 'flex w-full items-center justify-between px-3 py-2 text-sm text-gray-300 hover:bg-[#1e1e1e] transition-colors duration-200 ease-in-out rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500';
    endpointButton.innerHTML = `
        <span class="capitalize">${endpoint.name}</span>
        <span class="bg-[#1e1e1e] text-gray-300 text-xs px-2 py-0.5 rounded">GET</span>
    `;

    const endpointDetails = document.createElement('div');
    endpointDetails.className = 'mt-2 px-3 py-2 text-xs text-gray-400 bg-[#1e1e1e] rounded-md hidden';
    endpointDetails.innerHTML = `
        <p class="mb-2"><strong class="text-gray-200">Endpoint:</strong> <span class="break-all">${endpoint.endpoint}</span></p>
        <p class="mb-3"><strong class="text-gray-200">Description:</strong> ${endpoint.description}</p>
        <a href="${endpoint.endpoint}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center w-full px-3 py-1.5 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out">
            Access API
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
        </a>
    `;

    endpointButton.addEventListener('click', () => {
        if (openEndpointDiv && openEndpointDiv !== endpointDetails) {
            openEndpointDiv.classList.add('hidden');
        }
        endpointDetails.classList.toggle('hidden');
        openEndpointDiv = endpointDetails.classList.contains('hidden') ? null : endpointDetails;
    });

    endpointDiv.appendChild(endpointButton);
    endpointDiv.appendChild(endpointDetails);
    return endpointDiv;
}

function renderCategories(apis) {
    const sidebarNav = document.getElementById('sidebarNav');
    sidebarNav.innerHTML = '';

    const categories = {};
    apis.forEach(api => {
        if (!categories[api.category]) {
            categories[api.category] = [];
        }
        categories[api.category].push(api);
    });

    Object.entries(categories).forEach(([category, endpoints]) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'mb-1';

        const categoryButton = document.createElement('button');
        categoryButton.className = 'flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium text-gray-300 transition-colors duration-200 ease-in-out hover:bg-[#1e1e1e] focus:outline-none focus:ring-1 focus:ring-blue-500';
        categoryButton.innerHTML = `
            <span class="capitalize">${category}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
        `;

        const endpointsDiv = document.createElement('div');
        endpointsDiv.className = 'mt-1 space-y-1 pl-3 hidden';

        endpoints.forEach(endpoint => {
            endpointsDiv.appendChild(createEndpointElement(endpoint));
        });

        categoryButton.addEventListener('click', () => {
            if (openCategoryDiv && openCategoryDiv !== endpointsDiv) {
                openCategoryDiv.classList.add('hidden');
                openCategoryDiv.previousElementSibling.querySelector('svg').classList.remove('rotate-180');
            }
            endpointsDiv.classList.toggle('hidden');
            categoryButton.querySelector('svg').classList.toggle('rotate-180');
            openCategoryDiv = endpointsDiv.classList.contains('hidden') ? null : endpointsDiv;
        });

        categoryDiv.appendChild(categoryButton);
        categoryDiv.appendChild(endpointsDiv);
        sidebarNav.appendChild(categoryDiv);
    });
}

function filterApis(searchTerm) {
    return apiList.filter(api =>
        api.name.toLowerCase().includes(searchTerm) ||
        api.description.toLowerCase().includes(searchTerm) ||
        api.category.toLowerCase().includes(searchTerm)
    );
}

const searchInput = document.getElementById('apiSearch');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredApis = filterApis(searchTerm);
    renderCategories(filteredApis);

    if (searchTerm) {
        document.querySelectorAll('#sidebarNav > div').forEach(categoryDiv => {
            const endpointsDiv = categoryDiv.querySelector('div:last-child');
            const hasMatch = Array.from(endpointsDiv.children).some(child => 
                child.textContent.toLowerCase().includes(searchTerm)
            );
            if (hasMatch) {
                endpointsDiv.classList.remove('hidden');
                categoryDiv.querySelector('button svg').classList.add('rotate-180');
            }
        });
    }
});

// Initial fetch and render
fetchApiList();

// Dynamic greeting
const greetingElement = document.getElementById('greeting');

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    if (hour < 22) return "Good Evening";
    return "Good Night";
}

function updateGreeting() {
    greetingElement.textContent = getGreeting();
}

updateGreeting();
setInterval(updateGreeting, 60000);

// Notifications functionality
const showNotificationsBtn = document.getElementById('showNotifications');
const mainContent = document.getElementById('mainContent');

let notifications = [];

showNotificationsBtn.addEventListener('click', () => {
    const notificationsHTML = `
        <div class="max-w-4xl mx-auto">
            <div class="bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-800">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-primary-300">Notifications</h2>
                        <button id="closeNotifications" class="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    ${notifications.map((notification, index) => `
                        <div class="py-4 ${index !== 0 ? 'border-t border-gray-800' : ''}">
                            <h3 class="text-lg font-semibold text-primary-300 mb-2">${notification.title}</h3>
                            <p class="text-gray-400">${notification.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    mainContent.innerHTML = notificationsHTML;

    const closeNotificationsBtn = document.getElementById('closeNotifications');
    closeNotificationsBtn.addEventListener('click', () => {
        location.reload();
    });
});

// Sidebar functionality
const menuButton = document.getElementById('menuButton');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

function closeAllCategories() {
    if (openCategoryDiv) {
        openCategoryDiv.classList.add('hidden');
        openCategoryDiv.previousElementSibling.querySelector('svg').classList.remove('rotate-180');
        openCategoryDiv = null;
    }
    if (openEndpointDiv) {
        openEndpointDiv.classList.add('hidden');
        openEndpointDiv = null;
    }
}

function toggleSidebar() {
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
}

menuButton.addEventListener('click', toggleSidebar);

overlay.addEventListener('click', toggleSidebar);

document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !menuButton.contains(e.target) && !sidebar.classList.contains('-translate-x-full')) {
        toggleSidebar();
    }
});

// Battery and time functions
function updateBatteryLevel() {
    const batteryEl = document.getElementById('batteryLevel');
    if ('getBattery' in navigator) {
        navigator.getBattery().then(function(battery) {
            const level = Math.round(battery.level * 100);
            batteryEl.textContent = `${level}%`;
            batteryEl.classList.remove('loading-pulse');
        });
    } else {
        batteryEl.textContent = 'Not available';
        batteryEl.classList.remove('loading-pulse');
    }
}

function updateDateTime() {
    const now = new Date();
    const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };

    const dateEl = document.getElementById('currentDate');
    const timeEl = document.getElementById('currentTime');

    dateEl.textContent = now.toLocaleDateString('en-CA', dateOptions).replace(/\//g, '-');
    timeEl.textContent = now.toLocaleTimeString('en-GB', timeOptions);

    dateEl.classList.remove('loading-pulse');
    timeEl.classList.remove('loading-pulse');
}

// Initial calls
updateBatteryLevel();
updateDateTime();

// Update every second
setInterval(updateDateTime, 1000);

// Update battery every minute
setInterval(updateBatteryLevel, 60000);

// Welcome popup functionality
function showWelcomePopup() {
    const welcomePopup = document.getElementById('welcomePopup');
    const closeWelcomePopupBtn = document.getElementById('closeWelcomePopup');
    const isHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html';

    if (isHomePage && !localStorage.getItem('welcomePopupShown')) {
        welcomePopup.classList.remove('hidden');
        closeWelcomePopupBtn.classList.add('animate-pulse-scale');

        closeWelcomePopupBtn.addEventListener('click', () => {
            closeWelcomePopupBtn.classList.remove('animate-pulse-scale');
            welcomePopup.classList.add('hidden');
            localStorage.setItem('welcomePopupShown', 'true');
        });
    }
}

document.addEventListener('DOMContentLoaded', showWelcomePopup);

async function fetchConfig() {
    if (window.appConfig) {
        return window.appConfig;
    }
    try {
        const response = await fetch('/api-list');
        const data = await response.json();
        return data.config;
    } catch (error) {
        console.error('Error fetching config:', error);
        return {};
    }
}

async function updateDynamicContent() {
    const config = await fetchConfig();

    // Update document title
    document.title = config.title || 'API Dashboard Pro';

    // Update sidebar title
    document.getElementById('sidebarTitleText').textContent = config.title || 'API Dashboard Pro';

    // Update welcome popup title
    document.getElementById('welcomeTitle').textContent = `Welcome to ${config.title || 'API Dashboard Pro'}!`;

    // Update notifications
    notifications = config.notifications || [];

    // Update favicon if provided in config
    if (config.favicon) {
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) {
            favicon.href = config.favicon;
        } else {
            const newFavicon = document.createElement('link');
            newFavicon.rel = 'icon';
            newFavicon.href = config.favicon;
            document.head.appendChild(newFavicon);
        }
    }
}

updateDynamicContent();

