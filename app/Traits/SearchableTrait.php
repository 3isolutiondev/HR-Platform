<?php

namespace App\Traits;

trait SearchableTrait
{
    public function scopeSearch($builder, $query, $columns = null)
    {
        if($query){
            $words = explode(' ', $query);
            $words = array_filter($words);

            if(!$columns){
                $columns = $this->searchable;
            }

            $builder->where(function ($builder) use ($words, $columns) {
                foreach ($words as $word) {
                    $builder->where(function ($builder) use ($word, $columns) {
                        foreach ($columns as $column) {
                            if (strpos($column, '.') !== false) {
                                [$relation, $column] = explode('.', $column);
                                $builder->orWhereHas($relation, function ($query) use ($column, $word) {
                                    $query->where($column, 'like', '%' . $word . '%');
                                });
                            } else {
                                $builder->oRwhere($this->getTable() . '.' . $column, 'like', '%' . $word . '%');
                            }
                        }
                    });
                }
            });
        }
    }
}
