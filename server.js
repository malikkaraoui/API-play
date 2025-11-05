// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// Middleware pour permettre les requêtes CORS
app.use(cors());
app.use(express.json());

// Route proxy pour l'API pumpfun
app.post("/pumpfun", async (req, res) => {
  try {
    console.log("Requête reçue pour /pumpfun:", req.body);
    
    const response = await fetch("https://api.pumpfunapis.com/coin-data/get-bonding", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      },
      body: JSON.stringify(req.body)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Réponse de l'API:", data);
    res.json(data);
  } catch (error) {
    console.error("Erreur lors de la requête:", error);
    res.status(500).json({ 
      error: "Erreur lors de la requête vers l'API", 
      details: error.message 
    });
  }
});

// Route de test pour vérifier que le serveur fonctionne
app.get("/", (req, res) => {
  res.json({ 
    message: "Serveur proxy actif!", 
    endpoints: ["/pumpfun"],
    status: "running"
  });
});

// Route de santé
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur proxy démarré sur http://localhost:${PORT}`);
  console.log(`📡 Endpoint disponible: http://localhost:${PORT}/pumpfun`);
});