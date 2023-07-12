<?php

namespace App\Models\Repository;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\Models\Media;
use Spatie\MediaLibrary\HasMedia\HasMedia;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;

class Repository extends Model implements HasMedia {

    use HasMediaTrait;

    protected $fillable = ['category_id', 'name', 'media_id', 'attachments_id', 'file_name', 'download_url',
        'file_url', 'status', 'type', 'is_upload', 'can_be_downloaded'];

    protected $hidden = ['created_at', 'updated_at'];

    protected $table="repository";

    function category(){
        return $this->belongsTo('App\Models\Repository\Repository_category', 'category_id');
    }

    function section() {
        return $this->hasMany('App\Models\Repository\Repository_section', 'repository_id');
    }

    function holiday() {
        return $this->hasMany('App\Models\Repository\Repository_holiday', 'category_id');
    }

    function media() {
        return $this->belongsTo('Spatie\MediaLibrary\Models\Media', 'media_id');
    }

    public function getFromS3($media, $type = '')
    {
        $relatedModel = $media->model;
        $modelExist = Media::where('model_type', $media->model_type)->where('model_id', $media->model_id)->where('collection_name', 'temporary_files'.$this->collection_name.$this->id)->get()->first();
        if(!$modelExist) {
            $res = $media->copy($relatedModel, 'temporary_files'.$media->collection_name.$media->id, 'public');
            return $res;
        }
        return $modelExist;
    }

    function getMediaFromS3() {
        $media = Media::where('id', $this->media_id)->first();
        if($media) {
            $mediaFromS3 = $this->getFromS3($media);
            return $mediaFromS3;  
        }
        
        return null;
    }
}
