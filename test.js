// test.js
import fetch from "node-fetch";

// Utiliser l'exemple mint de la documentation
const token = "2ZnL2kwYxu2HJGuusJ9wkauNL2zkvndsisjVaVyppump";

console.log("🚀 Test de l'API PumpFun via le proxy local");
console.log("===========================================");
console.log(`🎯 Token testé: ${token}`);
console.log("📡 Envoi de la requête...");

fetch("http://localhost:3000/pumpfun", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ token })
})
  .then(async (response) => {
    console.log(`📊 Statut HTTP: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erreur HTTP ${response.status}:`, errorText);
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return response.json();
  })
  .then((data) => {
    console.log("✅ Réponse reçue avec succès:");
    console.log("================================");
    
    if (data.success && data.data) {
      const bondingData = data.data;
      console.log("📊 DONNÉES DE BONDING CURVE:");
      console.log("────────────────────────────");
      console.log(`🔗 Mint: ${bondingData.mint}`);
      console.log(`🏦 Bonding Curve: ${bondingData.bonding_curve}`);
      console.log(`💰 Virtual Token Reserves: ${bondingData.virtual_token_reserves?.toLocaleString() || 'N/A'}`);
      console.log(`💎 Virtual SOL Reserves: ${bondingData.virtual_sol_reserves?.toLocaleString() || 'N/A'} SOL`);
      console.log(`🪙 Token Total Supply: ${bondingData.token_total_supply?.toLocaleString() || 'N/A'}`);
      console.log(`✅ Complete: ${bondingData.complete ? 'Oui' : 'Non'}`);
      
      if (bondingData.associated_bonding_curve) {
        console.log(`🔗 Associated Bonding Curve: ${bondingData.associated_bonding_curve}`);
      }
    } else {
      console.log("📋 Réponse complète:");
      console.log(JSON.stringify(data, null, 2));
    }
  })
  .catch((error) => {
    console.error("❌ Erreur lors du test:");
    console.error(error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log("\n💡 Solutions possibles:");
      console.log("   1. Démarrez le serveur proxy: npm start");
      console.log("   2. Vérifiez que le port 3000 est libre");
      console.log("   3. Attendez quelques secondes après le démarrage");
    }
  });