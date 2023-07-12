<div class="@if(!empty($marginBottom)) {{ $marginBottom }} @else {{'margin-bottom-sm'}} @endif ">
    <h3 class="text-immap-primary font-bold text-uppercase">
        {{ $title }}
    </h3>
    <div class="line-container @if($fullwidth) fullwidth @endif">
        <span class="line-primary"></span>
        <span class="line-dark-grey"></span>
    </div>
</div>
