const db = require('../../config/config');

exports.addPlayer = (req, res) => {
  const player = req.body;

  // Validation
  if (!player.first_name || !player.last_name) {
    return res.status(400).json({ error: 'First name and last name are required' });
  }

  const query = `INSERT INTO player 
    (first_name, last_name, date_of_birth, position, nationality, 
     height, weight, contact_email, contact_phone, academy_join_date, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [
    player.first_name,
    player.last_name,
    player.date_of_birth,
    player.position,
    player.nationality,
    player.height || null,  // Handle optional fields
    player.weight || null,
    player.contact_email || null,
    player.contact_phone || null,
    player.academy_join_date,
    player.status
  ], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        error: 'Database operation failed',
        details: err.message 
      });
    }
    
    // Verify the insertId
    console.log('Insert result:', result);
    
    res.status(201).json({ 
      message: 'Player added successfully',
      player_id: result.insertId 
    });
  });
};

  exports.getAllPlayers = (req, res) => {
    const query = `SELECT * FROM Player ORDER BY last_name, first_name`;
    req = query
    
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};

//count players (new)
exports.getPlayerCount = (req, res) => {
  const query = `SELECT COUNT(*) as count FROM Player`;
  
  db.query(query, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ count: results[0].count });
  });
};

// update player (new)
exports.updatePlayer = (req, res) => {
  const { id } = req.params;
  const player = req.body;
  
  if (!player.first_name || !player.last_name) {
      return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const query = `UPDATE Player SET 
      first_name = ?, 
      last_name = ?, 
      date_of_birth = ?, 
      position = ?, 
      nationality = ?, 
      height = ?, 
      weight = ?, 
      contact_email = ?, 
      contact_phone = ?, 
      academy_join_date = ?, 
      status = ?
      WHERE player_id = ?`;
  
  db.query(query, [
      player.first_name,
      player.last_name,
      player.date_of_birth,
      player.position,
      player.nationality,
      player.height,
      player.weight,
      player.contact_email,
      player.contact_phone,
      player.academy_join_date,
      player.status,
      id
  ], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Player not found' });
      }
      res.status(200).json({ message: 'Player updated successfully' });
  });
};

// Delete player (new)
exports.deletePlayer = (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM Player WHERE player_id = ?`;
  
  db.query(query, [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Player not found' });
      }
      res.status(200).json({ message: 'Player deleted successfully' });
  });
};

exports.getPlayer = (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM Player WHERE player_id = ?`;
  
  db.query(query, [id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) {
          return res.status(404).json({ error: 'Player not found' });
      }
      res.status(200).json(results[0]);
  });
};

//contract APIS
exports.addPlayerContract = (req, res) => {
  const contract = req.body;

  if (!contract.player_id || !contract.start_date) {  // Added player_id check
    return res.status(400).json({ error: 'Player ID and start date are required' });
  }

  const query = `INSERT INTO playercontract 
    (player_id, start_date, end_date, contract_type, monthly_stipend, performance_bonus, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;  // Added player_id to query

  db.query(query, [
    contract.player_id,  // Added player_id value
    contract.start_date,
    contract.end_date || null,
    contract.contract_type,
    contract.monthly_stipend || null,
    contract.performance_bonus || null,
    contract.status
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Contract added successfully' });
  });
};
// Get contract count
exports.getContractCount = (req, res) => {
  const query = `SELECT COUNT(*) as count FROM playercontract`;
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ count: results[0].count });
  });
};

// Update contract
exports.updateContract = (req, res) => {
  const { id } = req.params;
  const contract = req.body;
  
  if (!contract.player_id || !contract.contract_type || !contract.start_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const query = `UPDATE playercontract SET 
    player_id = ?,
    start_date = ?,
    end_date = ?,
    contract_type = ?,
    monthly_stipend = ?,
    performance_bonus = ?,
    status = ?
    WHERE contract_id = ?`;
  
  db.query(query, [
    contract.player_id,
    contract.start_date,
    contract.end_date,
    contract.contract_type,
    contract.monthly_stipend,
    contract.performance_bonus,
    contract.status,
    id
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    res.status(200).json({ message: 'Contract updated successfully' });
  });
};

// Delete contract
exports.deleteContract = (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM playercontract WHERE contract_id = ?`;
  
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    res.status(200).json({ message: 'Contract deleted successfully' });
  });
};

// Get single contract
exports.getContract = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      pc.*,
      p.first_name,
      p.last_name
    FROM playercontract pc
    JOIN player p ON pc.player_id = p.player_id
    WHERE pc.contract_id = ?`;
  
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    res.status(200).json(results[0]);
  });
};

