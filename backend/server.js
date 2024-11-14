const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const pg = require('pg');

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
})

const app = express();

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
            db('users')
                .where({ username })
                .first()
                .then(existingUser => {
                    if (existingUser) {
                        return res.status(400).json('Username already exists');
                    }

                    db('users')
                        .insert({ username, password: hashedPassword })
                        .returning(['username'])
                        .then(data => {
                            res.json(data[0]);
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

    db.select('username', 'password', 'totalquestions', 'correct', 'wrong')
        .from('users')
        .where({ username })
        .first()
        .then(user => {
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

    db('users')
        .where({ username })
        .update({
            totalquestions: totalQuestions,
            correct: correctAnswers,
            wrong: wrongAnswers,
        })
        .then(result => {
            if (result) {
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
