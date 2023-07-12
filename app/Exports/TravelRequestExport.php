<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Style;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\ConditionalFormatting\Wizard;

/**
 * TravelRequestExport is a configuration file for exporting Travel Requests data of selected filter page into CSV file
 */
class TravelRequestExport implements FromArray, withHeadings, ShouldAutoSize, withStyles
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
        $this->steps = ['Profile ID', 'Full Name', 'Job Title', 'Nationality', 'Project Code', 'TAR Type', 'Purpose', 'Type of Travel', 'Country', 'Duty Station', 'Date Travel', 'Date Return', 'End Date', 'Edit Status'];
    }

    public function headings(): array
    {
        return [
            $this->steps
        ];
    }

    public function array(): array
    {
        return [$this->data];
    }

    public function styles(Worksheet $sheet)
    {
        $greenStyle = new Style(false, true);
        $greenStyle->getFill()
            ->setFillType(Fill::FILL_SOLID)
            ->getStartColor()->setARGB(Color::COLOR_GREEN);
        $greenStyle->getFill()
            ->getEndColor()->setARGB(Color::COLOR_GREEN);
        $greenStyle->getFont()->setColor(new Color(Color::COLOR_BLACK));
       
        $cellRange = 'A2:N' . strval(count($this->data) + 1);
        $conditionalStyles = [];
        $wizardFactory = new Wizard($cellRange);
        $expressionWizard = $wizardFactory->newRule(Wizard::EXPRESSION);
        $expressionWizard->expression('$N1="Latest Approved Travel Request"')
                         ->setStyle($greenStyle);
        $conditionalStyles[] = $expressionWizard->getConditional();


        $sheet->getStyle('A1:N1')->getFont()->setBold(true);
        $sheet->getStyle('A1:N1')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('A1:N' . strval(count($this->data) + 1))->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    'color' => ['argb' => '00000000'],
                ],
            ]
        ]);

        $sheet->getStyle($expressionWizard->getCellRange())
                ->setConditionalStyles($conditionalStyles);
    }
}
