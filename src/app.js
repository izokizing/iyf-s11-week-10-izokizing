const express = require('express');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

// Middleware
app.use(express.json());
app.use(logger);

// Routes
app.use('/api', routes);

// Error handler (last)
app.use(errorHandler);

module.exports = app;