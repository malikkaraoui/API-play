// test-direct.js
// Test direct de l'API avec gestion SSL

// Désactiver la vérification SSL pour ce test
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import fetch from "node-fetch";

const token = "Ce2gx9KGXJ6C9Mp5b5x1sn9Mg87JwEbrQby4Zqo3pump";

console.log("🧪 Test DIRECT de l'API (sans proxy)");
console.log("=====================================");
console.log(`🎯 Token testé: ${token}`);
console.log("🔒 SSL verification: DISABLED");
console.log("📡 Envoi de la requête directe...");

fetch("https://api.pumpfunapis.com/coin-data/get-bonding", {
  method: "POST",
  headers: { 
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "Accept": "application/json",
    "Origin": "https://www.pumpfun.com",
    "Referer": "https://www.pumpfun.com/"
  },
  body: JSON.stringify({ token })
})
  .then(async (response) => {
    console.log(`📊 Statut HTTP: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erreur HTTP ${response.status}:`, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  })
  .then((data) => {
    console.log("✅ Réponse reçue avec succès:");
    console.log("================================");
    console.log(JSON.stringify(data, null, 2));
  })
  .catch((error) => {
    console.error("❌ Erreur lors du test direct:");
    console.error("Type:", error.type);
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    
    if (error.code === 'ERR_TLS_CERT_ALTNAME_INVALID') {
      console.log("\n💡 Le problème vient toujours du certificat SSL");
      console.log("   L'API semble avoir des problèmes de configuration SSL");
    }
  });