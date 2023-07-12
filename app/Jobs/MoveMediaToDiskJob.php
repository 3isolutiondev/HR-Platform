<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\Models\Media;
use Spatie\MediaLibrary\PathGenerator\PathGeneratorFactory;
use Illuminate\Support\Facades\Log;

class MoveMediaToDiskJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $diskNameFrom;
    public $diskNameTo;
    public $media;

    /**
     * Create a new job instance.
     *
     * @param  Media  $media
     * @param $diskNameFrom
     * @param $diskNameTo
     */
    public function __construct(Media $media, $diskNameFrom, $diskNameTo)
    {
        $this->media = $media;
        $this->diskNameFrom = $diskNameFrom;
        $this->diskNameTo = $diskNameTo;
    }

    /**
     * Execute the job.
     *
     * @return void
     * @throws \Exception
     */
    public function handle()
    {
        // check if media still on same disk
        if($this->media->disk != $this->diskNameFrom) {
            throw new \Exception("Current media disk `{$this->media->disk}` is not the expected `{$this->diskNameFrom}` disk.");
        }

        // generate the path to the media
        $mediaPath = PathGeneratorFactory::create()
            ->getPath($this->media);

        $diskFrom = Storage::disk($this->diskNameFrom);
        $filesInDirectory = $diskFrom->allFiles($mediaPath);

        // dispatch jobs foreach file (recursive) in the storage map for the media item
        foreach ($filesInDirectory as $fileInDirectory) {
            try{
                $diskFrom = Storage::disk($this->diskNameFrom);
                $diskTo = Storage::disk($this->diskNameTo);
                $mv = $diskTo->put(
                    $fileInDirectory,
                    $diskFrom->readStream($fileInDirectory)
                );
            }
            catch(Exception $e) {
                Log::error($e->getMessage());
                throw new \Exception('Failed to upload');
            }
        }
        
        $this->media->disk = $this->diskNameTo;
        $this->media->save();
    }
}