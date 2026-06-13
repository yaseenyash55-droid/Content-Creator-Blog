const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(cors());
app.use(express.json());

// Connect to SQLite Database (This automatically creates a file called 'blog.db')
const db = new sqlite3.Database('./blog.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('✅ Connected to the SQLite database.');
        
        // Create the 'posts' table if it doesn't exist yet
        db.run(`CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            content TEXT,
            status TEXT
        )`);
    }
});

// Search and Get All Posts
app.get('/api/posts', (req, res) => {
    const { search } = req.query;
    let sql = `SELECT * FROM posts ORDER BY id DESC`;
    let params = [];
    
    if (search) {
        sql = `SELECT * FROM posts WHERE title LIKE ? ORDER BY id DESC`;
        params = [`%${search}%`];
    }
    
    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Create Post
app.post('/api/posts', (req, res) => {
    const { title, content, status } = req.body;
    const sql = `INSERT INTO posts (title, content, status) VALUES (?, ?, ?)`;
    
    db.run(sql, [title, content, status], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, title, content, status });
    });
});

// Update Post
app.put('/api/posts/:id', (req, res) => {
    const { title, content, status } = req.body;
    const sql = `UPDATE posts SET title = ?, content = ?, status = ? WHERE id = ?`;
    
    db.run(sql, [title, content, status, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: req.params.id, title, content, status });
    });
});

// Delete Post
app.delete('/api/posts/:id', (req, res) => {
    const sql = `DELETE FROM posts WHERE id = ?`;
    
    db.run(sql, req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(204).send();
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`));