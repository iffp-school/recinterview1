<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'recruiter_id',
        'title',
        'description',
    ];

    public function recruiter()
    {
        return $this->belongsTo(Recruiter::class);
    }

    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    public function candidates()
    {
        return $this->hasMany(Candidate::class);
    }
}
