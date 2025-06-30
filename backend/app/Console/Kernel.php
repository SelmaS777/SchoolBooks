<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Events\Dispatcher;

class Kernel extends ConsoleKernel
{
    public function __construct(Application $app, Dispatcher $dispatcher)
    {
        parent::__construct($app, $dispatcher);
    }

    protected function schedule(Schedule $schedule): void
    {
        $schedule->command('tld:update')->weekly();
    }

    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
