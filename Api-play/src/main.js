import './style.css'
import javascriptLogo from './javascript.svg'
import { setupCounter } from './counter.js'

// Fonction pour afficher les données dans un tableau
function displayTokenData(data) {
  const tableContainer = document.getElementById('token-table');
  
  if (Array.isArray(data)) {
    // Affichage de liste de tokens
    tableContainer.innerHTML = `
      <h3>📊 Liste des Tokens</h3>
      <div class="table-wrapper">
        <table class="token-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Nom</th>
              <th>Mint Address</th>
              <th>Prix (SOL)</th>
              <th>Market Cap</th>
              <th>SOL Reserves</th>
              <th>Progress (%)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(token => `
              <tr>
                <td><strong>${token.symbol || 'N/A'}</strong></td>
                <td>${token.name || 'N/A'}</td>
                <td class="mint-address">${token.mint?.substring(0, 8)}...${token.mint?.substring(-8) || 'N/A'}</td>
                <td>${token.price_per_token?.toFixed(10) || 'N/A'}</td>
                <td>$${token.market_cap?.toLocaleString() || 'N/A'}</td>
                <td>${(token.virtual_sol_reserves / 1000000000).toFixed(2)} SOL</td>
                <td>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: ${token.bonding_curve_progress || 0}%"></div>
                    <span class="progress-text">${token.bonding_curve_progress?.toFixed(1) || 0}%</span>
                  </div>
                </td>
                <td><span class="status ${token.complete ? 'complete' : 'active'}">${token.complete ? '✅ Complete' : '🟡 Active'}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else if (data.data) {
    // Affichage d'un token unique
    const token = data.data;
    tableContainer.innerHTML = `
      <h3>📊 Détails du Token</h3>
      <div class="token-details">
        <div class="detail-grid">
          <div class="detail-item">
            <label>🔗 Mint Address:</label>
            <span class="mint-address">${token.mint || 'N/A'}</span>
          </div>
          <div class="detail-item">
            <label>🏦 Bonding Curve:</label>
            <span class="address">${token.bonding_curve || 'N/A'}</span>
          </div>
          <div class="detail-item">
            <label>💰 Virtual Token Reserves:</label>
            <span>${token.virtual_token_reserves?.toLocaleString() || 'N/A'}</span>
          </div>
          <div class="detail-item">
            <label>💎 Virtual SOL Reserves:</label>
            <span>${(token.virtual_sol_reserves / 1000000000)?.toFixed(2) || 'N/A'} SOL</span>
          </div>
          <div class="detail-item">
            <label>🪙 Token Total Supply:</label>
            <span>${token.token_total_supply?.toLocaleString() || 'N/A'}</span>
          </div>
          <div class="detail-item">
            <label>💵 Prix par Token:</label>
            <span>${token.price_per_token?.toFixed(10) || 'N/A'} SOL</span>
          </div>
          <div class="detail-item">
            <label>📈 Market Cap:</label>
            <span>$${token.market_cap?.toLocaleString() || 'N/A'}</span>
          </div>
          <div class="detail-item">
            <label>🎯 Progress:</label>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${token.bonding_curve_progress || 0}%"></div>
              <span class="progress-text">${token.bonding_curve_progress?.toFixed(1) || 0}%</span>
            </div>
          </div>
          <div class="detail-item">
            <label>✅ Status:</label>
            <span class="status ${token.complete ? 'complete' : 'active'}">${token.complete ? 'Complete' : 'Active'}</span>
          </div>
        </div>
      </div>
    `;
  }
}

// Fonction pour tester l'API via le proxy
async function testSingleToken() {
  const resultDiv = document.getElementById('api-result');
  const loadingDiv = document.getElementById('loading');
  
  loadingDiv.style.display = 'block';
  resultDiv.innerHTML = '';
  
  try {
    const response = await fetch('http://localhost:3000/pumpfun-demo');
    const data = await response.json();
    
    resultDiv.innerHTML = '<h3>✅ Données reçues avec succès !</h3>';
    displayTokenData(data);
  } catch (error) {
    console.error('Erreur:', error);
    resultDiv.innerHTML = `
      <h3>❌ Erreur :</h3>
      <p style="color: red;">${error.message}</p>
    `;
  } finally {
    loadingDiv.style.display = 'none';
  }
}

// Fonction pour tester la liste de tokens
async function testTokenList() {
  const resultDiv = document.getElementById('api-result');
  const loadingDiv = document.getElementById('loading');
  
  loadingDiv.style.display = 'block';
  resultDiv.innerHTML = '';
  
  try {
    const response = await fetch('http://localhost:3000/pumpfun-list');
    const data = await response.json();
    
    resultDiv.innerHTML = '<h3>✅ Liste des tokens reçue avec succès !</h3>';
    displayTokenData(data.data);
  } catch (error) {
    console.error('Erreur:', error);
    resultDiv.innerHTML = `
      <h3>❌ Erreur :</h3>
      <p style="color: red;">${error.message}</p>
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
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>🚀 PumpFun API Dashboard</h1>
    
    <div class="card">
      <div id="server-status" style="margin-bottom: 20px;"></div>
      
      <div class="button-group">
        <button id="test-single" type="button">
          � Token Unique
        </button>
        
        <button id="test-list" type="button">
          📊 Liste des Tokens
        </button>
      </div>
      
      <div id="loading" style="display: none; margin: 20px 0;">
        <p>⏳ Chargement des données...</p>
      </div>
      
      <div id="api-result" style="margin-top: 20px;"></div>
      
      <div id="token-table" style="margin-top: 20px;"></div>
      
      <button id="counter" type="button"></button>
    </div>
    
    <div class="info-card">
      <h3>📡 Informations de l'API</h3>
      <p><strong>Serveur:</strong> http://localhost:3000</p>
      <p><strong>Endpoints:</strong></p>
      <ul>
        <li>GET /pumpfun-demo - Token unique (demo)</li>
        <li>GET /pumpfun-list - Liste de tokens (demo)</li>
        <li>POST /pumpfun - API réelle (si disponible)</li>
      </ul>
    </div>
  </div>
`

// Attacher les événements
document.getElementById('test-single').addEventListener('click', testSingleToken);
document.getElementById('test-list').addEventListener('click', testTokenList);

// Tester la santé du serveur au chargement
testServerHealth();

// Vérifier la santé du serveur toutes les 10 secondes
setInterval(testServerHealth, 10000);

setupCounter(document.querySelector('#counter'))
