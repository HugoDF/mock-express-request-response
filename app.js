const express = require('express');
const session = require('client-sessions')

const app = express();

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'my-super-secret',
  cookieName: 'session',
  duration: 60 * 60 * 1000 // 1 hour
}))

const { login, logout, checkAuth } = require('./express-handlers')
const headerAuth = require('./header-auth-middleware');

app.post('/session', login);
app.delete('/session', logout);
app.get('/session', headerAuth, checkAuth);

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
