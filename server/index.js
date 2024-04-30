import express from 'express';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = 3001;

const db = new sqlite3.Database('users.db');

// Middleware de bodyParser para analizar el cuerpo de las solicitudes JSON
app.use(bodyParser.json());

// Middleware de CORS para permitir solicitudes desde todos los origenes
app.use(cors({
    origin: 'http://localhost:5173', // Reemplaza esto con el origen de tu aplicación React
    methods: ['GET', 'POST'], // Especifica los métodos permitidos
}));

// Middleware para permitir solicitudes desde todos los orígenes (otra forma)
/*
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // Reemplaza esto con el origen de tu aplicación React
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});
*/

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)");

    // Ruta para el registro de usuarios
    app.post('/register', (req, res) => {
        const { username, password } = req.body;
        db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
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
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
