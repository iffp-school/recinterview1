
# ReecInterview - Guide d'installation en production

Ce projet est une application web permettant la réalisation d'entretiens vidéo asynchrones, où les candidats répondent à des questions à leur propre rythme. Les recruteurs peuvent ensuite consulter les réponses et prendre des décisions.

## Prérequis

Avant de commencer, assurez-vous que les outils suivants sont installés sur votre serveur de production :

- **PHP** (version recommandée : 8.x)
- **Composer** (gestionnaire de dépendances PHP)
- **Node.js** et **npm** (pour la gestion des dépendances front-end)
- **MySQL** ou autre base de données compatible
- **Serveur web** (Apache, Nginx, etc.)
- **Git** (pour cloner le dépôt)

## Étapes d'Installation

### 1. Cloner le Dépôt

Clonez le dépôt de l'application sur votre serveur :
```bash
git clone https://github.com/iffp-school/recinterview1.git
cd recinterview1
```

### 2. Configuration du Backend (Laravel)

1. **Installation des dépendances PHP** :
   ```bash
   composer install --optimize-autoloader --no-dev
   ```
2. **Configuration de l'environnement** :
   - Copiez le fichier `.env.example` et renommez-le en `.env` :
     ```bash
     cp .env.example .env
     ```
   - Configurez les informations de votre base de données dans le fichier `.env`.
3. **Génération de la clé d'application** :
   ```bash
   php artisan key:generate
   ```
4. **Migrations et Seeders** :
   Créez la base de données et exécutez les migrations :
   ```bash
   php artisan migrate --seed
   ```

### 3. Configuration du Frontend

1. **Installation des dépendances Node.js** :
   ```bash
   npm install
   ```
2. **Compilation des assets pour la production** :
   ```bash
   npm run build
   ```

### 4. Configuration du Serveur Web

1. **Configuration d'Apache/Nginx** :
   Assurez-vous que votre serveur web pointe vers le répertoire `public` de Laravel.

2. **Permissions** :
   Définissez les permissions appropriées pour les répertoires `storage` et `bootstrap/cache` :
   ```bash
   sudo chown -R www-data:www-data storage
   sudo chown -R www-data:www-data bootstrap/cache
   ```

### 5. Optimisation pour la Production

1. **Optimisation des performances de Laravel** :
   Exécutez les commandes suivantes pour optimiser l'application :
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

2. **Vérification des dépendances** :
   Installez les dépendances uniquement nécessaires pour la production :
   ```bash
   composer install --no-dev --optimize-autoloader
   ```

## Sécurité

- **HTTPS** : Assurez-vous que votre serveur utilise HTTPS pour la sécurité des données.
- **Environnements** : Ne jamais exécuter l'application en mode `APP_DEBUG=true` sur un environnement de production.

## Démarrage

Lancez votre serveur et accédez à votre application en production via l'URL configurée dans votre serveur.

## Maintenance

- **Logs** : Les fichiers de logs sont disponibles dans le répertoire `storage/logs`.
- **Mises à jour** : Pour mettre à jour l'application, tirez les dernières modifications du dépôt Git, mettez à jour les dépendances et redéployez les assets :
   ```bash
   git pull origin main
   composer install --optimize-autoloader --no-dev
   npm run build
   php artisan migrate
   ```
