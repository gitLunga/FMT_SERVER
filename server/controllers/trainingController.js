const db = require('../../config/config');

// Create a new training session
exports.createTrainingSession = (req, res) => {
  const { session_date, session_type, location, coach_id, duration_hours, focus_area } = req.body;
  
  const query = `
    INSERT INTO trainingsession 
    (session_date, session_type, location, coach_id, duration_hours, focus_area)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.query(query, [session_date, session_type, location, coach_id, duration_hours, focus_area], 
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Failed to create training session" });
      }
      res.status(201).json({ 
        message: "Training session created successfully",
        session_id: results.insertId 
      });
  });
};

// Record training attendance
exports.recordAttendance = (req, res) => {
  const { player_id, session_id, attendance_status, performance_notes } = req.body;
  
  const query = `
    INSERT INTO trainingattendance 
    (player_id, session_id, attendance_status, performance_notes)
    VALUES (?, ?, ?, ?)
  `;
  
  db.query(query, [player_id, session_id, attendance_status, performance_notes], 
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Failed to record attendance" });
      }
      res.status(201).json({ 
        message: "Attendance recorded successfully",
        attendance_id: results.insertId 
      });
  });
};

// Get all training sessions
exports.getAllTrainingSessions = (req, res) => {
  const query = `SELECT * FROM trainingsession ORDER BY session_date DESC`;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Failed to fetch training sessions" });
    }
    res.status(200).json(results);
  });
};

// Get attendance for a specific session
exports.getSessionAttendance = (req, res) => {
  const { session_id } = req.params;
  
  const query = `
    SELECT ta.*, p.first_name, p.last_name
    FROM trainingattendance ta
    JOIN player p ON ta.player_id = p.player_id
    WHERE ta.session_id = ?
    ORDER BY p.last_name
  `;
  
  db.query(query, [session_id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Failed to fetch attendance" });
    }
    res.status(200).json(results);
  });
};