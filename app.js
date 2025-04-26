const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const playerRoutes = require('./server/routes/playerRoutes');

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());


app.use('/players', playerRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

