# API Proxy Server

Un serveur proxy Express.js pour contourner les restrictions CORS et SSL lors des appels d'API externes.

## 🚀 Fonctionnalités

- **Serveur Proxy Express** : Contourne les restrictions CORS et SSL
- **Interface Frontend Vite** : Interface de test pour les APIs
- **Hot Reload** : Développement avec rechargement automatique
- **Endpoint Santé** : Monitoring du statut du serveur

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Installer les dépendances du frontend
cd Api-play && npm install
```

## 🛠️ Utilisation

### Démarrer le serveur proxy uniquement
```bash
npm start
```
Le serveur sera disponible sur `http://localhost:3000`

### Développement (serveur + frontend)
```bash
npm run dev
```
- Serveur proxy : `http://localhost:3000`
- Frontend Vite : `http://localhost:5173`

### Serveur seul avec hot reload
```bash
npm run server
```

### Frontend seul
```bash
npm run client
```

## 📡 Endpoints Disponibles

### `GET /`
Point d'entrée principal avec informations sur le serveur

### `GET /health`
Endpoint de santé pour vérifier le statut du serveur

### `POST /pumpfun`
Proxy vers l'API PumpFun
- **URL cible** : `https://api.pumpfunapis.com/coin-data/get-bonding`
- **Méthode** : POST
- **Headers** : Content-Type: application/json

#### Exemple d'utilisation
```javascript
const response = await fetch('http://localhost:3000/pumpfun', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    // Vos paramètres ici
    token: 'example-token',
    action: 'get-bonding'
  })
});

const data = await response.json();
console.log(data);
```

## 🔧 Configuration

### Variables d'environnement
- `PORT` : Port du serveur (défaut: 3000)

### Ajouter de nouveaux endpoints
Modifiez `server.js` pour ajouter de nouveaux proxies :

```javascript
app.post("/nouvelle-api", async (req, res) => {
  try {
    const response = await fetch("https://api.exemple.com/endpoint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 🛡️ Sécurité

Le serveur proxy :
- Utilise CORS pour autoriser les requêtes cross-origin
- Ajoute des headers User-Agent pour éviter les blocages
- Gère les erreurs HTTP avec des messages appropriés
- Log les requêtes pour le débogage

## 📁 Structure du Projet

```
API-play/
├── server.js              # Serveur Express proxy
├── package.json           # Dépendances du serveur
├── Api-play/              # Frontend Vite
│   ├── src/
│   │   ├── main.js        # Interface de test
│   │   └── style.css      # Styles
│   ├── package.json       # Dépendances frontend
│   └── vite.config.js     # Configuration Vite
└── README.md              # Documentation
```

## 🚨 Résolution des Problèmes

### Le serveur ne démarre pas
- Vérifiez que le port 3000 n'est pas déjà utilisé
- Installez les dépendances avec `npm install`

### Erreurs CORS
- Le serveur proxy est configuré avec CORS activé
- Assurez-vous que le serveur proxy est démarré

### Erreurs SSL/TLS
- Le proxy gère automatiquement les certificats SSL
- Les requêtes passent par le serveur Node.js qui accepte les certificats