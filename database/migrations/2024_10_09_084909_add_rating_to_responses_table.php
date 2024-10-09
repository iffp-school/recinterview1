<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     */
    public function up()
    {
        Schema::table('responses', function (Blueprint $table) {
            $table->integer('rating')->nullable()->after('video_url'); // Ajoute la colonne de notation après le champ 'video_url'
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('responses', function (Blueprint $table) {
            $table->dropColumn('rating'); // Supprime la colonne en cas de rollback
        });
    }
};
