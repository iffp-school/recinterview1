#!/bin/bash

# Charger les variables d'environnement depuis le fichier .env
export $(grep -v '^#' .env | xargs)

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
