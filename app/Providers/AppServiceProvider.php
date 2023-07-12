<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Collection::macro('paginate', function($perPage, $total = null, $page = null, $pageName = 'page') {
            $page = $page ?: LengthAwarePaginator::resolveCurrentPage($pageName);
            $lap = new LengthAwarePaginator(
                $this->forPage($page, $perPage),
                $total ?: $this->count(),
                $perPage,
                $page,
                [
                    'path' => LengthAwarePaginator::resolveCurrentPath(),
                    'pageName' => $pageName,
                ]
            );

            $data = $lap->values();
            if (!is_array($data)) {
                $data = $data->flatten();
            }

            return [
                'current_page' => $lap->currentPage(),
                'data' => $data,
                'first_page_url' => $lap->url(1),
                'from' => $lap->firstItem(),
                'last_page' => $lap->lastPage(),
                'last_page_url' => $lap->url($lap->lastPage()),
                'next_page_url' => $lap->nextPageUrl(),
                'per_page' => $lap->perPage(),
                'prev_page_url' => $lap->previousPageUrl(),
                'to' => $lap->lastItem(),
                'total' => $lap->total(),
            ];
        });
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
