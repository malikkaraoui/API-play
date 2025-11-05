// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

// Désactiver la vérification des certificats SSL globalement
// ⚠️ Attention: Ceci est pour le développement uniquement
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();

// Middleware pour permettre les requêtes CORS
app.use(cors());
app.use(express.json());

// Route proxy pour l'API pumpfun - nouvelle version avec GET
app.get("/pumpfun/:mint", async (req, res) => {
  try {
    const { mint } = req.params;
    console.log(`🔄 Requête GET reçue pour /pumpfun/${mint}`);
    
    const response = await fetch(`https://api.pumpfunapis.com/api/bonding-curve/${mint}`, {
      method: "GET",
      headers: { 
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive"
      }
    });
    
    console.log(`📡 Statut de la réponse: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erreur HTTP ${response.status}:`, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log("✅ Réponse de l'API reçue avec succès");
    console.log("📊 Données:", JSON.stringify(data, null, 2));
    res.json(data);
  } catch (error) {
    console.error("❌ Erreur lors de la requête:", error.message);
    console.error("🔍 Type d'erreur:", error.type);
    console.error("🔍 Code d'erreur:", error.code);
    
    res.status(500).json({ 
      error: "Erreur lors de la requête vers l'API", 
      details: error.message,
      type: error.type || "unknown",
      code: error.code || "unknown"
    });
  }
});

// Route POST pour compatibilité avec l'ancien code
app.post("/pumpfun", async (req, res) => {
  try {
    const { token, mint } = req.body;
    const mintAddress = token || mint;
    
    if (!mintAddress) {
      return res.status(400).json({ 
        error: "Adresse mint manquante", 
        details: "Veuillez fournir 'token' ou 'mint' dans le body" 
      });
    }
    
    console.log(`🔄 Requête POST reçue, redirection vers GET avec mint: ${mintAddress}`);
    
    // Faire un appel direct à l'API
    const response = await fetch(`https://api.pumpfunapis.com/api/bonding-curve/${mintAddress}`, {
      method: "GET",
      headers: { 
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept": "application/json"
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("❌ Erreur lors de la requête POST:", error.message);
    res.status(500).json({ 
      error: "Erreur lors de la requête vers l'API", 
      details: error.message 
    });
  }
});

// Route avec données simulées pour tester l'interface
app.get("/pumpfun-demo", (req, res) => {
  console.log("📊 Requête pour données de démonstration");
  
  // Données simulées basées sur la documentation
  const demoData = {
    success: true,
    data: {
      mint: "2ZnL2kwYxu2HJGuusJ9wkauNL2zkvndsisjVaVyppump",
      bonding_curve: "CEn9MQ2k6viLe7nagYn7Yimbn3aDg2qbACHN64FgeAqu",
      associated_bonding_curve: "84nW9335QSyDJBmAPLac3CXguz4TFVtSCvosRb6Tjsym",
      virtual_token_reserves: 1072996765347341,
      virtual_sol_reserves: 30000090445,
      token_total_supply: 1000000000000000,
      complete: false,
      real_token_reserves: 927003234652659,
      real_sol_reserves: 79999909555,
      price_per_token: 0.0000000279,
      market_cap: 27900000,
      bonding_curve_progress: 79.99
    }
  };
  
  res.json(demoData);
});

// Route pour obtenir plusieurs tokens (simulation)
app.get("/pumpfun-list", (req, res) => {
  console.log("📊 Requête pour liste de tokens de démonstration");
  
  const tokenList = [
    {
      mint: "2ZnL2kwYxu2HJGuusJ9wkauNL2zkvndsisjVaVyppump",
      symbol: "PUMP",
      name: "PumpFun Token",
      virtual_sol_reserves: 30000090445,
      price_per_token: 0.0000000279,
      market_cap: 27900000,
      complete: false,
      bonding_curve_progress: 79.99
    },
    {
      mint: "3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh",
      symbol: "DEMO",
      name: "Demo Token",
      virtual_sol_reserves: 25000000000,
      price_per_token: 0.0000000156,
      market_cap: 15600000,
      complete: true,
      bonding_curve_progress: 100
    },
    {
      mint: "4Nc8V4K8tTYxwzLMpXK5Kq7FmNZj5tYcKDsGqv5pump",
      symbol: "TEST",
      name: "Test Coin",
      virtual_sol_reserves: 15000000000,
      price_per_token: 0.0000000089,
      market_cap: 8900000,
      complete: false,
      bonding_curve_progress: 45.50
    }
  ];
  
  res.json({ success: true, data: tokenList });
});
app.get("/", (req, res) => {
  res.json({ 
    message: "Serveur proxy PumpFun API actif!", 
    endpoints: {
      "GET /pumpfun/:mint": "Récupérer les données de bonding curve",
      "POST /pumpfun": "Compatibilité ancienne version (avec token dans body)",
      "GET /health": "Statut de santé du serveur"
    },
    status: "running",
    example: {
      "GET": "http://localhost:3000/pumpfun/2ZnL2kwYxu2HJGuusJ9wkauNL2zkvndsisjVaVyppump",
      "POST": {
        "url": "http://localhost:3000/pumpfun",
        "body": { "token": "2ZnL2kwYxu2HJGuusJ9wkauNL2zkvndsisjVaVyppump" }
      }
    }
  });
});

// Route de santé
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    api: "PumpFun Bonding Curve API Proxy"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur proxy PumpFun démarré sur http://localhost:${PORT}`);
  console.log(`📡 Endpoints disponibles:`);
  console.log(`   GET  /pumpfun/:mint`);
  console.log(`   POST /pumpfun`);
  console.log(`   GET  /health`);
  console.log(`🌟 Exemple: http://localhost:${PORT}/pumpfun/2ZnL2kwYxu2HJGuusJ9wkauNL2zkvndsisjVaVyppump`);
});