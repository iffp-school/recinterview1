<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

   public function up()
    {
        Schema::table('candidates', function (Blueprint $table) {
            // Mettre à jour le champ `post_id` pour qu'il soit non nul
            $table->unsignedBigInteger('post_id')->nullable(false)->change();

            // Ajouter de nouveau la contrainte de clé étrangère
            $table->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
        });
    }
    public function down()
    {
        Schema::table('candidates', function (Blueprint $table) {
            // Revenir à l'état précédent où `post_id` pourrait être nul
            $table->unsignedBigInteger('post_id')->nullable()->change();

            // Ajouter de nouveau la contrainte de clé étrangère
            $table->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
        });
    }
};
