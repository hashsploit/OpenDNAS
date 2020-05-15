<?php
/*
DNASrep - DNAS replacement server
Copyright (C) 2016 the_fog@1337.rip
*/

// get the body of the initial packet
$packet  = file_get_contents('php://input');
$gameID  = substr($packet, 0x1b, 8);
$qrytype = substr($packet, 0, 4);
$fname   = bin2hex($gameID)."_".bin2hex($qrytype);

// get the answer for replaying
$packet = file_get_contents('./packets/'.$fname);
if (empty($packet)) {
	$packet = file_get_contents('./error.raw');
}

// send the answer
header("HTTP/1.0 200 OK");
header("Content-Type: image/gif");
header("Content-Length: " . strlen($packet));
echo $packet;
