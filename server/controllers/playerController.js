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