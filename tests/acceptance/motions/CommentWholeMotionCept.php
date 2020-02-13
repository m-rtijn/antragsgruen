<?php

/** @var \Codeception\Scenario $scenario */
$I = new AcceptanceTester($scenario);
$I->populateDBData1();

$I->wantTo('write a comment, but forget my name');
$I->gotoConsultationHome()->gotoMotionView(2);

$I->see('Kommentar schreiben', 'section.comments');
$I->executeJS('$("#comment_-1_-1_name").removeAttr("required");');
$I->fillField('#comment_-1_-1_name', '');
$I->fillField('#comment_-1_-1_email', 'test@example.org');
$I->fillField('#comment_-1_-1_text', 'Some Text');
$I->submitForm('section.comments .commentForm', [], 'writeComment');

$I->see('Bitte gib deinen Namen an');
$I->see('Kommentar schreiben', 'section.comments');
$I->seeInField('#comment_-1_-1_name', '');
$I->seeInField('#comment_-1_-1_email', 'test@example.org');
$I->seeInField('#comment_-1_-1_text', 'Some Text');


$I->wantTo('enter the missing data');
$I->fillField('#comment_-1_-1_name', 'My Name');
$I->submitForm('section.comments .commentForm', [], 'writeComment');

$I->see(mb_strtoupper('My Name'), 'section.comments .motionComment');
$I->see('Some Text', 'section.comments .motionComment');
$I->dontSeeElementInDOM('section.comments .motionComment .delLink');



$I->wantTo('see the comment on the sidebar and the feed');
$I->gotoConsultationHome();
$I->see('My Name', '#sidebar .comments');
$I->click('#sidebar .feeds a');
$I->click('.feedComments');
$I->seeInPageSource('My Name');
$I->gotoConsultationHome();
$I->click('#sidebar .feeds a');
$I->click('.feedAll');
$I->seeInPageSource('My Name');




$I->wantTo('delete the comment');
$I->gotoConsultationHome();
$I->loginAsStdAdmin();
$I->gotoConsultationHome()->gotoMotionView(2);

$I->see('Kommentar schreiben', 'section.comments');

$I->seeElementInDOM('section.comments .motionComment .delLink');

$I->executeJS('$("section.comments #comment1 .delLink button").trigger("click");');
$I->wait(0.5);
$I->seeBootboxDialog('Wirklich löschen');
$I->acceptBootboxConfirm();

$I->dontSee('My Name', 'section.comments .motionComment');
$I->dontSee('Some Text', 'section.comments .motionComment');
