document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/login/index.html';
  });
  
  async function loadProducts() {
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
  
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
  