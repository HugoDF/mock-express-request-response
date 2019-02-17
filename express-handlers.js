const bcrypt = require('bcrypt');

const users = [
  {
    name: 'hugo',
    // generated from 'boss' with bcrypt
    // using work factor 10
    password: '$2a$10$IYTsvP51gvUfM2SvZ47acekm05qdyxQbVW5Yy2q3dPp1EipWx7clm'
  },
  {
    name: 'guest',
    // generated from 'guest-boss' with bcrypt
    // using work factor 10
    password: '$2a$10$6rfA.JiURAnuGhVAKpaoneXhsOuKBBRfKDRUgfLxMnVvQUWK5u6h2'
  }
];

function getUser(username) {
  return users.find(({ name }) => name === username);
}

async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'username and password are required' });
    }
    const user = getUser(username);
    if (!user) {
      return res.status(401).json({ message: 'No user with matching username' });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Wrong password' });
    }

    req.session.data = { username };
    return res.status(201).json();
  } catch (e) {
    console.error(`Error during login of "${req.body.username}": ${e.stack}`);
    res.status(500).json({ message: e.message });
  }
}

async function logout(req, res) {
  req.session.data = null;
  return res.status(200).json();
}

async function checkAuth(req, res) {
  if (!req.session.data) {
    return res.status(401).json();
  }
  const { username } = req.session.data;
  return res.status(200).json({ username });
}

module.exports = {
  login,
  logout,
  checkAuth,
};
