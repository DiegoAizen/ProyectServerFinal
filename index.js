const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use(session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false, 
      httpOnly: true,
      maxAge: 3600000 
    }
  }));
  
app.use("/customer/auth/*", (req, res, next) => {
    if (req.session && req.session.authorization && jwt.verify(req.session.authorization.accessToken, 'fingerprint_customer')) {
      next();
    } else {
      res.status(401).json({ message: "No autorizado. Por favor, inicia sesión." });
    }
  });
  
app.use("/customer", customer_routes);
app.use("/", genl_routes);

const port = 5000;
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});