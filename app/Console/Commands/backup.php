<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\BackupSuccess;

class backup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'backup:daily';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Script to perform daily backup properly';

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
        Log::info('Backup Daily Script started at '. date('Y-m-d H:i:s'));
        /**
         * Get the current date
         */
        $currentDate = date("Y-m-d");
        /**
         * Set temporary backup folder path
         */
        $backupFolderBasePath = base_path('storage/backup-folder');

        /**
         * cleaning old backup to free space
         */
        Log::info("===================== Part 1: Cleaning old database backup files ======================");
        Log::info('>>> Start cleaning old database backup files...');
        $this->line('===================== Part 1: Cleaning old database backup files ======================');
        $this->info('>>> Start cleaning old backup files...');
        if (File::isDirectory(storage_path('app/iMMAP-Careers'))) {
            File::cleanDirectory(storage_path('app/iMMAP-Careers'));
        }
        $this->comment('>>> Finished cleaning old database backup files!');
        Log::info('>>>  Finished cleaning old database backup files!');

        /**
         *  Copy public folder to backup-folder/public
         *  Left storage folder inside public folder because it's just symlink to storage/app/public folder
         */
        Log::info('========== Part 2: Copying backup files to temporary backup folder ==========');
        Log::info('>>> Start copying public folder to temporary backup folder...');
        $this->line('========== Part 2: Copying backup files to temporary backup folder ==========');
        $this->info('>>> Start copying public folder to temporary backup folder...');

        //============================== No need for the backup ==========================
        // if (File::isDirectory(base_path('public/css'))) {
        //     File::copyDirectory(base_path('public/css'), base_path('storage/backup-folder/public/css'));
        // }
        // if (File::isDirectory(base_path('public/fonts'))) {
        //     File::copyDirectory(base_path('public/fonts'), base_path('storage/backup-folder/public/fonts'));
        // }
        // if (File::isDirectory(base_path('public/images'))) {
        //     File::copyDirectory(base_path('public/images'), base_path('storage/backup-folder/public/images'));
        // }
        // if (File::isDirectory(base_path('public/img'))) {
        //     File::copyDirectory(base_path('public/img'), base_path('storage/backup-folder/public/img'));
        // }
        // if (File::isDirectory(base_path('public/js'))) {
        //     File::copyDirectory(base_path('public/js'), base_path('storage/backup-folder/public/js'));
        // }
        // if (File::isDirectory(base_path('public/svg'))) {
        //     File::copyDirectory(base_path('public/svg'), base_path('storage/backup-folder/public/svg'));
        // }

        // if (File::exists(base_path('public/.htaccess'))) {
        //     File::copy(base_path('public/.htaccess'), base_path('storage/backup-folder/public/.htaccess'));
        // }
        // if (File::exists(base_path('public/favicon.ico'))) {
        //     File::copy(base_path('public/favicon.ico'), base_path('storage/backup-folder/public/favicon.ico'));
        // }
        // if (File::exists(base_path('public/index.htm'))) {
        //     File::copy(base_path('public/index.htm'), base_path('storage/backup-folder/public/index.htm'));
        // }
        // if (File::exists(base_path('public/index.php'))) {
        //     File::copy(base_path('public/index.php'), base_path('storage/backup-folder/public/index.php'));
        // }
        // if (File::exists(base_path('public/mix-manifest.json'))) {
        //     File::copy(base_path('public/mix-manifest.json'), base_path('storage/backup-folder/public/mix-manifest.json'));
        // }
        // if (File::exists(base_path('public/robots.txt'))) {
        //     File::copy(base_path('public/robots.txt'), base_path('storage/backup-folder/public/robots.txt'));
        // }
        // if (File::exists(base_path('public/web.config'))) {
        //     File::copy(base_path('public/web.config'), base_path('storage/backup-folder/public/web.config'));
        // }
        // if (File::exists(base_path('public/world-110m.json'))) {
        //     File::copy(base_path('public/world-110m.json'), base_path('storage/backup-folder/public/world-110m.json'));
        // }
        //============================== No need for the backup ==========================

        $this->comment('>>> Finished copying public folder to temporary backup folder!');
        Log::info('>>> Finished copying public folder to temporary backup folder!');

        /**
         * Copy storage/app/public folder to backup-folder
         */
        //============================== These datas are already exists on s3 ==========================
        // if (File::isDirectory(base_path('storage/app/public'))) {
        //     Log::info('>>> Copying storage/app/public folder to temporary backup folder...');
        //     $this->info('>>> Copying storage/app/public folder to temporary backup folder...');
        //     File::copyDirectory(base_path('storage/app/public'), base_path('storage/backup-folder/storage/app/public'));
        //     $this->comment('>>> Finished copying storage/app/public folder to temporary backup folder!');
        //     Log::info('>>> Finished copying storage/app/public folder to temporary backup folder!');
        // }
         //============================== These datas are already exists on s3 ==========================

        /**
         * Copy storage/logs folder to backup-folder
         */
         //============================== No need for the backup ==========================
        // if (File::isDirectory(base_path('storage/logs'))) {
        //     Log::info('>>> Copying storage/logs folder to temporary backup folder...');
        //     $this->info('>>> Copying storage/logs folder to temporary backup folder...');
        //     File::copyDirectory(base_path('storage/logs'), base_path('storage/backup-folder/storage/logs'));
        //     $this->comment('>>> Finished copying storage/logs folder to temporary backup folder!');
        //     Log::info('>>> Finished copying storage/logs folder to temporary backup folder!');
        // }
         //============================== No need for the backup ==========================

        /**
         * Copy storage/framework folder to backup-folder
         */
        //============================== No need for the backup ==========================
        // if (File::isDirectory(base_path('storage/framework'))) {
        //     Log::info('>>> Copying storage/framework folder to temporary backup folder...');
        //     $this->info('>>> Copying storage/framework folder to temporary backup folder...');
        //     File::copyDirectory(base_path('storage/framework'), base_path('storage/backup-folder/storage/framework'));
        //     $this->comment('>>> Finished copying storage/framework folder to temporary backup folder!');
        //     Log::info('>>> Finished copying storage/framework folder to temporary backup folder!');
        // }
        //============================== No need for the backup ==========================

        /**
         * Backup Database
         */
        Log::info('============ Part 3: Backup Database ============');
        $this->line('============ Part 3: Backup Database ============');
        $this->call('backup:run',['--only-db' => true]);

        /**
         * Copy Database Backup to backup-folder
         */
        Log::info('============ Part 4: Copy Database Backup to temporary backup folder ============');
        $this->line('============ Part 4: Copy Database Backup to temporary backup folder ============');
        if (File::isDirectory(base_path('storage/app/iMMAP-Careers'))) {
            File::copyDirectory(base_path('storage/app/iMMAP-Careers'), base_path("storage/backup-folder/database-$currentDate"));
        }

        /**
         * Sync backup folder
         */
        Log::info('============ Part 5: Copy Backup Folder to S3 Bucket ============');
        $this->line('============ Part 5: Copy Backup Folder to S3 Bucket ============');
        $backupFolderIsExists = false;
        if (File::isDirectory($backupFolderBasePath)) {
            $backupFolderIsExists = true;
            shell_exec("aws s3 sync $backupFolderBasePath s3://hr-roster-production/backups/iMMAP-Careers-$currentDate");
        }

        /**
         * Sending email report
         */
        Log::info('=================== Part 6: Sending an email to developer ==================');
        Log::info('>>> Start sending an email to developer...');
        $this->line('=================== Part 6: Sending an email to developer ==================');
        $this->info('>>> Start sending an email to developer...');

        // get db files information
        $dbFiles = scandir(base_path('storage/app/iMMAP-Careers'), SCANDIR_SORT_DESCENDING);
        $dbPath = storage_path("app/iMMAP-Careers/" . $dbFiles[0]);
        $dbSize = file_exists($dbPath) ? $this->convertBytesToHumanReadable(File::size($dbPath)) : '0 bytes';
        // get temporary backup folder information
        $backupFolderSize = $backupFolderIsExists ? $this->getFolderSize($backupFolderBasePath) : '0 bytes';
        // sending email notification
        Mail::to(env('SCRIPT_MAIL_TO'))->send(new BackupSuccess($dbSize, $backupFolderSize));

        $this->comment('>>> Finished sending an email to developer!');
        Log::info('>>> Finished sending an email to developer!');

        /**
         * Delete temporary backup folder
         */
        Log::info('=================== Part 7: Delete Temporary Backup Folder ==================');
        Log::info('>>> Start deleting temporary backup folder...');
        $this->line('=================== Part 7: Delete Temporary Backup Folder ==================');
        $this->info('>>> Start deleting temporary backup folder...');
        if ($backupFolderIsExists) {
            File::deleteDirectory($backupFolderBasePath);
        }
        $this->comment('>>> Finished deleting temporary backup folder!');
        Log::info('>>> Finished deleting temporary backup folder!');

        // Finished
        $this->info('=================== Backup Finished!!!  ==================');
        Log::info('=================== Backup Finished!!!  ==================');
    }

    /**
     * Convert bytes to human readable format
     *
     * @param integer   $size - bytes size
     * @param integer   $precision - bytes precision after comma
     */
    function convertBytesToHumanReadable(int $size, int $precision = 2)
    {
        $base = log($size, 1024);
        $suffixes = array(' Bytes', ' KB', ' MB', ' GB', ' TB');

        return round(pow(1024, $base - floor($base)), $precision) .' '. $suffixes[floor($base)];
    }

    /**
     * Get folder size
     *
     * @param string    $filePath - file path
     */
    function getFolderSize(string $filePath)
    {
        $folderSize = 0;
        foreach(File::allFiles($filePath) as $file) {
            $folderSize += $file->getSize();
        }

        return $this->convertBytesToHumanReadable($folderSize);
    }
}
