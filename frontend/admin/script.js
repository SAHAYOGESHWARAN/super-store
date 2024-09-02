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
      loadProducts(); // Refresh the product list
    } catch (error) {
      alert(error.message);
    }
  });
  