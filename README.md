# recinterview

Ce projet est une application web permettant la réalisation d'entretiens asynchrones. Il permet aux utilisateurs de passer des entretiens vidéo à leur propre rythme, en répondant à des questions enregistrées par l'entreprise recruteuse. L'administrateur peut ensuite consulter les réponses des candidats et prendre des décisions en conséquence.

## Installation

1. Assurez-vous d'avoir PHP, Composer, Xampp, NodeJS installés sur votre système.
2. Clonez ce dépôt dans votre répertoire de travail :
   ```bash
   git clone https://github.com/iffp-school/recinterview1.git
   ```
3. Accédez au répertoire du projet :
   ```bash
   cd recinterview1
   ```

### Backend & Frontend (Monolithique Laravel)

1. Installez les dépendances PHP avec Composer :
   ```bash
   composer install
   ```
2. Installez les dépendances Node.js avec npm :
   ```bash
   npm install
   ```
3. Copiez le fichier d'environnement `.env.example` et renommez-le en `.env` :
   ```bash
   cp .env.example .env
   ```
4. Générez une clé d'application Laravel :
   ```bash
   php artisan key:generate
   ```
5. Configurez votre base de données dans le fichier `.env`.
6. Effectuez les migrations et les seeds pour créer la base de données :
   ```bash
   php artisan migrate --seed
   ```

## Utilisation

### Démarrage du Serveur

1. Démarrez le serveur Laravel :
   ```bash
   php artisan serve
   ```
2. Démarrez le serveur de développement Vite :
   ```bash
   npm run dev
   ```

### Accès à l'Application

Accédez à votre application en ouvrant votre navigateur et en allant à l'adresse suivante :
   ```
   http://localhost:8000
   ```

## Structure du Projet

- **Backend** : Géré par Laravel, incluant les routes API, les migrations, les seeders, etc.
- **Frontend** : Géré par React, intégré via Blade et Vite pour le bundling des assets.

## Développement

### Ajout de nouvelles fonctionnalités

1. Pour ajouter un nouveau composant React, créez un fichier `.jsx` dans `resources/js/components`.
2. Pour ajouter un nouveau style, modifiez `resources/css/app.css` ou ajoutez de nouveaux fichiers CSS dans `resources/css`.

### Compilation des Assets

1. Pour compiler les assets en mode développement :
   ```bash
   npm run dev
   ```
2. Pour compiler les assets en mode production :
   ```bash
   npm run build
   ```

### Exécution des Tests

1. Pour exécuter les tests PHPUnit pour le backend :
   ```bash
   php artisan test
   ```

## Déploiement

1. Compilez les assets pour la production :
   ```bash
   npm run build
   ```
2. Déployez les fichiers sur votre serveur de production.
3. Assurez-vous que le serveur web pointe vers le répertoire `public` de Laravel.
