const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis." });
    }

    if (users.find(user => user.username === username)) {
        return res.status(409).json({ message: "Nom d'utilisateur déjà pris." });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "Utilisateur enregistré avec succès !" });

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
//public_users.get('/',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
 // return res.status(200).json(books);
//});

public_users.get('/', async (req, res) => {
    try {
        // Simuler une requête externe avec Axios (ici on utilise nos propres données)
        const response = await new Promise((resolve) => {
            setTimeout(() => resolve({ data: books }), 500); // Simule un délai de 500ms
        });
        
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la récupération des livres." });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const book = books[isbn];

        if (!book) {
            return res.status(404).json({ message: "Livre non trouvé" });
        }

        // Simuler une requête externe avec Axios
        const response = await new Promise((resolve) => {
            setTimeout(() => resolve({ data: book }), 500);
        });

        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la récupération du livre." });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author;
        const filteredBooks = Object.values(books).filter(book => book.author === author);

        if (filteredBooks.length === 0) {
            return res.status(404).json({ message: "Aucun livre trouvé pour cet auteur" });
        }

        const response = await new Promise((resolve) => {
            setTimeout(() => resolve({ data: filteredBooks }), 500);
        });

        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la récupération des livres." });
    }
});

// Tâche 13 : Obtenir les détails des livres par titre avec async/await et Axios
public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title;
        const filteredBooks = Object.values(books).filter(book => book.title === title);

        if (filteredBooks.length === 0) {
            return res.status(404).json({ message: "Aucun livre trouvé avec ce titre" });
        }

        const response = await new Promise((resolve) => {
            setTimeout(() => resolve({ data: filteredBooks }), 500);
        });

        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la récupération des livres." });
    }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
      const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Livre non trouvé." });
    }
});

module.exports.general = public_users;
