// Add this to your existing JavaScript file (e.g., js/script.js)

async function loadAPICards() {
  try {
    const response = await fetch('/api-list');
    const apis = await response.json();
    const projectList = document.querySelector('.project-list');
    const filterList = document.querySelector('.filter-list');
    const selectList = document.querySelector('.select-list');
    
    // Populate API cards
    projectList.innerHTML = apis.map(api => `
      <li class="project-item active" data-filter-item data-category="${api.category}">
        <a href="${api.link[0]}">
          <figure class="project-img">
            <div class="project-item-icon-box">
              <ion-icon name="eye-outline"></ion-icon>
            </div>
            <img src="images/${api.category}-icon.jpg" alt="${api.name}" loading="lazy">
          </figure>
          <h3 class="project-title">${api.name}</h3>
          <p class="project-category">${api.description}</p>
        </a>
      </li>
    `).join('');

    // Get unique categories
    const categories = ['All', ...new Set(apis.map(api => api.category))];

    // Populate filter buttons
    filterList.innerHTML = categories.map(category => `
      <li class="filter-item">
        <button class="${category === 'All' ? 'active' : ''}" data-filter-btn>${category}</button>
      </li>
    `).join('');

    // Populate select list
    selectList.innerHTML = categories.map(category => `
      <li class="select-item">
        <button data-select-item>${category}</button>
      </li>
    `).join('');

    // Initialize filtering functionality
    initializeFiltering();
  } catch (error) {
    console.error('Error loading API list:', error);
  }
}

function initializeFiltering() {
  const filterButtons = document.querySelectorAll('[data-filter-btn]');
  const projectItems = document.querySelectorAll('[data-filter-item]');

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filterValue = this.textContent.trim().toLowerCase();
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      projectItems.forEach(item => {
        if (filterValue === 'all' || item.dataset.category === filterValue) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    });
  });
}

// Load API cards when the page is ready
document.addEventListener('DOMContentLoaded', loadAPICards);

// Add any additional functionality you need here