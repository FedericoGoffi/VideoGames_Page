import express from 'express';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3001;

const db = new sqlite3.Database('users.db');

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
}));

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)");

    app.post('/register', (req, res) => {
        const { username, password } = req.body;
        db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            return res.status(200).json({ message: "Registration successful" });
        });
    });

    // Ruta para el inicio de sesión de usuarios
    app.post('/login', (req, res) => {
        const { username, password } = req.body;
        db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!row) {
                return res.status(401).json({ error: "Invalid username or password" });
            }
            // Genera un token de autenticación con JWT
            const token = jwt.sign({ username: row.username }, 'secret', { expiresIn: '1h' });
            return res.status(200).json({ message: "Login successful", token, username: row.username });
        });
    });
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});