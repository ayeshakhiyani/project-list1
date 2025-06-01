let allProducts = [];
let currentPage = 1;
const productsPerPage = 8;
let filteredProducts = [];

const container = document.getElementById("container");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("categoryFilter");
const pagination = document.getElementById("pagination");
const darkModeBtn = document.getElementById("darkModeBtn");
const sortPrice = document.getElementById("sortPrice");

fetch("https://dummyjson.com/products")
    .then(res => res.json())
    .then(data => {
        allProducts = data.products;
        populateCategories(allProducts);
        renderProducts(true);
    });

function populateCategories(products) {
    const categories = [...new Set(products.map(p => p.category))];
    categories.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        categoryFilter.appendChild(opt);
    });
}

function renderProducts(reset = false) {
    if (reset) currentPage = 1;

    filteredProducts = allProducts.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchInput.value.toLowerCase());
        const matchesCategory = categoryFilter.value === "all" || product.category === categoryFilter.value;
        return matchesSearch && matchesCategory;
    });

    const sortValue = sortPrice.value;
    if (sortValue === "low") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortValue === "high") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    const start = (currentPage - 1) * productsPerPage;
    const end = currentPage * productsPerPage;
    const productsToShow = filteredProducts.slice(start, end);

    container.innerHTML = "";
    productsToShow.forEach(product => {
        container.innerHTML += `
          <div class="product-card">
            <img src="${product.images[0]}" alt="${product.title}">
            <p class="price">$${product.price}</p>
            <p><strong>${product.title}</strong></p>
            <p style="font-size: 12px; color: grey;">${product.category}</p>
          </div>
        `;
    });

    renderPagination();
}

sortPrice.addEventListener("change", () => renderProducts(true));

function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = "pagination-btn";
        if (i === currentPage) {
            btn.classList.add("active-page");
        }

        btn.addEventListener("click", () => {
            currentPage = i;
            renderProducts();
        });

        pagination.appendChild(btn);
    }
}

// Event Listeners
searchInput.addEventListener("input", () => renderProducts(true));
categoryFilter.addEventListener("change", () => renderProducts(true));
darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});