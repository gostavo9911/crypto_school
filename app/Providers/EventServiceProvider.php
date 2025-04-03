<?php

namespace App\Providers;

use App\Listeners\UpdateUserLastLogin;
use Illuminate\Auth\Events\Login;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Login::class => [
            UpdateUserLastLogin::class,
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        //
    }
}
