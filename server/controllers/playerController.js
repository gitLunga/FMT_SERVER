const db = require('../../config/config');

exports.addPlayer = (req, res) => {
  const player = req.body;

  if (!player.first_name || !player.last_name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `INSERT INTO Player 
    (first_name, last_name, date_of_birth, position, nationality, height, weight, contact_email, contact_phone, academy_join_date, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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
    player.status
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
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
