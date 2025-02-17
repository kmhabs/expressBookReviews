const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
 return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const { username, password } = req.body;

    // Vérifier si les champs sont fournis
    if (!username || !password) {
        return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis." });
    }

    // Vérifier si l'utilisateur est authentifié
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Identifiants incorrects." });
    }

    // Générer un token JWT
    const accessToken = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });

    // Enregistrer la session
    req.session.authorization = { accessToken, username };

    return res.status(200).json({ message: "Connexion réussie !", token: accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { review } = req.body;
    const username = req.session.authorization?.username;

    if (!username) {
        return res.status(401).json({ message: "Utilisateur non authentifié." });
    }

    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Livre non trouvé." });
    }

    // Ajouter ou modifier la critique
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }
    
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Critique ajoutée/modifiée avec succès.", reviews: books[isbn].reviews });
});


// 🔹 Tâche 9 : Supprimer une critique de livre
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;

    // Vérifier si l'utilisateur est connecté
    if (!username) {
        return res.status(401).json({ message: "Veuillez vous connecter pour supprimer une critique." });
    }

    // Vérifier si le livre existe
    if (!books[isbn]) {
        return res.status(404).json({ message: "Livre non trouvé." });
    }

    // Vérifier si l'utilisateur a une critique sur ce livre
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Aucune critique trouvée pour cet utilisateur." });
    }

    // Supprimer la critique
    delete books[isbn].reviews[username];

    return res.status(200).json({ message: "Critique supprimée avec succès." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
