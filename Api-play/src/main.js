import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

// Fonction pour tester l'API via le proxy
async function testAPIProxy() {
  const resultDiv = document.getElementById('api-result');
  const loadingDiv = document.getElementById('loading');
  
  // Afficher le loading
  loadingDiv.style.display = 'block';
  resultDiv.innerHTML = '';
  
  try {
    // Exemple de requête vers notre proxy
    const response = await fetch('http://localhost:3000/pumpfun', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Ajouter ici les paramètres nécessaires pour l'API pumpfun
        // Exemple de structure (à adapter selon l'API)
        token: 'example-token',
        action: 'get-bonding'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Afficher le résultat
    resultDiv.innerHTML = `
      <h3>✅ Réponse de l'API :</h3>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `;
  } catch (error) {
    console.error('Erreur:', error);
    resultDiv.innerHTML = `
      <h3>❌ Erreur :</h3>
      <p style="color: red;">${error.message}</p>
      <p>Assurez-vous que le serveur proxy est démarré sur le port 3000</p>
    `;
  } finally {
    loadingDiv.style.display = 'none';
  }
}

// Fonction pour tester la santé du serveur
async function testServerHealth() {
  try {
    const response = await fetch('http://localhost:3000/health');
    const data = await response.json();
    document.getElementById('server-status').innerHTML = `
      <span style="color: green;">🟢 Serveur actif - ${data.timestamp}</span>
    `;
  } catch (error) {
    document.getElementById('server-status').innerHTML = `
      <span style="color: red;">🔴 Serveur inactif</span>
    `;
  }
}

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>API Proxy Test</h1>
    
    <div class="card">
      <div id="server-status" style="margin-bottom: 20px;"></div>
      
      <button id="test-api" type="button">
        🚀 Tester l'API via le Proxy
      </button>
      
      <div id="loading" style="display: none; margin: 20px 0;">
        <p>⏳ Requête en cours...</p>
      </div>
      
      <div id="api-result" style="margin-top: 20px; text-align: left;"></div>
      
      <button id="counter" type="button"></button>
    </div>
    
    <div class="info-card">
      <h3>📡 Informations du Proxy</h3>
      <p><strong>Serveur:</strong> http://localhost:3000</p>
      <p><strong>Endpoint API:</strong> /pumpfun</p>
      <p><strong>Cible:</strong> https://api.pumpfunapis.com/coin-data/get-bonding</p>
    </div>
  </div>
`

// Attacher les événements
document.getElementById('test-api').addEventListener('click', testAPIProxy);

// Tester la santé du serveur au chargement
testServerHealth();

// Vérifier la santé du serveur toutes les 10 secondes
setInterval(testServerHealth, 10000);

setupCounter(document.querySelector('#counter'))
