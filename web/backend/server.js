const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

// Define Routes
app.use('/api/users', require('./routes/api/profs'));
app.use('/api/auth', require('./routes/api/course'));
app.use('/api/profile', require('./routes/api/prof'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
