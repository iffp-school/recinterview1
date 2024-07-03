<?php

// app/Models/Candidate.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'cv',
        'post_id',
        'gender'
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
    public function responses()
    {
        return $this->hasMany(Response::class);
    }
}
