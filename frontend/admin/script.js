document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const quantity = document.getElementById('quantity').value;
  
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name, price, quantity })
      });
  
      if (!response.ok) {
        throw new Error('Failed to add product');
      }
  
      alert('Product added successfully');
      loadProducts(); // Refresh product list
    } catch (error) {
      alert(error.message);
    }
  });
  
  async function loadProducts() {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const products = await response.json();
  
      const productList = document.getElementById('product-list');
      productList.innerHTML = '';
  
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
      console.error('Failed to load products:', error);
    }
  }
  
  // Load products on page load
  loadProducts();
  