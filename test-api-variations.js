// test-api-variations.js
// Test de différentes variations de l'API pumpfun

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import fetch from "node-fetch";

const token = "Ce2gx9KGXJ6C9Mp5b5x1sn9Mg87JwEbrQby4Zqo3pump";

const tests = [
  {
    name: "API pumpfun - get-bonding",
    url: "https://api.pumpfunapis.com/coin-data/get-bonding",
    data: { token }
  },
  {
    name: "API pumpfun - alternative endpoint",
    url: "https://api.pumpfunapis.com/get-bonding",
    data: { token }
  },
  {
    name: "API pumpfun - avec mint address",
    url: "https://api.pumpfunapis.com/coin-data/get-bonding",
    data: { mint: token }
  },
  {
    name: "API pumpfun - base endpoint",
    url: "https://api.pumpfunapis.com/",
    data: { token }
  }
];

async function testAPI(test) {
  console.log(`\n🧪 Test: ${test.name}`);
  console.log(`📡 URL: ${test.url}`);
  console.log(`📦 Data: ${JSON.stringify(test.data)}`);
  console.log("─".repeat(50));

  try {
    const response = await fetch(test.url, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept": "application/json",
        "Origin": "https://www.pumpfun.com",
        "Referer": "https://www.pumpfun.com/"
      },
      body: JSON.stringify(test.data)
    });

    console.log(`📊 Statut: ${response.status} ${response.statusText}`);

    const responseText = await response.text();
    
    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        console.log("✅ Succès! Données reçues:");
        console.log(JSON.stringify(data, null, 2));
        return true;
      } catch (e) {
        console.log("✅ Succès! Réponse (non-JSON):");
        console.log(responseText);
        return true;
      }
    } else {
      console.log(`❌ Échec: ${responseText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
    return false;
  }
}

// Test également avec GET
async function testGET(url) {
  console.log(`\n🔍 Test GET: ${url}`);
  console.log("─".repeat(50));

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { 
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept": "application/json"
      }
    });

    console.log(`📊 Statut: ${response.status} ${response.statusText}`);
    const responseText = await response.text();
    
    if (response.ok) {
      console.log("✅ Réponse GET:");
      console.log(responseText.substring(0, 500) + (responseText.length > 500 ? "..." : ""));
    } else {
      console.log(`❌ Échec GET: ${responseText}`);
    }
  } catch (error) {
    console.log(`❌ Erreur GET: ${error.message}`);
  }
}

console.log("🚀 Test de variations de l'API PumpFun");
console.log("=======================================");

// Tester les variations POST
for (const test of tests) {
  const success = await testAPI(test);
  if (success) {
    console.log("🎉 Test réussi! Arrêt des autres tests.");
    break;
  }
  await new Promise(resolve => setTimeout(resolve, 1000)); // Pause entre les tests
}

// Tester quelques endpoints GET
await testGET("https://api.pumpfunapis.com/");
await testGET("https://api.pumpfunapis.com/health");
await testGET("https://api.pumpfunapis.com/status");