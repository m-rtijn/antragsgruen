<?php

use app\models\db\Motion;
use yii\helpers\Html;

/**
 * @var Motion[] $motions
 */

if (count($motions) === 0) {
    $pdf = new TCPDF();
    $pdf->AddPage();
    $pdf->Output('Motions.pdf', 'I');

    die();
}

$pdfLayout = $motions[0]->motionType->getPDFLayoutClass();
$pdf       = $pdfLayout->createPDFClass();

// set document information
$pdf->SetCreator(Yii::t('export', 'default_creator'));
$pdf->SetAuthor(Yii::t('export', 'default_creator'));
$pdf->SetTitle(Yii::t('export', 'all_motions_title'));
$pdf->SetSubject(Yii::t('export', 'all_motions_title'));


try {
    foreach ($motions as $motion) {
        \app\views\motion\LayoutHelper::printToPDF($pdf, $pdfLayout, $motion);

        $amendments = $motion->getVisibleAmendmentsSorted();
        foreach ($amendments as $amendment) {
            \app\views\amendment\LayoutHelper::printToPDF($pdf, $pdfLayout, $amendment);
        }
    }
} catch (Exception $e) {
    echo 'Error: ' . Html::encode($e);
    die();
}

$pdf->Output('Motions-with-amendments.pdf', 'I');

die();
