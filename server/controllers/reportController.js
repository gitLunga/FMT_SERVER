const db = require('../../config/config');
const { jsPDF } = require('jspdf');
require('jspdf-autotable');

exports.generateReport = async (req, res) => {
  try {
    // Define all queries
    const queries = {
      users: "SELECT COUNT(*) as count FROM user",
      admins: "SELECT COUNT(*) as count FROM user WHERE role = 'admin'",
      scouts: "SELECT COUNT(*) as count FROM user WHERE role = 'scout'",
      players: "SELECT COUNT(*) as count FROM user WHERE role = 'player'",
      active_players: "SELECT COUNT(*) as count FROM player WHERE status = 'Active'",
      inactive_players: "SELECT COUNT(*) as count FROM player WHERE status = 'Inactive'",
      graduated_players: "SELECT COUNT(*) as count FROM player WHERE status = 'Graduated'",
      pending_scouting: "SELECT COUNT(*) as count FROM scouting WHERE status = 'pending'",
      approved_scouting: "SELECT COUNT(*) as count FROM scouting WHERE status = 'approved'",
      rejected_scouting: "SELECT COUNT(*) as count FROM scouting WHERE status = 'rejected'"
    };

    // Execute all queries in parallel
    const results = {};
    const queryPromises = Object.entries(queries).map(([key, query]) => {
      return new Promise((resolve) => {
        db.query(query, (err, result) => {
          if (err) {
            console.error(`Error executing ${key} query:`, err);
            results[key] = 0;
          } else {
            results[key] = result[0]?.count || 0;
          }
          resolve();
        });
      });
    });

    // Get top players
    const topPlayersQuery = `
      SELECT p.player_id, CONCAT(p.first_name, ' ', p.last_name) as name, 
             AVG(pp.overall_rating) as rating
      FROM player p
      JOIN playerperformance pp ON p.player_id = pp.player_id
      GROUP BY p.player_id
      ORDER BY rating DESC
      LIMIT 3
    `;

    const topPlayersPromise = new Promise((resolve) => {
      db.query(topPlayersQuery, (err, result) => {
        if (err) {
          console.error('Error executing top players query:', err);
          results.top_players = [];
        } else {
          results.top_players = result.map((player, index) => ({
            rank: index + 1,
            name: player.name || 'Unknown Player',
            rating: player.rating ? parseFloat(player.rating.toFixed(2)) : 0
          }));
        }
        resolve();
      });
    });

    // Wait for all queries to complete
    await Promise.all([...queryPromises, topPlayersPromise]);

    // PDF generation (if requested)
    if (req.query.format === 'pdf') {
      try {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Football Management System Report', 15, 20);
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 15, 30);
        
        doc.autoTable({
          startY: 40,
          head: [['Category', 'Count']],
          body: [
            ['Total Users', results.users],
            ['Administrators', results.admins],
            ['Scouts', results.scouts],
            ['Players', results.players],
            ['Active Players', results.active_players],
            ['Pending Scouting Requests', results.pending_scouting]
          ]
        });

        if (results.top_players.length > 0) {
          doc.autoTable({
            startY: doc.lastAutoTable.finalY + 20,
            head: [['Rank', 'Player Name', 'Average Rating']],
            body: results.top_players.map(player => [
              player.rank,
              player.name,
              player.rating
            ])
          });
        }

        const pdfBuffer = doc.output('arraybuffer');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=system_report.pdf');
        return res.end(Buffer.from(pdfBuffer));
      } catch (pdfError) {
        console.error('PDF generation failed:', pdfError);
        return res.status(500).json({ 
          success: false,
          error: 'PDF generation failed',
          details: pdfError.message
        });
      }
    }

    // Return JSON response
    res.json({
      success: true,
      generated_at: new Date(),
      data: results
    });

  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate report',
      details: error.message
    });
  }
};