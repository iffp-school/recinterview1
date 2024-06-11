<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = ['recruiter_id', 'question_text'];

    // Relation avec le recruteur
    public function recruiter()
    {
        return $this->belongsTo(User::class, 'recruiter_id');
    }

    // Méthode pour créer une nouvelle question
    public static function createQuestion($recruiterId, $questionText)
    {
        return self::create([
            'recruiter_id' => $recruiterId,
            'question_text' => $questionText
        ]);
    }

    // Méthode pour mettre à jour une question
    public function updateQuestion($questionText)
    {
        $this->question_text = $questionText;
        $this->save();
        return $this;
    }

    // Méthode pour supprimer une question
    public function deleteQuestion()
    {
        $this->delete();
    }
}
