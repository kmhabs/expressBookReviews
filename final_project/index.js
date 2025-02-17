const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    if (!req.session.authorization) {
        return res.status(403).json({ message: "Authentification requise." });
    }

    // Vérification du token JWT
    const token = req.session.authorization.accessToken;
    jwt.verify(token, "secret_key", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Token invalide ou expiré." });
        }
        req.user = decoded; // Stocker l'utilisateur authentifié
        next();
    });
});

 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
