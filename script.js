
// Mock Data
const initialItems = [
    {
        id: 1,
        name: "BMW i8 Convertible",
        category: "vehicle",
        price: "35,000,000",
        description: "Hybrid sports car in pristine condition. Used carefully. 2019 Model.",
        seller: "Nimal Perera",
        contact: "0771234567",
        image: "https://images.unsplash.com/photo-1555215695-3004980adade?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym13JTIwaTh8ZW58MHx8MHx8fDA%3D"
    },
    {
        id: 2,
        name: "iPhone 14 Pro Max",
        category: "electronic",
        price: "385,000",
        description: "Brand new sealed pack. 256GB Deep Purple. One year warranty.",
        seller: "Tech Zone",
        contact: "0719876543",
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aXBob25lJTIwMTQlMjBwcm8lMjBtYXh8ZW58MHx8MHx8fDA%3D"
    },
    {
        id: 3,
        name: "Apartment in Colombo",
        category: "property",
        price: "45,000,000",
        description: "Luxury 3 bedroom apartment with sea view. Fully furnished.",
        seller: "Colombo Real Estate",
        contact: "0112345678",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YXBhcnRtZW50fGVufDB8fDB8fHww"
    },
    {
        id: 4,
        name: "Web Development Service",
        category: "service",
        price: "50,000",
        description: "Professional website design and development for your business.",
        seller: "GMN Tech",
        contact: "0765554444",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29kaW5nfGVufDB8fDB8fHww"
    },
    {
        id: 5,
        name: "Sony PlayStation 5",
        category: "electronic",
        price: "185,000",
        description: "PS5 Disc Edition with extra controller. Slightly used.",
        seller: "Gamer Boy",
        contact: "0751112222",
        image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHM1fGVufDB8fDB8fHww"
    },
];

// DOM Elements
const itemsGrid = document.getElementById('items-grid');
const adForm = document.getElementById('ad-form');
const navLinks = document.querySelectorAll('.nav-links a');

// Initialize
let currentCategory = 'all';
let items = [...initialItems];

// Render Items
function renderItems(filter = 'all') {
    itemsGrid.innerHTML = '';

    const filteredItems = filter === 'all'
        ? items
        : items.filter(item => item.category === filter);

    if (filteredItems.length === 0) {
        itemsGrid.innerHTML = '<p class="no-items">No items found in this category.</p>';
        return;
    }

    filteredItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
            <div class="card-details">
                <div class="header">
                    <h3>${item.name}</h3>
                    <p class="price">Rs. ${item.price}</p>
                </div>
                <p class="desc">${item.description}</p>
                <div class="seller-info">
                    <span>Seller: ${item.seller}</span>
                </div>
                <button class="contact-btn" onclick="contactSeller('${item.contact}')">
                    <i class="fas fa-phone-alt"></i> Call Seller
                </button>
            </div>
        `;
        itemsGrid.appendChild(card);
    });
}

// Initial Render
renderItems();

// Tab Switching Logic
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active-section');
    });

    // Deactivate all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId === 'home' ? 'home' : sectionId + '-section');

    // Special handling for 'home' which is section hero, not content-section
    if (sectionId === 'home') {
        window.scrollTo(0, 0);
        return;
    }

    if (targetSection) {
        targetSection.classList.add('active-section');

        // Activate corresponding tab button if it exists
        const tabBtn = document.querySelector(`.tab-btn[onclick="showSection('${sectionId}')"]`);
        if (tabBtn) tabBtn.classList.add('active');

        // Scroll to the tabs section
        const tabsContainer = document.querySelector('.tabs');
        if (tabsContainer) {
            tabsContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Filter Logic
function filterItems(category) {
    currentCategory = category;

    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(category)) {
            btn.classList.add('active');
        }
    });

    renderItems(category);
}

// Form Submission
adForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get Form Values
    const name = document.getElementById('item-name').value;
    const category = document.getElementById('category').value;
    const price = document.getElementById('price').value;
    const image = document.getElementById('image-url').value || 'https://via.placeholder.com/300?text=No+Image'; // Default if empty
    const description = document.getElementById('description').value;
    const sellerName = document.getElementById('seller-name').value;
    const contact = document.getElementById('seller-contact').value;

    // Create New Item Object
    const newItem = {
        id: items.length + 1,
        name,
        category,
        price,
        description,
        seller: sellerName,
        contact,
        image
    };

    // Add to items array
    items.unshift(newItem); // Add to top

    // Show success message (simple alert for now)
    alert('Advertisement Posted Successfully! Your item is now live.');

    // Switch to Buy tab and show all
    adForm.reset();
    showSection('buy');
    filterItems('all');
});

// Contact Seller Interaction
function contactSeller(number) {
    alert(`Call Seller at: ${number}`);
}

// Navigation Logic
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);

        if (targetId === 'services') {
            showSection('buy');
            filterItems('service');
            // Update UI to reflect service filter
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.innerText === 'Services') btn.classList.add('active');
            });
        } else if (targetId === 'contact') {
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        } else if (targetId === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            showSection(targetId);
        }
    });
});
