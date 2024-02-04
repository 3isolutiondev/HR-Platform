
<style>
    @import url('https://fonts.googleapis.com/css?family=Barlow&display=swap');
    table {
        font-family: 'Barlow', sans-serif !important;
        font-size: 12pt;
    }
    .footer-container {
        text-align: center;
        width: 100%;
        display: block;
        position: relative;
        padding-bottom: 10mm;
        /* padding-top: 10mm; */
        /* margin-bottom: -1mm; */
    }
    .footer-container p {
        font-weight: bold;
        margin-bottom: 0;
        margin-top: 0.5mm;
        font-size: 10pt;
    }
</style>
<table class="footer-container">
    <tr><td style="text-align: center;">
        @if($sharedCost == 1)
                <p>10 rue Stanislas Torrents</p>
                <p>13006, Marseille, France</p>
                <p>3isolution.org</p>
        @else
        <p>{{ $mailingAddress }}</p>
        @endif
        <p>3isolution.org</p>
    </td></tr>
</table>
