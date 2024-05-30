const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Create a new course
app.post('/courses', (req, res) => {
    const { title, description, duration } = req.body;
    const sql = 'INSERT INTO courses (title, description, duration) VALUES (?, ?, ?)';
    db.query(sql, [title, description, duration], (err, result) => {
        if (err) {
            console.error('Error inserting course:', err);
            return res.status(500).send({ error: 'Error inserting course' });
        }
        res.status(201).send({ id: result.insertId, title, description, duration });
    });
});

// Read all courses
app.get('/courses', (req, res) => {
    const sql = 'SELECT * FROM courses';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching courses:', err);
            return res.status(500).send({ error: 'Error fetching courses' });
        }
        res.send(results);
    });
});

// Read a single course by ID
app.get('/courses/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM courses WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error fetching course:', err);
            return res.status(500).send({ error: 'Error fetching course' });
        }
        if (result.length === 0) {
            return res.status(404).send({ message: 'Course not found' });
        }
        res.send(result[0]);
    });
});

// Update a course by ID
app.put('/courses/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, duration } = req.body;
    const sql = 'UPDATE courses SET title = ?, description = ?, duration = ? WHERE id = ?';
    db.query(sql, [title, description, duration, id], (err, result) => {
        if (err) {
            console.error('Error updating course:', err);
            return res.status(500).send({ error: 'Error updating course' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Course not found' });
        }
        res.send({ id, title, description, duration });
    });
});

// Delete a course by ID
app.delete('/courses/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM courses WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting course:', err);
            return res.status(500).send({ error: 'Error deleting course' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Course not found' });
        }
        res.status(204).send();
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
