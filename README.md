# 🚀 PumpFun Trading Dashboard

Un dashboard de trading pour les tokens PumpFun avec interface moderne et proxy API sécurisé.

## � Aperçu

Ce projet comprend :
- **Serveur Express** : Proxy API avec endpoints de trading sécurisés
- **Dashboard Web** : Interface de trading moderne avec Vite et TailwindCSS
- **API de trading** : Endpoints pour achat, vente et consultation de portefeuille
- **Mode démonstration** : Simulations de transactions pour le développement

## 🛠️ Technologies

- **Backend** : Node.js, Express.js, node-fetch
- **Frontend** : Vite, Vanilla JavaScript, TailwindCSS
- **API** : PumpFun Bonding Curve API (avec proxy CORS)
- **Dev Tools** : Nodemon, Concurrently

## � Installation

```bash
# Cloner le repository
git clone [URL_DU_REPO]
cd API-play

# Installer les dépendances du serveur
npm install

# Installer les dépendances du frontend
cd Api-play
npm install
cd ..
```

## ⚡ Utilisation

### Démarrer le serveur uniquement
```bash
npm start
```
Le serveur sera disponible sur `http://localhost:3000`

### Démarrer en mode développement (serveur + frontend)
```bash
npm run dev
```
- Serveur API : `http://localhost:3000`
- Dashboard Web : `http://localhost:5173`

### Tester l'API
```bash
npm test
```

## 📡 Endpoints API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/pumpfun/:mint` | Récupérer données d'un token |
| `POST` | `/pumpfun/buy` | Acheter des tokens |
| `POST` | `/pumpfun/sell` | Vendre des tokens |
| `GET` | `/pumpfun/wallet/:address` | Consulter un portefeuille |
| `GET` | `/health` | Status du serveur |

## 🎯 Fonctionnalités

### 🛒 Trading Interface
- Achat de tokens avec montant en SOL
- Vente de tokens par pourcentage
- Configuration du slippage et frais de priorité
- Validation des paramètres en temps réel

### 👛 Gestion de Portefeuille
- Consultation des balances SOL et tokens
- Affichage des valeurs en USD
- Liste détaillée des tokens possédés

### 📊 Monitoring
- Status du serveur en temps réel
- Résultats des transactions détaillés
- Gestion d'erreurs complète

## 🔧 Structure du Projet

```
API-play/
├── server.js              # Serveur Express principal
├── test.js                # Tests de l'API
├── package.json           # Configuration serveur
├── Api-play/              # Frontend Vite
│   ├── src/
│   │   ├── main.js        # Application principale
│   │   ├── style.css      # Styles TailwindCSS
│   │   └── counter.js     # Composant compteur
│   ├── index.html         # Template HTML
│   └── package.json       # Configuration frontend
└── README.md              # Documentation
```

## 🛡️ Sécurité

⚠️ **Mode Développement** : Ce projet utilise :
- `NODE_TLS_REJECT_UNAUTHORIZED=0` pour contourner SSL
- Données simulées pour les transactions
- Clés privées de démonstration

🔒 **Pour la production** :
- Supprimer le contournement SSL
- Implémenter une vraie gestion des clés privées
- Ajouter l'authentification utilisateur
- Utiliser HTTPS

## � Exemples d'API

### Achat de tokens
```bash
curl -X POST http://localhost:3000/pumpfun/buy \
  -H "Content-Type: application/json" \
  -d '{
    "private_key": "demo_key",
    "mint": "2ZnL2kwYxu2HJGuusJ9wkauNL2zkvndsisjVaVyppump",
    "sol_in": 0.1,
    "slippage": 5
  }'
```

### Consultation de portefeuille
```bash
curl http://localhost:3000/pumpfun/wallet/demo_address
```

## 🎨 Interface

Le dashboard offre :
- **Design moderne** avec dégradés et animations
- **Interface responsive** pour mobile et desktop
- **Thème sombre** optimisé pour le trading
- **Feedback visuel** pour toutes les actions

## 📊 Scripts Disponibles

- `npm start` - Démarrer le serveur
- `npm run dev` - Mode développement complet
- `npm run server` - Serveur avec auto-reload
- `npm run client` - Frontend uniquement
- `npm test` - Tests de l'API

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## ⚠️ Disclaimer

Ce projet est à des fins éducatives et de démonstration. Les transactions sont simulées. Utilisez à vos propres risques pour du trading réel.