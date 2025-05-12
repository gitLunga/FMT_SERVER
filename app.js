const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const playerRoutes = require('./server/routes/playerRoutes');
const authRoutes = require('./server/routes/authRoutes');
const scoutRoutes = require('./server/routes/scoutRoutes');
const trainingRoutes = require('./server/routes/trainingRoutes');
const reportRoutes = require('./server/routes/reportRoutes');

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);

app.use('/api/players', playerRoutes);

app.use('/api/scout', scoutRoutes);

app.use('/api/training', trainingRoutes);

app.use('/api/report', reportRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

