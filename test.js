// test.js
const PORT = process.env.PORT || 3001; // Use different port

const express = require('express');
const app = express();

app.get('/test', (req, res) => res.send('MINIMAL TEST WORKS'));

app.listen(3001, () => console.log('Test server running on port 3000'));