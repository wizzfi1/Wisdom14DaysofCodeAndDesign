// src/server.js
const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const jobsRouter = require('./routes/jobs');

app.use(express.json());
app.use('/api/auth', authRoutes); // Prefix all auth routes

app.use('/api/jobs', jobsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));