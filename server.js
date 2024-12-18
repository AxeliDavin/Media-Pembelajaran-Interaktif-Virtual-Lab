const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const pg = require('pg');
const app = express();
require('dotenv').config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
})

pool.connect((err) => {
    if (err) throw err
    console.log("Connected to postgres")
})

module.exports = pool

let initialPath = path.join(__dirname, "public");

app.use(bodyParser.json());
app.use(express.static(initialPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(initialPath, "index.html"));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(initialPath, "register.html"));
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(initialPath, "index.html"));
});

app.get('/pertanyaan', (req, res) => {
    res.sendFile(path.join(initialPath, "pertanyaan.html"));
});

app.post('/register-user', (req, res) => {
    const { username, password } = req.body;

    if (!username.length || !password.length) {
        return res.status(400).json('Fill all the fields');
    }

    bcrypt.hash(password, 10)
        .then(hashedPassword => {
            pool.query('SELECT * FROM users WHERE username = $1', [username])
                .then(result => {
                    if (result.rows.length > 0) {
                        return res.status(400).json('Username already exists');
                    }

                    pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING username', [username, hashedPassword])
                        .then(data => {
                            res.json(data.rows[0]);
                        })
                        .catch(err => {
                            console.error('Error during registration:', err);
                            res.status(500).json('Internal server error');
                        });
                })
                .catch(err => {
                    console.error('Error checking username existence:', err);
                    res.status(500).json('Internal server error');
                });
        })
        .catch(err => {
            console.error('Error hashing password:', err);
            res.status(500).json('Internal server error');
        });
});

app.post('/login-user', (req, res) => {
    const { username, password } = req.body;

    if (!username.length || !password.length) {
        return res.status(400).json('Fill all the fields');
    }

    pool.query('SELECT username, password, totalquestions, correct, wrong FROM users WHERE username = $1', [username])
        .then(result => {
            const user = result.rows[0];
            if (user) {
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        return res.status(500).json('Internal server error');
                    }
                    if (isMatch) {
                        const { totalquestions, correct, wrong } = user;
                        res.json({ username: user.username, totalquestions, correct, wrong });
                    } else {
                        res.status(400).json('Username or Password is Incorrect');
                    }
                });
            } else {
                res.status(400).json('Username or Password is Incorrect');
            }
        })
        .catch(err => {
            console.error('Error during login:', err);
            res.status(500).json('Internal server error');
        });
});

app.post('/update-score', (req, res) => {
    const { username, totalQuestions, correctAnswers, wrongAnswers } = req.body;

    pool.query(
        'UPDATE users SET totalquestions = $1, correct = $2, wrong = $3 WHERE username = $4',
        [totalQuestions, correctAnswers, wrongAnswers, username]
    )
        .then(result => {
            if (result.rowCount > 0) {
                res.json({ success: true });
            } else {
                res.status(404).json({ success: false, message: "User not found" });
            }
        })
        .catch(err => res.status(500).json({ success: false, message: "Error updating score" }));
});

app.listen(process.env.PORT, () => {
    console.log('listening on port 3000.....');
});

module.exports = app;
