<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\RecruiterNotification;

class EmailController extends Controller
{
    public function sendRecruiterEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'subject' => 'required|string',
            'message' => 'required|string',
        ]);

        $emailData = [
            'email' => $request->email,
            'subject' => $request->subject,
            'message' => $request->message,
        ];

        // Envoi de l'email
        Mail::to($request->email)->send(new RecruiterNotification($emailData));

        return response()->json(['message' => 'Email envoyé avec succès.'], 200);
    }
}
