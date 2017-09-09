const express = require('express');
const next = require('next');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const SECRET = process.env.SECRET || 'my-super-secret-key';
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // create a Express server
  const server = express();
  // add cookie parser middleware
  server.use(cookieParser());

  // endpoint to authenticate users
  server.post('/api/auth', (req, res) => {
    // create a JSON web token
    const token = jwt.sign({ framework: 'next' }, SECRET);
    // if we aren't receiving a AJAX request
    if (!req.headers['x-ajax']) {
      // set the JWT as the auth cookie
      res.cookie('auth', token);
      // redirect to /
      return res.status(301).redirect('/');
    }
    // return the token
    return res.status(200).send(token);
  });

  // handle requests
  server.get('*', (req, res) => {
    return handle(req, res);
  });

  // run HTTP server
  server.listen(PORT, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
