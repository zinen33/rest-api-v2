// Fetch API list and populate sidebar
fetch('/api-list')
    .then(response => response.json())
    .then(apis => {
        const sidebar = document.getElementById('accordionSidebar');
        const categories = {};

        // Group APIs by category
        apis.forEach(api => {
            if (!categories[api.category]) {
                categories[api.category] = [];
            }
            categories[api.category].push(api);
        });

        // Create sidebar items for each category
        Object.keys(categories).forEach((category, index) => {
            const categoryId = `collapse${index}`;
            const categoryItem = document.createElement('li');
            categoryItem.className = 'nav-item';
            categoryItem.innerHTML = `
                <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#${categoryId}" aria-expanded="true" aria-controls="${categoryId}">
                    <i class="fas fa-circle"></i>
                    <span>${category.charAt(0).toUpperCase() + category.slice(1)}</span>
                </a>
                <div id="${categoryId}" class="collapse" aria-labelledby="heading${index}" data-parent="#accordionSidebar">
                    <div class="py-2 collapse-inner rounded">
                        ${categories[category].map(api => `
                            <a class="collapse-item" target="_blank" href="/api/${api.name}?${api.link[0].split('?')[1] || ''}">
                                ${api.name.charAt(0).toUpperCase() + api.name.slice(1)}
                            </a>
                        `).join('')}
                    </div>
                </div>
            `;
            sidebar.appendChild(categoryItem);
        });

        // Update API stats
        document.getElementById('totalApis').textContent = apis.length;
        document.getElementById('apiCategories').textContent = Object.keys(categories).length;
    })
    .catch(error => console.error('Error fetching API list:', error));