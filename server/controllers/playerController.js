const db = require('../../config/config');

exports.addPlayer = (req, res) => {
    const player = req.body;
  
    if (!player.first_name || !player.last_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    const query = `INSERT INTO Player 
      (player_id, first_name, last_name, date_of_birth, position, nationality, height, weight, contact_email, contact_phone, academy_join_date, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
    db.query(query, [
      player.player_id,
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
      res.status(201).json({ message: 'Player added successfully' });
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

