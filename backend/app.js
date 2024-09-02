const express = require('express');
const path = require('path');
const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Define routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login/index.html'));
});

// Other routes and middleware...

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
