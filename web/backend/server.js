const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const path = require('path');
var cors = require('cors')

const app = express();

//Allow CORS
var cors = require('cors');
app.use(/.*/, cors());
//app.use(cors());

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

// Define Routes
app.use('/api/profs', require('./routes/api/profs'));
app.use('/api/courses', require('./routes/api/courses'));
app.use('/api/profile', require('./routes/api/prof'));
app.get('/', (req, res) => {
	console.log("hello world");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
