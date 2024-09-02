document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/login/index.html';
  });
  
  async function loadProducts() {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
  
      const products = await response.json();
      const productList = document.getElementById('product-list');
  
      productList.innerHTML = '<h2>Product List</h2>';
      products.forEach(product => {
        productList.innerHTML += `
          <div>
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <p>Quantity: ${product.quantity}</p>
          </div>
        `;
      });
    } catch (error) {
      alert(error.message);
    }
  }
  
  loadProducts();
  document.getElementById('product-list').addEventListener('click', async (e) => {
    if (e.target.classList.contains('add-to-cart')) {
      const productId = e.target.getAttribute('data-id');
      
      // Handle adding product to cart logic here
      // This might involve calling another API endpoint to manage user cart
    }
  });
  function displayProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '<h2>Product List</h2>';
    
    products.forEach(product => {
      productList.innerHTML += `
        <div>
          <h3>${product.name}</h3>
          <p>Price: $${product.price}</p>
          <p>Quantity: ${product.quantity}</p>
          <button class="add-to-cart" data-id="${product._id}">Add to Cart</button>
        </div>
      `;
    });
  }
  