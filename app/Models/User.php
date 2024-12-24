<?php

// Déclaration de l'espace de noms pour organiser le code
namespace App\Models;

// Importation des classes nécessaires de Laravel pour construire ce modèle
use Illuminate\Database\Eloquent\Factories\HasFactory; // Gère les "factories" pour la création rapide d'instances
use Illuminate\Foundation\Auth\User as Authenticatable; // Classe de base pour les utilisateurs qui fournit l'authentification
use Illuminate\Notifications\Notifiable; // Permet d'envoyer des notifications (e.g., emails)
use Laravel\Sanctum\HasApiTokens; // Permet la gestion de tokens API pour l'authentification
use Illuminate\Database\Eloquent\Relations\HasOne; // Gère les relations "hasOne" entre modèles

// Déclaration de la classe User qui représente les utilisateurs de l'application
class User extends Authenticatable
{
    // Utilisation de certains traits pour enrichir les fonctionnalités de la classe User
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Attributs qui peuvent être assignés en masse.
     * 
     * @var array<int, string> $fillable Les champs définis ici peuvent être remplis via des requêtes.
     */
    protected $fillable = [
        'name',        // Nom de l'utilisateur
        'email',       // Adresse email de l'utilisateur
        'password',    // Mot de passe de l'utilisateur
    ];

    /**
     * Attributs à cacher lors de la sérialisation du modèle.
     * 
     * @var array<int, string> $hidden Empêche ces champs d'apparaître quand l'objet est converti en tableau ou JSON.
     */
    protected $hidden = [
        'password',           // Mot de passe caché pour des raisons de sécurité
        'remember_token',     // Token utilisé pour garder l'utilisateur connecté
    ];

    /**
     * Attributs à convertir dans un type spécifique lors de leur utilisation.
     * 
     * @var array<string, string> $casts Ces champs sont automatiquement convertis pour simplifier le traitement.
     */
    protected $casts = [
        'email_verified_at' => 'datetime', // Convertit la date de vérification de l'email en objet DateTime
        'password' => 'hashed',            // Indique que le mot de passe est haché pour plus de sécurité
    ];

    /**
     * Définition d'une relation "un-à-un" avec le modèle Recruiter.
     * 
     * @return HasOne Cette méthode renvoie une relation "HasOne" reliant chaque utilisateur à un recruteur.
     */
    public function recruiter(): HasOne
    {
        return $this->hasOne(Recruiter::class); // Relie l'utilisateur à un recruteur dans la base de données
    }
}
