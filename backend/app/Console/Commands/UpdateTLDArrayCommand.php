<?php

namespace App\Console\Commands;

use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class UpdateTLDArrayCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-t-l-d-array';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update the TLD array';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        try {
            $fileContent = file_get_contents('https://data.iana.org/TLD/tlds-alpha-by-domain.txt');

            if ($fileContent === false) {
                Log::error('Failed to fetch TLDs: Failed to download the file');
                return;
            }

            $lines = explode("\n", $fileContent);

            array_shift($lines);

            $tlds = $lines;

            Cache::put('tlds', $tlds, now()->addWeek());
            $this->info('TLD array updated successfully.');
        } catch (Exception $e) {
            Log::error('Failed to fetch TLDs: ' . $e->getMessage());
            $this->error('Failed to update TLD array.');
        }
    }
}
