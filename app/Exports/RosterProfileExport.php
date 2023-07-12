<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

/**
 * RosterProfileExport is a configuration file for exporting profiles data of Roster Process selected and for Step selected inside Roster page into CSV file
 */
class RosterProfileExport implements FromArray, withHeadings, ShouldAutoSize, withStyles
{
    protected $data, $steps, $roster_name, $roster_step;

    public function __construct($data, $roster_name, $roster_step)
    {
        $this->data = $data;
        $this->steps = ['Name','Email', 'Degree', 'Education', 'Current Country', 'Nationality', 'Applied Date'];
        $this->roster_step = $roster_step;
        $this->roster_name = $roster_name;
    }

    public function headings(): array
    {
        return [
            [$this->roster_name .' #Step: '. $this->roster_step . ' - ' . date('d-m-Y')],
            $this->steps
        ];
    }

    public function array(): array
    {
        return [$this->data];
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->mergeCells('A1:G1');
        $sheet->getStyle('A1:G1')->getFont()->setBold(true);
        $sheet->getStyle('A2:G2')->getFont()->setBold(true);
        $sheet->getStyle('A1:G1')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('A1:G' . strval(count($this->data) + 2))->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    'color' => ['argb' => '00000000'],
                ],
            ]
        ]);
    }
}
