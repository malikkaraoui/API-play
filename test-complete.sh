#!/bin/bash

echo "🧪 Script de test complet de l'API Proxy"
echo "========================================"

# Fonction pour nettoyer les processus en arrière-plan
cleanup() {
    echo ""
    echo "🧹 Nettoyage des processus..."
    if [[ $SERVER_PID ]]; then
        kill $SERVER_PID 2>/dev/null
        echo "✅ Serveur arrêté"
    fi
    exit 0
}

# Capturer Ctrl+C pour nettoyer
trap cleanup INT

# Vérifier si le port 3000 est libre
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Le port 3000 est déjà utilisé"
    echo "🔄 Tentative de test avec le serveur existant..."
    
    # Tester directement
    node test.js
else
    echo "🚀 Démarrage du serveur proxy en arrière-plan..."
    
    # Démarrer le serveur en arrière-plan
    npm start &
    SERVER_PID=$!
    
    echo "⏳ Attente du démarrage du serveur (3 secondes)..."
    sleep 3
    
    # Vérifier si le serveur est démarré
    if curl -s http://localhost:3000/health > /dev/null; then
        echo "✅ Serveur prêt!"
        echo ""
        
        # Lancer le test
        node test.js
        
        echo ""
        echo "🏁 Test terminé"
    else
        echo "❌ Le serveur n'a pas pu démarrer correctement"
        cleanup
        exit 1
    fi
    
    echo ""
    echo "🛑 Appuyez sur Ctrl+C pour arrêter le serveur"
    
    # Attendre que l'utilisateur arrête
    wait $SERVER_PID
fi