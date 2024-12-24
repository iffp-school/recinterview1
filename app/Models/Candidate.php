<?php

// Déclaration de l'espace de noms pour organiser le code dans l'application
namespace App\Models;

// Importation des classes nécessaires de Laravel
use Illuminate\Database\Eloquent\Factories\HasFactory; // Gère les "factories" pour la création rapide d'instances
use Illuminate\Database\Eloquent\Model; // Classe de base pour tous les modèles Eloquent

// Déclaration de la classe Candidate, qui représente un candidat dans l'application
class Candidate extends Model
{
    // Utilisation du trait HasFactory pour permettre la création rapide de candidats via des "factories"
    use HasFactory;

    /**
     * Attributs pouvant être assignés en masse.
     * 
     * @var array<int, string> $fillable Les champs définis ici peuvent être remplis directement dans les requêtes.
     */
    protected $fillable = [
        'first_name', // Prénom du candidat
        'last_name',  // Nom de famille du candidat
        'email',      // Adresse email du candidat
        'phone',      // Numéro de téléphone du candidat
        'cv',         // Chemin ou lien vers le CV du candidat
        'post_id',    // Référence vers l'identifiant du poste auquel le candidat postule
        'gender',     // Genre du candidat
        'rating'      // Note ou évaluation du candidat, si applicable
    ];

    /**
     * Définition de la relation "un-à-un" avec le modèle Post.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo Indique que chaque candidat appartient à un poste spécifique.
     */
    public function post()
    {
        return $this->belongsTo(Post::class); // Relie chaque candidat à un poste
    }

    /**
     * Définition de la relation "un-à-plusieurs" avec le modèle Response.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany Indique qu'un candidat peut avoir plusieurs réponses (par exemple, à des questions d'entretien).
     */
    public function responses()
    {
        return $this->hasMany(Response::class); // Relie le candidat à plusieurs réponses
    }
}
