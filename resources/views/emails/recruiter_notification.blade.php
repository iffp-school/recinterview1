<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{ $emailData['subject'] }}</title>
    <!-- Inclusion de Tailwind CSS via CDN -->
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
    <div class="max-w-xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
        <!-- En-tête -->
        <div class="bg-green-500 text-white text-center p-4 rounded-t-lg">
            <h1 class="text-xl font-bold">{{ $emailData['subject'] }}</h1>
        </div>
        <!-- Contenu -->
        <div class="p-6">
            {!! $emailData['message'] !!}
        </div>
        <!-- Pied de page -->
        <div class="bg-gray-100 text-center p-4 rounded-b-lg text-gray-700">
            <p>© {{ date('Y') }} RecInterview. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>
