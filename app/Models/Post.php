<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'recruiter_id',
        'title',
        'description',
        'random_string'
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

    public static function boot()
    {
        parent::boot();

        static::creating(function ($post) {
            $post->random_string = Str::random(8);
        });
    }
}
