const db = require('../../config/config');

// Scout a player
exports.scoutPlayer = (req, res) => {
    const { scout_id, player_id } = req.body;
  
    if (!scout_id || !player_id) {
      return res.status(400).json({ error: 'Scout ID and Player ID are required' });
    }
  
    // Verify scout role
    db.query('SELECT role FROM user WHERE user_id = ?', [scout_id], (err, scoutResults) => {
      if (err) return res.status(500).json({ error: err.message });
      if (scoutResults.length === 0 || scoutResults[0].role !== 'scout') {
        return res.status(403).json({ error: 'Only scouts can perform this action' });
      }
  
      // Verify player exists
      db.query('SELECT 1 FROM player WHERE player_id = ?', [player_id], (err, playerResults) => {
        if (err) return res.status(500).json({ error: err.message });
        if (playerResults.length === 0) {
          return res.status(404).json({ error: 'Player not found' });
        }
  
        // Get player performance
        db.query(
          'SELECT overall_rating FROM playerperformance WHERE player_id = ? ORDER BY assessment_date DESC LIMIT 1',
          [player_id],
          (err, performanceResults) => {
            if (err) return res.status(500).json({ error: err.message });
  
            // Insert/update scouting request
            const scoutingQuery = `INSERT INTO scouting (scout_id, player_id) VALUES (?, ?) 
                                 ON DUPLICATE KEY UPDATE scouted_date = CURRENT_TIMESTAMP, status = 'pending'`;
            
            db.query(scoutingQuery, [scout_id, player_id], (err) => {
              if (err) return res.status(500).json({ error: err.message });
  
              // Get admins to notify
              db.query('SELECT user_id FROM user WHERE role = "admin"', (err, adminResults) => {
                if (err) return res.status(500).json({ error: err.message });
  
                let notificationsSent = 0;
                const totalAdmins = adminResults.length;
                
                if (totalAdmins === 0) {
                  return res.status(201).json({ 
                    message: 'Player scouted but no admins to notify',
                    performance_data: performanceResults[0] || null
                  });
                }
  
                adminResults.forEach(admin => {
                  const message = performanceResults.length > 0 
                    ? `Scout request for ${player_id} (Rating: ${performanceResults[0].overall_rating})`
                    : `Scout request for ${player_id}`;
                  
                  db.query(
                    `INSERT INTO notifications 
                    (user_id, sender_id, title, message, type, related_id) 
                    VALUES (?, ?, 'Scouting Request', ?, 'scouting_request', ?)`,
                    [admin.user_id, scout_id, message, player_id],
                    (err) => {
                      if (err) console.error('Failed to send notification:', err);
                      
                      notificationsSent++;
                      if (notificationsSent === totalAdmins) {
                        res.status(201).json({ 
                          message: 'Player scouted successfully and admin(s) notified',
                          performance_data: performanceResults[0] || null
                        });
                      }
                    }
                  );
                });
              });
            });
          }
        );
      });
    });
  };
  
  // Get players scouted by a specific scout with performance data
  exports.getScoutedPlayers = async (req, res) => {
    const { scout_id } = req.params;

    // Validate scout_id parameter
    if (!scout_id || isNaN(scout_id)) {
        return res.status(400).json({ 
            success: false,
            error: 'Invalid scout ID. Please provide a valid numeric ID.' 
        });
    }

    try {
        // Verify scout exists and has correct role
        db.query('SELECT role FROM user WHERE user_id = ?', [scout_id], async (err, scout) => {
            if (err) {
                console.error('Error verifying scout:', err);
                return res.status(500).json({ 
                    success: false,
                    error: 'Database error verifying scout' 
                });
            }
            
            if (!scout || scout.length === 0) {
                return res.status(404).json({ 
                    success: false,
                    error: 'Scout not found' 
                });
            }
            
            if (scout[0].role !== 'scout') {
                return res.status(403).json({ 
                    success: false,
                    error: 'Access denied. Only scouts can perform this action.' 
                });
            }

            // Get scouted players with performance data
            const query = `
                SELECT 
                    p.*, 
                    s.scouted_date, 
                    s.status,
                    pp.overall_rating,
                    pp.assessment_date
                FROM scouting s
                JOIN player p ON s.player_id = p.player_id
                LEFT JOIN (
                    SELECT player_id, MAX(assessment_date) as latest_date
                    FROM playerperformance
                    GROUP BY player_id
                ) latest ON p.player_id = latest.player_id
                LEFT JOIN playerperformance pp ON pp.player_id = latest.player_id AND pp.assessment_date = latest.latest_date
                WHERE s.scout_id = ?
                ORDER BY s.scouted_date DESC`;

            db.query(query, [scout_id], (err, results) => {
                if (err) {
                    console.error('Error fetching scouted players:', err);
                    return res.status(500).json({ 
                        success: false,
                        error: 'Database error fetching scouted players' 
                    });
                }
                
                if (!results || results.length === 0) {
                    return res.status(200).json({ 
                        success: true,
                        message: 'No players scouted by this scout yet',
                        data: [] 
                    });
                }

                res.status(200).json({ 
                    success: true,
                    count: results.length,
                    data: results 
                });
            });
        });

    } catch (err) {
        console.error('Error in scouted players endpoint:', err);
        res.status(500).json({ 
            success: false,
            error: 'An unexpected error occurred while fetching scouted players',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

// Add this new endpoint to get player performance data
// In your scoutController.js

// Add this endpoint to get player performance data
exports.getPlayerPerformance = (req, res) => {
    const { player_id } = req.params;

    if (!player_id || isNaN(player_id)) {
        return res.status(400).json({ 
            success: false,
            error: 'Invalid player ID' 
        });
    }

    const query = `
        SELECT * FROM playerperformance 
        WHERE player_id = ? 
        ORDER BY assessment_date DESC 
        LIMIT 1`;

    db.query(query, [player_id], (err, results) => {
        if (err) {
            console.error('Error fetching performance data:', err);
            return res.status(500).json({ 
                success: false,
                error: 'Database error fetching performance data' 
            });
        }
        
        res.status(200).json({ 
            success: true,
            data: results[0] || null 
        });
    });
};

// Update scouting status (for admin)
exports.updateScoutingStatus = (req, res) => {
  const { scouting_id } = req.params;
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const query = `UPDATE scouting SET status = ? WHERE scouting_id = ?`;

  db.query(query, [status, scouting_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Scouting record not found' });
    }
    
    // Get the scout_id and player_id to send notification
    const getDetailsQuery = `SELECT scout_id, player_id FROM scouting WHERE scouting_id = ?`;
    
    db.query(getDetailsQuery, [scouting_id], (err, details) => {
      if (err || details.length === 0) {
        console.error('Failed to get scouting details for notification:', err);
        return res.status(200).json({ message: 'Status updated (notification failed)' });
      }
      
      const { scout_id, player_id } = details[0];
      const message = status === 'approved' 
        ? `Your scouting request for player ID ${player_id} has been approved` 
        : `Your scouting request for player ID ${player_id} has been rejected`;
      
      const notificationQuery = `INSERT INTO notifications 
                               (user_id, sender_id, title, message, type, related_id) 
                               VALUES (?, 1, 'Scouting ${status}', ?, 'scouting_response', ?)`;
      
      db.query(notificationQuery, [scout_id, message, player_id], (err, notifResult) => {
        if (err) {
          console.error('Failed to send notification:', err);
          return res.status(200).json({ 
            message: 'Status updated (notification failed)' 
          });
        }
        
        res.status(200).json({ 
          message: `Scouting ${status} and notification sent` 
        });
      });
    });
  });
};

// Get notifications for a user
exports.getUserNotifications = (req, res) => {
  const { user_id } = req.params;

  const query = `SELECT * FROM notifications 
                WHERE user_id = ? 
                ORDER BY created_at DESC 
                LIMIT 50`;

  db.query(query, [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

// Mark notification as read
exports.markNotificationAsRead = (req, res) => {
  const { notification_id } = req.params;

  const query = `UPDATE notifications SET is_read = TRUE WHERE notification_id = ?`;

  db.query(query, [notification_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification marked as read' });
  });
};

// Get admin dashboard stats
exports.getAdminStats = (req, res) => {
  const queries = {
    totalPlayers: `SELECT COUNT(*) as count FROM player`,
    totalUsers: `SELECT COUNT(*) as count FROM user`,
    scoutedPlayers: `SELECT COUNT(DISTINCT player_id) as count FROM scouting`,
    playersWithContracts: `SELECT COUNT(DISTINCT player_id) as count FROM playercontract WHERE status = 'active'`,
    activeScouts: `SELECT COUNT(DISTINCT scout_id) as count FROM scouting`
  };

  const results = {};
  let completed = 0;
  const totalQueries = Object.keys(queries).length;

  for (const [key, query] of Object.entries(queries)) {
    db.query(query, (err, result) => {
      if (err) {
        console.error(`Error executing ${key} query:`, err);
        results[key] = 0;
      } else {
        results[key] = result[0].count;
      }
      
      completed++;
      if (completed === totalQueries) {
        res.status(200).json(results);
      }
    });
  }
};