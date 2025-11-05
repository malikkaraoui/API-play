#!/bin/bash

echo "🚀 Démarrage de l'environnement de développement API Proxy"
echo "=================================================="

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null
then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null
then
    echo "❌ npm n'est pas installé"
    exit 1
fi

echo "✅ Node.js et npm détectés"

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances du serveur..."
    npm install
fi

if [ ! -d "Api-play/node_modules" ]; then
    echo "📦 Installation des dépendances du frontend..."
    cd Api-play && npm install && cd ..
fi

echo "🔥 Démarrage du serveur proxy et du frontend..."
echo ""
echo "📡 Serveur proxy : http://localhost:3000"
echo "🌐 Frontend Vite : http://localhost:5173"
echo ""
echo "Pour arrêter les serveurs, appuyez sur Ctrl+C"
echo ""

# Démarrer les deux serveurs en parallèle
npm run dev