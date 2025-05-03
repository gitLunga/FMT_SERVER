const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/trainingController');

// Training Session Routes
router.post('/sessions', trainingController.createTrainingSession);
router.get('/sessions', trainingController.getAllTrainingSessions);

// Attendance Routes
router.post('/attendance', trainingController.recordAttendance);
router.get('/attendance/:session_id', trainingController.getSessionAttendance);

module.exports = router;