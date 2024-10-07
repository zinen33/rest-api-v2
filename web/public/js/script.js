'use strict';

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });

// custom select variables
const select = document.querySelector("[data-select]");
const selectValue = document.querySelector("[data-selecct-value]");

// Utility function to capitalize first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Handle category selection (used by both dropdown and filter buttons)
function handleCategorySelection(selectedValue, element) {
  // Update select value display with capitalized text
  selectValue.innerText = selectedValue === 'all' ? 'Select category' : capitalizeFirstLetter(selectedValue);
  
  // Apply filter to items
  const filterItems = document.querySelectorAll("[data-filter-item]");
  filterItems.forEach(item => {
    if (selectedValue === "all" || item.dataset.category === selectedValue.toLowerCase()) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Update active state of filter buttons
  const filterButtons = document.querySelectorAll("[data-filter-btn]");
  filterButtons.forEach(btn => {
    btn.classList.toggle("active", btn.textContent.toLowerCase() === selectedValue.toLowerCase());
  });

  // Close dropdown if it's open
  if (select.classList.contains("active")) {
    elementToggleFunc(select);
  }
}

// Toggle dropdown when clicking the select button
select.addEventListener("click", function (e) {
  elementToggleFunc(this);
});

function setupCategoryFilter(apis) {
  // Get unique categories and capitalize them
  const categories = ['All', ...new Set(apis.map(api => capitalizeFirstLetter(api.category)))];
  const categoryFilter = document.getElementById('category-filter');
  const categorySelect = document.getElementById('category-select');

  // Clear existing items (except "All")
  while (categoryFilter.children.length > 1) {
    categoryFilter.removeChild(categoryFilter.lastChild);
  }
  while (categorySelect.children.length > 1) {
    categorySelect.removeChild(categorySelect.lastChild);
  }

  // Add category items
  categories.forEach((category, index) => {
    if (index > 0) { // Skip 'All' as it's already added
      // Add filter button
      const filterItem = document.createElement('li');
      filterItem.className = 'filter-item';
      const filterBtn = document.createElement('button');
      filterBtn.setAttribute('data-filter-btn', '');
      filterBtn.textContent = category;
      filterBtn.addEventListener('click', function() {
        handleCategorySelection(this.textContent.toLowerCase(), this);
      });
      filterItem.appendChild(filterBtn);
      categoryFilter.appendChild(filterItem);

      // Add select item
      const selectItem = document.createElement('li');
      selectItem.className = 'select-item';
      const selectBtn = document.createElement('button');
      selectBtn.setAttribute('data-select-item', '');
      selectBtn.textContent = category;
      selectBtn.addEventListener('click', function() {
        handleCategorySelection(this.textContent.toLowerCase(), this);
      });
      selectItem.appendChild(selectBtn);
      categorySelect.appendChild(selectItem);
    }
  });

  // Add click handler to "All" button
  const allFilterBtn = categoryFilter.querySelector("[data-filter-btn]");
  allFilterBtn.addEventListener('click', function() {
    handleCategorySelection('all', this);
  });

  // Add click handler to "All" select item
  const allSelectItem = categorySelect.querySelector("[data-select-item]");
  allSelectItem.addEventListener('click', function() {
    handleCategorySelection('all', this);
  });
}

// Display APIs with capitalized categories
function displayAPIs(apis) {
  const apiList = document.getElementById('api-list');
  apiList.innerHTML = '';

  apis.forEach(api => {
    const listItem = document.createElement('li');
    listItem.className = 'project-item active';
    listItem.setAttribute('data-filter-item', '');
    listItem.setAttribute('data-category', api.category.toLowerCase());

    listItem.innerHTML = `
      <a href="${api.link[0]}">
        <figure class="project-img">
          <div class="project-item-icon-box">
            <ion-icon name="eye-outline"></ion-icon>
          </div>
          <img src="images/api-default.jpg" alt="${api.name}" loading="lazy">
        </figure>
        <h3 class="project-title">${api.name}</h3>
        <p class="project-category">${capitalizeFirstLetter(api.category)}</p>
      </a>
    `;

    apiList.appendChild(listItem);
  });
}

// page navigation
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

navigationLinks.forEach((link, index) => {
  link.addEventListener("click", function () {
    pages.forEach((page, pageIndex) => {
      if (index === pageIndex) {
        page.classList.add("active");
        link.classList.add("active");
        window.scrollTo(0, 0);
      } else {
        page.classList.remove("active");
        navigationLinks[pageIndex].classList.remove("active");
      }
    });
  });
});