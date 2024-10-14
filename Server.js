const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());

const posts = [
  { name: "CBIT", title: "Welcome to CBIT" },
  { name: "MGIT", title: "Welcome to MGIT" }
];

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/login', (req, res) => {
  const accessToken = jwt.sign({ name: req.body.username }, process.env.ACCESS_TOKEN);
  res.json({ accessToken });
});

app.use(authenticateToken);

app.get('/posts', (req, res) => {
  const userPosts = posts.filter(post => post.name === req.user.name);
  res.json(userPosts);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
