#!/bin/bash

# Déterminer le répertoire du script
SCRIPT_DIR=$(dirname "$(realpath "$0")")

# Chemin absolu du fichier .env basé sur l'emplacement du script
ENV_FILE="$SCRIPT_DIR/../.env"

# Charger les variables d'environnement depuis le fichier .env
if [ -f "$ENV_FILE" ]; then
  export $(grep -v '^#' "$ENV_FILE" | xargs)
else
  echo "Le fichier .env n'existe pas."
  exit 1
fi

# Utiliser les variables d'environnement pour définir les chemins
PUBLIC_DIR=${PUBLIC_DIR}
STORAGE_DIR=${STORAGE_DIR}

# Vérifier que les variables d'environnement sont définies
if [[ -z "$PUBLIC_DIR" || -z "$STORAGE_DIR" ]]; then
  echo "Les variables d'environnement PUBLIC_DIR et STORAGE_DIR doivent être définies."
  exit 1
fi

# Supprimer le lien symbolique existant
rm -rf "$PUBLIC_DIR/storage"

# Créer un nouveau lien symbolique
ln -s "$STORAGE_DIR" "$PUBLIC_DIR/storage"

echo "Symlink recréé avec succès."
