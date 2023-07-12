
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
        <p>RRB / ITC</p>
        <p>1300 Pennsylvania Avenue NW, Suite 470</p>
        <p>Washington, DC 20004 USA</p>
        @else
        <p>{{ $mailingAddress }}</p>
        @endif
        <p>www.immap.org</p>
    </td></tr>
</table>
