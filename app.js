const express = require('express');
const app = express();
const usersRoutes = require('./routes/routes.js');
const config = require('./crypto/config.js');
const session = require('express-session');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
      secret: config.hashedSecret,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    })
  );

app.use('/', usersRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Express está escuchando en el puerto ${PORT}`);
  });