<?php

// app/Models/Candidate.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    use HasFactory;

    protected $fillable = ['first_name', 'last_name', 'email', 'phone'];

    public function responses()
    {
        return $this->hasMany(Response::class);
    }

    // Si vous avez besoin de relations avec d'autres modèles, vous pouvez les définir ici
}
