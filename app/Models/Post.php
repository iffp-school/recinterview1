<?php

// Déclaration de l'espace de noms pour organiser le code dans l'application
namespace App\Models;

// Importation des classes nécessaires de Laravel
use Illuminate\Database\Eloquent\Factories\HasFactory; // Gère les "factories" pour la création rapide d'instances
use Illuminate\Database\Eloquent\Model; // Classe de base pour tous les modèles Eloquent
use Illuminate\Support\Str; // Fournit des méthodes pour la manipulation de chaînes de caractères, comme la génération de chaînes aléatoires

// Déclaration de la classe Post, qui représente un poste dans l'application
class Post extends Model
{
    // Utilisation du trait HasFactory pour permettre la création rapide de postes via des "factories"
    use HasFactory;

    /**
     * Attributs pouvant être assignés en masse.
     * 
     * @var array<int, string> $fillable Les champs définis ici peuvent être remplis directement dans les requêtes.
     */
    protected $fillable = [
        'recruiter_id',    // Référence vers l'identifiant du recruteur associé
        'title',           // Titre du poste
        'description',     // Description du poste
        'random_string',   // Chaîne aléatoire générée automatiquement pour chaque poste
        'message_end'      // Message de fin spécifique à ce poste
    ];

    /**
     * Définition de la relation "un-à-un" avec le modèle Recruiter.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo Indique que chaque poste appartient à un recruteur.
     */
    public function recruiter()
    {
        return $this->belongsTo(Recruiter::class); // Relie chaque poste à un recruteur
    }

    /**
     * Définition de la relation "un-à-plusieurs" avec le modèle Question.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany Indique qu'un poste peut avoir plusieurs questions.
     */
    public function questions()
    {
        return $this->hasMany(Question::class); // Relie le poste à plusieurs questions
    }

    /**
     * Définition de la relation "un-à-plusieurs" avec le modèle Candidate.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany Indique qu'un poste peut avoir plusieurs candidats.
     */
    public function candidates()
    {
        return $this->hasMany(Candidate::class); // Relie le poste à plusieurs candidats
    }

    /**
     * Méthode d'amorçage du modèle Post.
     * 
     * La méthode boot() permet d'exécuter des actions automatiques lors de certains événements du cycle de vie du modèle.
     * Ici, elle est utilisée pour générer automatiquement une chaîne aléatoire lorsque le modèle est créé.
     */
    public static function boot()
    {
        // Appel de la méthode boot() du parent pour assurer le bon fonctionnement du modèle
        parent::boot();

        // Lorsqu'un poste est en cours de création, génère une chaîne aléatoire de 8 caractères pour l'attribut `random_string`
        static::creating(function ($post) {
            $post->random_string = Str::random(8); // Génère une chaîne aléatoire et l'assigne à l'attribut random_string
        });
    }
}
