<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * Les middleware HTTP globaux de l'application.
     *
     * Ces middleware sont exécutés pour chaque requête vers votre application.
     *
     * @var array
     */
    protected $middleware = [
        // Autres middleware
        \App\Http\Middleware\CorsMiddleware::class,
        \Illuminate\Http\Middleware\HandleCors::class,
        \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
        \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
    ];

    /**
     * Les groupes de middleware HTTP de l'application.
     *
     * Parfois, vous pouvez vouloir regrouper plusieurs middleware sous un seul
     * nom pour les assigner plus facilement à certaines routes. Vous pouvez
     * créer autant de groupes que vous le souhaitez.
     *
     * @var array
     */
    protected $middlewareGroups = [
        'web' => [
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ],

        'api' => [
            'throttle:api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
    ];

    /**
     * Les middleware de route de l'application.
     *
     * Ces middleware peuvent être assignés à des groupes de middleware ou utilisés
     * individuellement. Ces middleware sont exécutés après les middleware globaux
     * de chaque requête entrante et avant les middleware des groupes de middleware.
     *
     * @var array
     */
    protected $routeMiddleware = [
        // Autres middleware de route
        'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
        'cache.headers' => \Illuminate\Http\Middleware\SetCacheHeaders::class,
        'can' => \Illuminate\Auth\Middleware\Authorize::class,
        'password.confirm' => \Illuminate\Auth\Middleware\RequirePassword::class,
        'signed' => \Illuminate\Routing\Middleware\ValidateSignature::class,
        'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
        'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
    ];
}
