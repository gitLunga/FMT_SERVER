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

router.post('/contracts', playerController.addPlayerContract);

router.post('/player-performances', playerController.addPlayerPerformance);




module.exports = router;