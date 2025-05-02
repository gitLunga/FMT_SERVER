const express = require('express');
const router = express.Router();
const scoutController = require('../controllers/scoutController');

// Scout a player
router.post('/scout', scoutController.scoutPlayer);

// Get players scouted by a specific scout
router.get('/scoutedplayers/:scout_id', scoutController.getScoutedPlayers);

router.get('/player-performance/:player_id', scoutController.getPlayerPerformance);


// Update scouting status (admin)
router.put('/scouting/:scouting_id', scoutController.updateScoutingStatus);

// Get user notifications
router.get('/notifications/:user_id', scoutController.getUserNotifications);

// Mark notification as read
router.put('/notifications/read/:notification_id', scoutController.markNotificationAsRead);

// Get admin stats
router.get('/admin/stats', scoutController.getAdminStats);


router.get('/scouting-data', scoutController.getScoutingData);
router.get('player-data', scoutController.getPlayersData);

module.exports = router;