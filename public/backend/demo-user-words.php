<?php
require 'init.php';
$_REQUEST['words'] = "qwe sadw eas";
$_REQUEST['colors'] = "white";

if (!empty($_REQUEST['words'])) {
	$success = $pc->generateFromWords($_REQUEST['words']);
}
if (!$success) {
	echo "SORRY, UNABLE TO GENERATE CROSSWORD FROM YOUR WORDS";
} else { 
	$html = $pc->getHTML($_REQUEST['colors']);
	$words = $pc->getWords();
	echo json_encode($words);
}
