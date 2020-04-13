<?php
/*
DNASrep - DNAS replacement server
Collaboration +hashsploit, the_fog, necrobyte
Copyright (C) 2016 the_fog@1337.rip
*/

$debug = false;
if (!empty($_GET['debug'])) {
	if ($_GET['debug'] == "true" || $_GET['debug'] == 1) {
		$debug = true;
		header("Content-Type: plain/text");
		echo hex2bin("01080000");
		die();
	}
}

// get the body of the initial packet
$packet  = file_get_contents('php://input');

$gameID  = substr($packet, 0x1b, 8);
$qrytype = substr($packet, 0, 4);
$fname   = bin2hex($gameID) . "_" . bin2hex($qrytype);

// get the answer for replaying
$packet = file_get_contents(__DIR__ . '/packets/' . $fname);
if (empty($packet)) {
	$packet = file_get_contents(__DIR__ . '/error.raw');
}

// send the answer
header("HTTP/1.0 200 OK");
header("Content-Type: text/html");
header("Content-Length: " . strlen($packet));
echo $packet;
