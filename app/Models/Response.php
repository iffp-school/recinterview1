<?php

// Déclaration de l'espace de noms pour organiser le code dans l'application
namespace App\Models;

// Importation des classes nécessaires de Laravel
use Illuminate\Database\Eloquent\Factories\HasFactory; // Gère les "factories" pour la création rapide d'instances
use Illuminate\Database\Eloquent\Model; // Classe de base pour tous les modèles Eloquent

// Déclaration de la classe Response, qui représente une réponse d'un candidat (par exemple, une réponse vidéo) dans l'application
class Response extends Model
{
    // Utilisation du trait HasFactory pour permettre la création rapide de réponses via des "factories"
    use HasFactory;

    /**
     * Attributs pouvant être assignés en masse.
     * 
     * @var array<int, string> $fillable Les champs définis ici peuvent être remplis directement dans les requêtes.
     */
    protected $fillable = [
        'candidate_id', // Référence vers l'identifiant du candidat ayant fourni la réponse
        'video_url'     // URL de la vidéo de réponse fournie par le candidat
    ];

    /**
     * Définition de la relation "un-à-un" avec le modèle Candidate.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo Indique que chaque réponse appartient à un candidat spécifique.
     */
    public function candidate()
    {
        return $this->belongsTo(User::class, 'candidate_id'); // Relie chaque réponse à un candidat via la clé étrangère candidate_id
    }
}
