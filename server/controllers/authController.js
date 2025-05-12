const db = require('../../config/config');

exports.registerUser = (req, res) => {
    const { firstName, lastName, email, password, role = 'player' } = req.body; // Default role is 'player'

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    db.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (results.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        db.query(
            'INSERT INTO user (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)',
            [firstName, lastName, email, password, role],
            (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ 
                    message: 'User registered successfully',
                    userId: result.insertId,
                    role: role // Include role in response
                });
            }
        );
    });
};

// loginUser remains exactly the same
exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    db.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = results[0];
        
        if (password !== user.password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.status(200).json({ 
            message: 'Login successful',
            user: {
                id: user.user_id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                role: user.role
            }
        });
    });
};