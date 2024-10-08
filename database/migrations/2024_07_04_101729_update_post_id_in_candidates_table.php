<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up()
    {
        // Supprimer la contrainte de clé étrangère existante si elle existe
        Schema::table('candidates', function (Blueprint $table) {
            $table->dropForeign(['post_id']);
        });

        // Modifier la colonne 'post_id' pour s'assurer qu'elle est bien NOT NULL
        Schema::table('candidates', function (Blueprint $table) {
            $table->unsignedBigInteger('post_id')->nullable(false)->change();
        });

        // Ajouter la contrainte de clé étrangère
        Schema::table('candidates', function (Blueprint $table) {
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
