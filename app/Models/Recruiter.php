<?php

// Déclaration de l'espace de noms pour organiser le code dans l'application
namespace App\Models;

// Importation des classes nécessaires de Laravel
use Illuminate\Database\Eloquent\Factories\HasFactory; // Gère les "factories" pour la création rapide d'instances
use Illuminate\Database\Eloquent\Model; // Classe de base pour tous les modèles Eloquent

// Déclaration de la classe Recruiter, qui représente un recruteur dans l'application
class Recruiter extends Model
{
    // Utilisation du trait HasFactory pour permettre la création rapide de recruteurs via des "factories"
    use HasFactory;

    /**
     * Attributs pouvant être assignés en masse.
     * 
     * @var array<int, string> $fillable Les champs définis ici peuvent être remplis directement dans les requêtes.
     */
    protected $fillable = [
        'user_id',        // Référence vers l'identifiant de l'utilisateur associé
        'company_name',   // Nom de l'entreprise du recruteur
    ];

    /**
     * Définition de la relation "un-à-un" avec le modèle User.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo Indique que chaque recruteur appartient à un utilisateur.
     */
    public function user()
    {
        return $this->belongsTo(User::class); // Relie chaque recruteur à un utilisateur dans la base de données
    }

    /**
     * Définition de la relation "un-à-plusieurs" avec le modèle Post.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany Indique qu'un recruteur peut avoir plusieurs postes.
     */
    public function posts()
    {
        return $this->hasMany(Post::class); // Relie le recruteur à plusieurs postes
    }

    /**
     * Définition de la relation "has-many-through" avec le modèle Candidate.
     * Cette relation permet d'accéder aux candidats à travers les postes du recruteur.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasManyThrough Permet au recruteur de récupérer tous les candidats via ses postes.
     */
    public function candidates()
    {
        return $this->hasManyThrough(
            Candidate::class, // Modèle de destination (Candidat)
            Post::class,      // Modèle intermédiaire (Poste)
            'recruiter_id',   // Clé étrangère sur le modèle Post référencée dans Recruiter
            'post_id',        // Clé étrangère sur le modèle Candidate référencée dans Post
            'id',             // Clé locale sur le modèle Recruiter
            'id'              // Clé locale sur le modèle Post
        );
    }
}
