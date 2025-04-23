// server.js
/*
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Données temporaires (mock)
let tasks = [
  { id: 1, title: 'Apprendre Express', completed: false },
  { id: 2, title: 'Créer une API REST', completed: false }
];

// Routes de base
app.get('/', (req, res) => {
  res.json({ message: 'API opérationnelle' });
});

// Routes API - CRUD tâches
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });
  res.json(task);
});

app.post('/api/tasks', (req, res) => {
  const newTask = {
    id: tasks.length + 1,
    title: req.body.title,
    completed: false
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});
// Route pour mettre à jour une tâche
app.put('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return res.status(404).json({ error: 'Tâche non trouvée' });
  
    const updatedTask = {
      ...tasks[taskIndex],
      ...req.body // on peut envoyer { title: "...", completed: true }
    };
  
    tasks[taskIndex] = updatedTask;
    res.json(updatedTask);
  });
  
  // Route pour supprimer une tâche
  app.delete('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return res.status(404).json({ error: 'Tâche non trouvée' });
  
    tasks.splice(taskIndex, 1);
    res.status(204).end(); // 204 = No Content
    res.json({ message: 'Tâche supprimée' });
  });
  
// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
//////
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// GET toutes les tâches
app.get('/api/tasks', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM tasks');
  res.json(rows);
});

// POST une nouvelle tâche
app.post('/api/tasks', async (req, res) => {
  const { title } = req.body;
  await pool.query('INSERT INTO tasks (title, completed) VALUES (?, ?)', [title, false]);
  res.status(201).json({ message: 'Tâche ajoutée' });
});

// PUT mettre à jour une tâche
app.put('/api/tasks/:id', async (req, res) => {
  const { title, completed } = req.body;
  await pool.query('UPDATE tasks SET title = ?, completed = ? WHERE id = ?', [title, completed, req.params.id]);
  res.json({ message: 'Tâche mise à jour' });
});

// DELETE une tâche
app.delete('/api/tasks/:id', async (req, res) => {
  await pool.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
  res.json({ message: 'Tâche supprimée' });
});

app.listen(PORT, () => {
  console.log(`Serveur API sur http://localhost:${PORT}`);
});
*/
// api-server/server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Connexion MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // change si besoin
  database: 'task_db'
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base:', err);
    return;
  }
  console.log('Connecté à MySQL');
});

// Routes API
app.get('/api/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  db.query('INSERT INTO tasks (title) VALUES (?)', [title], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId, title });
  });
});

app.put('/api/tasks/:id', (req, res) => {
  const { title } = req.body;
  const { id } = req.params;
  db.query('UPDATE tasks SET title = ? WHERE id = ?', [title, id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ id, title });
  });
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tasks WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Tâche supprimée' });
  });
});

app.listen(5000, () => {
  console.log('Serveur backend en écoute sur http://localhost:5000');
});