exports.getAllContracts = (req, res) => {
  const query = `SELECT * FROM playercontract ORDER BY contract_id`;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Failed to fetch contracts" });
    }
    res.status(200).json(results);
  });
};

//performance APIS

exports.addPlayerPerformance = (req, res) => {
  const performance = req.body;

  if (!performance.player_id || !performance.assessment_date) {
    return res.status(400).json({ error: 'Player ID and assessment date are required' });
  }

  // Fixed SQL syntax error (removed extra parenthesis)
  const query = `INSERT INTO playerperformance 
    (player_id, assessment_date, technical_score, tactical_score, physical_score, psychological_score, overall_rating, coach_comments) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [
    performance.player_id, // Added player_id to the query
    performance.assessment_date,
    performance.technical_score || null,
    performance.tactical_score || null,
    performance.physical_score || null,
    performance.psychological_score || null,
    performance.overall_rating || null,
    performance.coach_comments || null
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Performance added successfully' });
  });
};

// Get performance count
exports.getPerformanceCount = (req, res) => {
  const query = `SELECT COUNT(*) as count FROM playerperformance`;
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ count: results[0].count });
  });
};

// Update performance
exports.updatePerformance = (req, res) => {
  const { id } = req.params;
  const performance = req.body;
  
  if (!performance.player_id || !performance.assessment_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const query = `UPDATE playerperformance SET 
    player_id = ?,
    assessment_date = ?,
    technical_score = ?,
    tactical_score = ?,
    physical_score = ?,
    psychological_score = ?,
    overall_rating = ?,
    coach_comments = ?
    WHERE performance_id = ?`;
  
  db.query(query, [
    performance.player_id,
    performance.assessment_date,
    performance.technical_score,
    performance.tactical_score,
    performance.physical_score,
    performance.psychological_score,
    performance.overall_rating,
    performance.coach_comments,
    id
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Performance record not found' });
    }
    res.status(200).json({ message: 'Performance record updated successfully' });
  });
};

// Delete performance
exports.deletePerformance = (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM playerperformance WHERE performance_id = ?`;
  
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Performance record not found' });
    }
    res.status(200).json({ message: 'Performance record deleted successfully' });
  });
};

// Get single performance
exports.getPerformance = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      pp.*,
      p.first_name,
      p.last_name
    FROM playerperformance pp
    JOIN player p ON pp.player_id = p.player_id
    WHERE pp.performance_id = ?`;
  
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(404).json({ error: 'Performance record not found' });
    }
    res.status(200).json(results[0]);
  });
};



exports.getAllPlayerPerformances = (req, res) => {
  const query = `
      SELECT 
          pp.performance_id,
          pp.player_id,
          pp.assessment_date,
          pp.technical_score,
          pp.tactical_score,
          pp.physical_score,
          pp.psychological_score,
          pp.overall_rating,
          pp.coach_comments,  // Fixed typo (was 'coach_comments')
          p.first_name,
          p.last_name
      FROM playerperformance pp
      JOIN player p ON pp.player_id = p.player_id
      ORDER BY pp.assessment_date DESC
  `;
  
  db.query(query, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(results || []); // Returns data in the exact format your frontend expects
  });
};

exports.getAllScoutingRecords = (req, res) => {
  const query = `SELECT s.*, 
                u1.first_name as scout_first_name, u1.last_name as scout_last_name,
                p.first_name as player_first_name, p.last_name as player_last_name
                FROM scouting s
                JOIN user u1 ON s.scout_id = u1.user_id
                JOIN player p ON s.player_id = p.player_id
                ORDER BY s.scouted_date DESC`;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

// Get all active contracts count (for admin dashboard)
exports.getActiveContractsCount = (req, res) => {
  const query = `SELECT COUNT(*) as count FROM playercontract WHERE status = 'active'`;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ count: results[0].count });
  });
};