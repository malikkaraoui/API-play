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

// Route pour acheter des tokens - POST /api/buy
app.post("/pumpfun/buy", async (req, res) => {
  try {
    const { private_key, mint, sol_in, slippage, priorityFee } = req.body;
    
    console.log(`� Requête d'achat reçue pour le token: ${mint}`);
    console.log(`💰 Montant SOL: ${sol_in}, Slippage: ${slippage}%`);
    
    // Validation des paramètres requis
    if (!private_key || !mint || !sol_in || slippage === undefined) {
      return res.status(400).json({ 
        error: "Paramètres manquants", 
        details: "private_key, mint, sol_in et slippage sont requis" 
      });
    }
    
    // Pour la démonstration, nous simulons un achat réussi
    // En production, ceci ferait un vrai appel à l'API Pump.fun
    const demoResponse = {
      status: "success",
      message: "Buy transaction confirmed.",
      tx_signature: `5wVaP${Math.random().toString(36).substr(2, 9)}riJa`,
      solscan_url: `https://solscan.io/tx/5wVaP${Math.random().toString(36).substr(2, 9)}riJa`,
      details: {
        mint: mint,
        sol_spent: sol_in,
        slippage_used: slippage,
        priority_fee: priorityFee || 0.0001,
        estimated_tokens: Math.floor(Math.random() * 1000000) + 100000
      }
    };
    
    // Simuler un délai de transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("✅ Transaction d'achat simulée avec succès");
    res.json(demoResponse);
  } catch (error) {
    console.error("❌ Erreur lors de l'achat:", error.message);
    res.status(500).json({ 
      error: "Erreur lors de la transaction d'achat", 
      details: error.message 
    });
  }
});

// Route pour vendre des tokens - POST /api/sell
app.post("/pumpfun/sell", async (req, res) => {
  try {
    const { private_key, mint, percentage, slippage, priorityFee } = req.body;
    
    console.log(`💸 Requête de vente reçue pour le token: ${mint}`);
    console.log(`📊 Pourcentage: ${percentage}%, Slippage: ${slippage}%`);
    
    // Validation des paramètres requis
    if (!private_key || !mint || !percentage || slippage === undefined) {
      return res.status(400).json({ 
        error: "Paramètres manquants", 
        details: "private_key, mint, percentage et slippage sont requis" 
      });
    }
    
    // Pour la démonstration, nous simulons une vente réussie
    const demoResponse = {
      status: "success",
      message: "Sell transaction confirmed.",
      tx_signature: `8hTgM${Math.random().toString(36).substr(2, 9)}ke7X`,
      solscan_url: `https://solscan.io/tx/8hTgM${Math.random().toString(36).substr(2, 9)}ke7X`,
      details: {
        mint: mint,
        percentage_sold: percentage,
        slippage_used: slippage,
        priority_fee: priorityFee || 0.0001,
        estimated_sol_received: (Math.random() * 10).toFixed(4)
      }
    };
    
    // Simuler un délai de transaction
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("✅ Transaction de vente simulée avec succès");
    res.json(demoResponse);
  } catch (error) {
    console.error("❌ Erreur lors de la vente:", error.message);
    res.status(500).json({ 
      error: "Erreur lors de la transaction de vente", 
      details: error.message 
    });
  }
});

// Route pour simuler un portefeuille de tokens
app.get("/pumpfun/wallet/:address", async (req, res) => {
  try {
    const { address } = req.params;
    console.log(`� Requête de portefeuille pour: ${address}`);
    
    // Simulation d'un portefeuille avec différents tokens
    const walletData = {
      success: true,
      wallet_address: address,
      sol_balance: (Math.random() * 100 + 10).toFixed(4),
      tokens: [
        {
          mint: "2ZnL2kwYxu2HJGuusJ9wkauNL2zkvndsisjVaVyppump",
          symbol: "PUMP",
          name: "PumpFun Token",
          balance: Math.floor(Math.random() * 10000000) + 50000,
          value_sol: (Math.random() * 5 + 0.1).toFixed(4),
          value_usd: (Math.random() * 500 + 10).toFixed(2)
        },
        {
          mint: "3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh",
          symbol: "DEMO",
          name: "Demo Token", 
          balance: Math.floor(Math.random() * 5000000) + 25000,
          value_sol: (Math.random() * 3 + 0.05).toFixed(4),
          value_usd: (Math.random() * 300 + 5).toFixed(2)
        }
      ],
      total_value_sol: 0,
      total_value_usd: 0
    };
    
    // Calculer les totaux
    walletData.total_value_sol = walletData.tokens.reduce((sum, token) => 
      sum + parseFloat(token.value_sol), 0).toFixed(4);
    walletData.total_value_usd = walletData.tokens.reduce((sum, token) => 
      sum + parseFloat(token.value_usd), 0).toFixed(2);
    
    res.json(walletData);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du portefeuille:", error.message);
    res.status(500).json({ 
      error: "Erreur lors de la récupération du portefeuille", 
      details: error.message 
    });
  }
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