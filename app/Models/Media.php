<?php

namespace App\Models;
use Spatie\MediaLibrary\Helpers\TemporaryDirectory;

use Spatie\MediaLibrary\Models\Media as BaseMedia;

class Media extends BaseMedia
{
    protected $appends = [
        'url',
        // 'thumb_url'
    ];

    public function getUrlAttribute(): string
    {
        return $this->getFullUrlFromS3();
    }

    public function getFullUrlFromS3($type = ''): string 
    {
        $relatedModel = $this->model;
        if($this->disk === 'public') return $this;
        $modelExist = Media::where('model_type', $this->model_type)->where('model_id', $this->model_id)->where('collection_name', 'temporary_files'.$this->collection_name.$this->id)->get()->first();
        if(!$modelExist) {
            $res = $this->copy($relatedModel, 'temporary_files'.$this->collection_name.$this->id, 'public');
            if($type) return $res->getFullUrl($type);
            return $res->getFullUrl();
        } else {
            if($type) return $modelExist->getFullUrl($type);
            return $modelExist->getFullUrl();
        }
        return '';
    }

    public function getPathFromS3($type = ''): string 
    {
        $relatedModel = $this->model;
        if($this->disk === 'public') return $this;
        $modelExist = Media::where('model_type', $this->model_type)->where('model_id', $this->model_id)->where('collection_name', 'temporary_files'.$this->collection_name.$this->id)->get()->first();
        if(!$modelExist) {
            $res = $this->copy($relatedModel, 'temporary_files'.$this->collection_name.$this->id, 'public');
            if($type) return $res->getPath($type);
            return $res->getPath();
        } else {
            if($type) return $modelExist->getPath($type);
            return $modelExist->getPath();
        }
        return '';
    }

    public function getFromS3()
    {
        $relatedModel = $this->model;
        if($this->disk === 'public') return $this;
        $modelExist = Media::where('model_type', $this->model_type)->where('model_id', $this->model_id)->where('collection_name', 'temporary_files'.$this->collection_name.$this->id)->get()->first();
        if(!$modelExist) {
            $res = $this->copy($relatedModel, 'temporary_files'.$this->collection_name.$this->id, 'public');
            return $res;
        } else {
            return $modelExist;
        }
    }

    public function getMediaDownloadUrl(): string
    {
        return url('api/storage/media/'.$this->id);
    }

    public function getThumbUrlAttribute(): string
    {
        if (!empty($this->getFullUrlFromS3('thumb'))) {
            return $this->getFullUrlFromS3('thumb');
        }

        return $this->getFullUrlFromS3();
    }
}
