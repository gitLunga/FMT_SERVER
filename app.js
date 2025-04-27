const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const playerRoutes = require('./server/routes/playerRoutes');
const authRoutes = require('./server/routes/authRoutes');

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());


app.use('/api/players', playerRoutes);

app.use('/api/auth', authRoutes);


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

