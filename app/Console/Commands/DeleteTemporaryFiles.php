<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Media;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Traits\iMMAPerTrait;

class DeleteTemporaryFiles extends Command
{
    use iMMAPerTrait;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'media:clear-temporary-file';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clearing temporary files';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        Log::info('Clearing temporary files ' . date('Y-m-d H:i:s'));

        $today = Carbon::now()->format('Y-m-d');

        $temporaryFiles = Media::where('collection_name', 'LIKE', 'temporary_files%')->where('created_at', '<=', Carbon::now()->subHours(24)->toDateTimeString())->get();
        $progressBar = $this->output->createProgressBar(count($temporaryFiles));
        $progressBar->start();
        foreach($temporaryFiles as $key => $temporaryFile) {
            $temporaryFile->delete();
            $progressBar->advance();
        }

        $progressBar->finish();
        $this->info("\nDone.");

        Log::info('Finished ' . date('Y-m-d H:i:s'));

        return true;
    }
}
