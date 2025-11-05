import './style.css'
import { setupCounter } from './counter.js'

// Fonction pour acheter des tokens
async function buyToken() {
  const resultDiv = document.getElementById('trade-result');
  const loadingDiv = document.getElementById('loading');
  
  // Récupérer les valeurs du formulaire
  const mint = document.getElementById('mint-address').value;
  const solIn = parseFloat(document.getElementById('sol-amount').value);
  const slippage = parseFloat(document.getElementById('slippage').value);
  const priorityFee = parseFloat(document.getElementById('priority-fee').value) || 0.0001;
  
  if (!mint || !solIn || !slippage) {
    resultDiv.innerHTML = '<p style="color: red;">❌ Veuillez remplir tous les champs requis</p>';
    return;
  }
  
  loadingDiv.style.display = 'block';
  resultDiv.innerHTML = '';
  
  try {
    const response = await fetch('http://localhost:3000/pumpfun/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        private_key: 'demo_private_key_base58', // En production, utiliser une vraie clé
        mint: mint,
        sol_in: solIn,
        slippage: slippage,
        priorityFee: priorityFee
      })
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      resultDiv.innerHTML = `
        <div class="success-transaction">
          <h3>✅ Achat réussi !</h3>
          <div class="transaction-details">
            <p><strong>🔗 Transaction:</strong> <a href="${data.solscan_url}" target="_blank">${data.tx_signature}</a></p>
            <p><strong>💰 SOL dépensé:</strong> ${data.details.sol_spent} SOL</p>
            <p><strong>🪙 Tokens estimés:</strong> ${data.details.estimated_tokens.toLocaleString()}</p>
            <p><strong>📊 Slippage:</strong> ${data.details.slippage_used}%</p>
            <p><strong>⚡ Frais priorité:</strong> ${data.details.priority_fee} SOL</p>
          </div>
        </div>
      `;
    } else {
      throw new Error(data.details || 'Erreur inconnue');
    }
  } catch (error) {
    resultDiv.innerHTML = `
      <div class="error-transaction">
        <h3>❌ Erreur d'achat</h3>
        <p>${error.message}</p>
      </div>
    `;
  } finally {
    loadingDiv.style.display = 'none';
  }
}

// Fonction pour vendre des tokens
async function sellToken() {
  const resultDiv = document.getElementById('trade-result');
  const loadingDiv = document.getElementById('loading');
  
  const mint = document.getElementById('mint-address').value;
  const percentage = parseFloat(document.getElementById('sell-percentage').value);
  const slippage = parseFloat(document.getElementById('slippage').value);
  const priorityFee = parseFloat(document.getElementById('priority-fee').value) || 0.0001;
  
  if (!mint || !percentage || !slippage) {
    resultDiv.innerHTML = '<p style="color: red;">❌ Veuillez remplir tous les champs requis</p>';
    return;
  }
  
  loadingDiv.style.display = 'block';
  resultDiv.innerHTML = '';
  
  try {
    const response = await fetch('http://localhost:3000/pumpfun/sell', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        private_key: 'demo_private_key_base58',
        mint: mint,
        percentage: percentage,
        slippage: slippage,
        priorityFee: priorityFee
      })
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      resultDiv.innerHTML = `
        <div class="success-transaction">
          <h3>✅ Vente réussie !</h3>
          <div class="transaction-details">
            <p><strong>� Transaction:</strong> <a href="${data.solscan_url}" target="_blank">${data.tx_signature}</a></p>
            <p><strong>📊 Pourcentage vendu:</strong> ${data.details.percentage_sold}%</p>
            <p><strong>💰 SOL reçu (estimé):</strong> ${data.details.estimated_sol_received} SOL</p>
            <p><strong>📊 Slippage:</strong> ${data.details.slippage_used}%</p>
            <p><strong>⚡ Frais priorité:</strong> ${data.details.priority_fee} SOL</p>
          </div>
        </div>
      `;
    } else {
      throw new Error(data.details || 'Erreur inconnue');
    }
  } catch (error) {
    resultDiv.innerHTML = `
      <div class="error-transaction">
        <h3>❌ Erreur de vente</h3>
        <p>${error.message}</p>
      </div>
    `;
  } finally {
    loadingDiv.style.display = 'none';
  }
}

