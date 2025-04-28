const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

//add player
router.post('/', playerController.addPlayer);

// Get all players
router.get('/', playerController.getAllPlayers);

// Get player count
router.get('/count', playerController.getPlayerCount);

// Get single player
router.get('/:id', playerController.getPlayer);

// Update player
router.put('/:id', playerController.updatePlayer);

// Delete player
router.delete('/:id', playerController.deletePlayer);

router.post('/add-contract', playerController.addPlayerContract);

router.post('/add-performance', playerController.addPlayerPerformance);


router.get('/contracts', playerController.getAllPlayerContracts);
router.get('/performances', playerController.getAllPlayerPerformances);


module.exports = router;