<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

/**
 * JobProfileExport is a configuration file for exporting Job profiles data of selected status page into CSV file
 */
class JobProfileExport implements FromArray, withHeadings, ShouldAutoSize, withStyles
{
    protected $data, $steps, $job_name, $job_status;

    public function __construct($data, $job_name, $job_status)
    {
        $this->data = $data;
        $this->steps = ['Name','Email', 'Degree', 'Education', 'Current Country', 'Nationality', 'Applied Date'];
        $this->job_status = $job_status;
        $this->job_name = $job_name;
    }

    public function headings(): array
    {
        return [
            [$this->job_name .' #Step: '. $this->job_status . ' - ' . date('d-m-Y')],
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
