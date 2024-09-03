document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.status === 200) {
        localStorage.setItem('token', data.token);
        window.location.href = 'admin.html'; // Or user page based on role
    } else {
        document.getElementById('loginError').innerText = data.message;
    }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();

    if (res.status === 201) {
        window.location.href = 'login.html';
    } else {
        document.getElementById('registerError').innerText = data.message;
    }
});


document.getElementById('addProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const image = document.getElementById('image').files[0];

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('image', image);

    const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
    });

    const data = await res.json();

    if (res.status === 201) {
        // Refresh the product list
        loadProducts();
    } else {
        console.log(data.message);
    }
});

async function loadProducts() {
    const res = await fetch('/api/products');
    const products = await res.json();

    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    products.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="/uploads/${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>$${product.price}</p>
            <button onclick="deleteProduct('${product._id}')">Delete</button>
        `;
        productList.appendChild(li);
    });
}

async function deleteProduct(id) {
    const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (res.status === 200) {
        // Refresh the product list
        loadProducts();
    } else {
        console.log('Failed to delete product');
    }
}

loadProducts();

document.addEventListener('DOMContentLoaded', loadProducts);

async function loadProducts() {
    const res = await fetch('/api/products');
    const products = await res.json();

    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    products.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="/uploads/${product.image}" alt="${product.name}" style="width:100px;height:auto;">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>$${product.price}</p>
            <button onclick="addToCart('${product._id}')">Add to Cart</button>
        `;
        productList.appendChild(li);
    });
}

async function addToCart(productId) {
    const res = await fetch(`/api/cart`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ productId })
    });

    if (res.status === 201) {
        alert('Product added to cart');
    } else {
        alert('Failed to add product to cart');
    }
}

document.getElementById('productForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const image = document.getElementById('image').files[0];

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    if (image) {
        formData.append('image', image);
    }

    try {
        const response = await fetch('/api/admin/products', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.msg);
            loadProducts();
        } else {
            alert('Error: ' + result.msg);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding product');
    }
});


async function loadProducts() {
    try {
        const response = await fetch('/api/admin/products');
        const products = await response.json();

        const productList = document.getElementById('productList');
        productList.innerHTML = '';

        products.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML = `
                <img src="/uploads/${product.image}" alt="${product.name}" style="width: 100px;">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>$${product.price}</p>
                <button onclick="deleteProduct('${product._id}')">Delete</button>
            `;
            productList.appendChild(li);
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Error loading products');
    }
}

async function deleteProduct(productId) {
    try {
        const response = await fetch(`/api/admin/products/${productId}`, {
            method: 'DELETE'
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.msg);
            loadProducts();
        } else {
            alert('Error: ' + result.msg);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting product');
    }
}

// Load products on page load
loadProducts();
app.use(express.static('frontend'));


