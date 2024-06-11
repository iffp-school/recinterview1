<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Response extends Model
{
    use HasFactory;

    protected $fillable = ['candidate_id', 'video_url'];

    // Relation avec le candidat
    public function candidate()
    {
        return $this->belongsTo(User::class, 'candidate_id');
    }

    // Méthode pour créer une nouvelle réponse
    public static function createResponse($candidateId, $videoUrl)
    {
        return self::create([
            'candidate_id' => $candidateId,
            'video_url' => $videoUrl
        ]);
    }

    // Méthode pour mettre à jour une réponse
    public function updateResponse($videoUrl)
    {
        $this->video_url = $videoUrl;
        $this->save();
        return $this;
    }

    // Méthode pour supprimer une réponse
    public function deleteResponse()
    {
        $this->delete();
    }
}
