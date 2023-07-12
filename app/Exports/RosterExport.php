<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

/**
 * RosterExport is a configuration file for exporting statistics data of Roster Process selected inside Roster page into CSV file
 */
class RosterExport implements FromArray, withHeadings, ShouldAutoSize, withStyles
{
    protected $statistics, $steps, $roster_name;

    public function __construct($statistics, $roster_name, $roster_steps)
    {
        $this->statistics = $statistics;
        $this->steps = array_merge(['Total'],  $roster_steps->pluck('step')->all());
        $this->roster_name = $roster_name;
    }

    public function headings(): array
    {
        return [
            [$this->roster_name . ' (Statistics) - ' . date('d-m-Y')],
            $this->steps
        ];
    }

    public function array(): array
    {
        return [$this->statistics];
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->mergeCells('A1:H1');
        $sheet->getStyle('A1:H1')->getFont()->setBold(true);
        $sheet->getStyle('A1:H1')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('A1:H3')->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    'color' => ['argb' => '00000000'],
                ],
            ]
        ]);
    }
}
