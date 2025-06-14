const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000; // This should match your apiUrl in environment.ts

app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON request bodies

// Mock login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  console.log(`Login attempt: <span class="math-inline">\{username\}/</span>{password}`);

  // Simple validation: hardcoded credentials for demo purposes
  if (username === 'user' && password === 'password123') {
    res.status(200).json({
      token: 'mock-jwt-token-12345',
      message: 'Login successful!',
      user: { id: 1, username: 'user', role: 'admin' }
    });
  } else {
    res.status(401).json({ message: 'Invalid username or password.' });
  }
});

app.listen(PORT, () => {
  console.log(`Mock backend server running on http://localhost:${PORT}`);
});