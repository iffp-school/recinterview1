<?php

// Déclaration de l'espace de noms pour organiser le code dans l'application
namespace App\Models;

// Importation des classes nécessaires de Laravel
use Illuminate\Database\Eloquent\Factories\HasFactory; // Gère les "factories" pour la création rapide d'instances
use Illuminate\Database\Eloquent\Model; // Classe de base pour tous les modèles Eloquent

// Déclaration de la classe Question, qui représente une question d'entretien dans l'application
class Question extends Model
{
    // Utilisation du trait HasFactory pour permettre la création rapide de questions via des "factories"
    use HasFactory;

    /**
     * Attributs pouvant être assignés en masse.
     * 
     * @var array<int, string> $fillable Les champs définis ici peuvent être remplis directement dans les requêtes.
     */
    protected $fillable = [
        'question_text',      // Texte de la question
        'post_id',            // Référence vers l'identifiant du poste associé à cette question
        'preparation_time',   // Temps de préparation accordé au candidat pour répondre à la question
        'response_time',      // Temps maximum accordé pour répondre à la question
    ];

    /**
     * Définition de la relation "un-à-un" avec le modèle Post.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo Indique que chaque question appartient à un poste spécifique.
     */
    public function post()
    {
        return $this->belongsTo(Post::class); // Relie chaque question à un poste spécifique
    }
}
