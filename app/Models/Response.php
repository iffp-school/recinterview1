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
}
