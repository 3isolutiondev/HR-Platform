<?php

namespace App\Console\Commands;

use App\Jobs\MoveMediaToDiskJob;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\Models\Media;

class MoveMediaToDiskCommand extends Command
{
    protected $signature = 'move-media-to-disk {fromDisk} {toDisk}';

    protected $description = 'Move media from disk to a new disk';

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     * @throws \Exception
     */
    public function handle()
    {
        $diskNameFrom = $this->argument('fromDisk');
        $diskNameTo = $this->argument('toDisk');

        $this->checkIfDiskExists($diskNameFrom);
        $this->checkIfDiskExists($diskNameTo);

        // dd(Storage::disk('s3')->allFiles(''));

        $allMedia = Media::where('disk', $diskNameFrom)
            ->chunk(1000, function ($medias) use ($diskNameFrom, $diskNameTo) {
                /** @var Media $media */
                foreach ($medias as $media) {
                    dispatch(new MoveMediaToDiskJob($media, $diskNameFrom, $diskNameTo));
                }
            });
    }

    /**
     * Check if disks are set in the config/filesystem.
     *
     * @param $diskName
     * @throws \Exception
     */
    private function checkIfDiskExists($diskName) {
        if(!config("filesystems.disks.{$diskName}.driver")) {
            throw new \Exception("Disk driver for disk `{$diskName}` not set.");
        }
    }
}