// Fonction pour charger un portefeuille
async function loadWallet() {
  const resultDiv = document.getElementById('wallet-result');
  const loadingDiv = document.getElementById('loading');
  
  const address = document.getElementById('wallet-address').value || 'demo_wallet_address';
  
  loadingDiv.style.display = 'block';
  resultDiv.innerHTML = '';
  
  try {
    const response = await fetch(`http://localhost:3000/pumpfun/wallet/${address}`);
    const data = await response.json();
    
    if (data.success) {
      resultDiv.innerHTML = `
        <div class="wallet-info">
          <h3>👛 Portefeuille</h3>
          <div class="wallet-summary">
            <p><strong>📍 Adresse:</strong> ${data.wallet_address.substring(0, 8)}...${data.wallet_address.substring(-8)}</p>
            <p><strong>💰 Balance SOL:</strong> ${data.sol_balance} SOL</p>
            <p><strong>💎 Valeur totale:</strong> ${data.total_value_sol} SOL (~$${data.total_value_usd})</p>
          </div>
          
          <h4>🪙 Tokens détenus:</h4>
          <div class="token-list">
            ${data.tokens.map(token => `
              <div class="token-item">
                <div class="token-info">
                  <strong>${token.symbol}</strong> - ${token.name}
                  <br>
                  <span class="token-balance">${token.balance.toLocaleString()} tokens</span>
                </div>
                <div class="token-value">
                  <span class="sol-value">${token.value_sol} SOL</span>
                  <span class="usd-value">$${token.value_usd}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else {
      throw new Error('Erreur lors du chargement du portefeuille');
    }
  } catch (error) {
    resultDiv.innerHTML = `
      <div class="error-transaction">
        <h3>❌ Erreur</h3>
        <p>${error.message}</p>
      </div>
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
    <h1>🚀 PumpFun Trading Dashboard</h1>
    
    <div class="card">
      <div id="server-status" style="margin-bottom: 20px;"></div>
      
      <!-- Trading Form -->
      <div class="trading-section">
        <h3>💱 Trading Interface</h3>
        
        <div class="form-group">
          <label for="mint-address">🔗 Token Mint Address:</label>
          <input type="text" id="mint-address" placeholder="2ZnL2kwYxu2HJGuusJ9wkauNL2zkvndsisjVaVyppump" value="2ZnL2kwYxu2HJGuusJ9wkauNL2zkvndsisjVaVyppump">
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="sol-amount">💰 SOL Amount (Buy):</label>
            <input type="number" id="sol-amount" placeholder="0.1" step="0.001" min="0.001">
          </div>
          
          <div class="form-group">
            <label for="sell-percentage">📊 Sell Percentage:</label>
            <input type="number" id="sell-percentage" placeholder="50" min="1" max="100">
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="slippage">📈 Slippage (%):</label>
            <input type="number" id="slippage" placeholder="5" min="0.1" max="50" step="0.1" value="5">
          </div>
          
          <div class="form-group">
            <label for="priority-fee">⚡ Priority Fee (SOL):</label>
            <input type="number" id="priority-fee" placeholder="0.0001" step="0.0001" value="0.0001">
          </div>
        </div>
        
        <div class="button-group">
          <button id="buy-token" type="button" class="buy-button">
            🛒 Acheter Token
          </button>
          
          <button id="sell-token" type="button" class="sell-button">
            💸 Vendre Token
          </button>
        </div>
      </div>
      
      <!-- Wallet Section -->
      <div class="wallet-section">
        <h3>� Portefeuille</h3>
        <div class="form-group">
          <label for="wallet-address">📍 Adresse du portefeuille:</label>
          <input type="text" id="wallet-address" placeholder="Adresse Solana (optionnel)">
        </div>
        <button id="load-wallet" type="button" class="wallet-button">
          🔍 Charger Portefeuille
        </button>
      </div>
      
      <div id="loading" style="display: none; margin: 20px 0;">
        <p>⏳ Transaction en cours...</p>
      </div>
      
      <div id="trade-result" style="margin-top: 20px;"></div>
      <div id="wallet-result" style="margin-top: 20px;"></div>
      
      <button id="counter" type="button"></button>
    </div>
    
    <div class="info-card">
      <h3>📡 Informations de l'API PumpFun</h3>
      <p><strong>Serveur:</strong> http://localhost:3000</p>
      <p><strong>Endpoints Trading:</strong></p>
      <ul>
        <li>POST /pumpfun/buy - Acheter des tokens</li>
        <li>POST /pumpfun/sell - Vendre des tokens</li>
        <li>GET /pumpfun/wallet/:address - Consulter un portefeuille</li>
      </ul>
      <p><strong>⚠️ Mode Démonstration:</strong> Les transactions sont simulées</p>
    </div>
  </div>
`

// Attacher les événements
document.getElementById('buy-token').addEventListener('click', buyToken);
document.getElementById('sell-token').addEventListener('click', sellToken);
document.getElementById('load-wallet').addEventListener('click', loadWallet);

// Tester la santé du serveur au chargement
testServerHealth();

// Vérifier la santé du serveur toutes les 10 secondes
setInterval(testServerHealth, 10000);

setupCounter(document.querySelector('#counter'))
