const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("../"));

const PORT = process.env.PORT || 3000;

// Fichier de sauvegarde
const playersFile = path.join(__dirname, "players.json");

// Charger les joueurs existants
let players = {};

if (fs.existsSync(playersFile)) {
    try {
        const fileData = fs.readFileSync(playersFile, "utf8");

        if (fileData.trim() !== "") {
            players = JSON.parse(fileData);
        }

        console.log("Joueurs chargés depuis players.json");
    } catch (error) {
        console.log("Erreur lors du chargement de players.json");
        players = {};
    }
}

// Page d'accueil
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
});

// Sauvegarder un joueur
app.post("/player/save", (req, res) => {

    const data = req.body;

    if (!data.username) {
        return res.status(400).json({
            error: "Pseudo manquant"
        });
    }

    // Mettre à jour les données du joueur
    players[data.username] = data;

    // Écrire dans players.json
    try {

        fs.writeFileSync(
            playersFile,
            JSON.stringify(players, null, 2),
            "utf8"
        );

        console.log("Joueur sauvegardé :", data.username);

        res.json({
            success: true
        });

    } catch (error) {

        console.error("Erreur lors de la sauvegarde :", error);

        res.status(500).json({
            error: "Impossible de sauvegarder le joueur"
        });

    }

});

// Charger un joueur
app.get("/player/:username", (req, res) => {

    const username = req.params.username;

    if (!players[username]) {
        return res.status(404).json({
            error: "Joueur introuvable"
        });
    }

    res.json(players[username]);

});

// Voir tous les joueurs
app.get("/players", (req, res) => {

    res.json(Object.values(players));

});

// Lancer le serveur
app.listen(PORT, () => {

    console.log("================================");
    console.log("        MINE IT SERVER");
    console.log("================================");
    console.log("Serveur lancé !");
    console.log("http://localhost:3000");
    console.log("================================");

});