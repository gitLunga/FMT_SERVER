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

// Update player
router.put('/:id', playerController.updatePlayer);

// Delete player
router.delete('/:id', playerController.deletePlayer);


// Add this to your routes file as a test
router.get('/test-route', (req, res) => {
    res.json({ message: "Route is working!" });
  });

//contracts routes
router.post('/add-contract', playerController.addPlayerContract);

router.get('/contracts', playerController.getContracts);

router.get('/contracts/count', playerController.getContractCount);

router.put('/contracts/:id', playerController.updateContract);

router.delete('/contracts/:id', playerController.deleteContract);

router.get('/contracts/:id', playerController.getContract);

//performances routes
router.post('/add-performance', playerController.addPlayerPerformance);
router.get('/performances', playerController.getPerformances);
router.get('/performances/count', playerController.getPerformanceCount);
router.put('/performances/:id', playerController.updatePerformance);
router.delete('/performances/:id', playerController.deletePerformance);
router.get('/performances/:id', playerController.getPerformance);


router.get('/scouting/all', playerController.getAllScoutingRecords);
router.get('/contracts/active-count', playerController.getActiveContractsCount);

//moved get single player 
router.get('/:id', playerController.getPlayer);


module.exports = router;