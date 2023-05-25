require('./models/User');
require('./models/Session');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const requireAuth = require('./middlewares/requireAuth');

const app = express();

app.use(bodyParser.json());
app.use(authRoutes);
app.use(sessionRoutes);

const mongoUri = process.env.MONGODB_URI;

mongoose.connect(mongoUri);
mongoose.connection.on('connected', () => {
  console.log('Connected to Mongo. :)');
});
mongoose.connection.on('error', (err) => {
  console.log('Error connecting to Mongo. :(');
});

app.get('/', requireAuth, (req, res) => {
  res.send(`Your email: ${req.user.email}`);
});

app.listen(3001, () => {
  console.log('Listening on port 3001...');
});
