const config = require('../crypto/config.js');
const jwt = require('jsonwebtoken');

function generatorToken(user) {
    return jwt.sign({ user: user.id }, config.hashedSecret, {
      expiresIn: '1h',
    });
  }

  function verifyToken(req, res, next) {
    const token = req.session.token;
    if (!token) {
      return res.status(401).send(`<h3>ERROR</h3>
      <p>Token no generado! Debes iniciar sesión.</p> 
      <hr>
      <a href="/">Home</a>`);
    }
  
  
    jwt.verify(token, config.hashedSecret, (err, decoded) => {
      if (err) {
        return res.status(401).send(`<h3>ERROR</h3>
        <p>Token no válido! Debes iniciar sesión.</p> 
        <hr>
        <a href="/">Home</a>`);
      }

      req.user = decoded.user;
      console.log(decoded);
      next();
    });
  }
  
  module.exports = { generatorToken, verifyToken };