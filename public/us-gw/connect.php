<?php
/*
DNASrep - DNAS replacement server
Copyright (C) 2016 the_fog@1337.rip
*/

function encrypt3($data, $offset, $length, $des_key1, $des_key2, $des_key3, $xor_seed) {
	$key = $xor_seed;

	for ($i=0; $i<$length; $i=$i+8) {
		$dat = substr($data, $offset+$i, 8);
		for ($t=0; $t<8; $t++) {
			$dat[$t] = $dat[$t] ^ $key[$t];
		}

		$enc = mcrypt_encrypt(MCRYPT_DES, $des_key1, $dat, MCRYPT_MODE_ECB);
		$enc = mcrypt_decrypt(MCRYPT_DES, $des_key2, $enc, MCRYPT_MODE_ECB);
		$enc = mcrypt_encrypt(MCRYPT_DES, $des_key3, $enc, MCRYPT_MODE_ECB);

		for ($t=0; $t<8; $t++) {
			$data[$offset+$i+$t] = $enc[$t];
		}

		$key = $enc;
	}

	return($data);
}


// get the body of the initial packet
$packet  = file_get_contents('php://input');
//                           44, 8
$gameID  = substr($packet, 0x2c, 8);
$qrytype = substr($packet, 0, 4);
$fname   = bin2hex($gameID)."_".bin2hex($qrytype);

// step 0 - create the checksums and keys for the answer packet
//                                 54,   256
$chksum1  = sha1(substr($packet, 0x34, 0x100));
//                                 72,   236
$chksum2  = sha1(substr($packet, 0x48,  0xec));
$fullkey  = substr($chksum2, 0, 0x14*2) . substr($chksum1, 0, 0x0c*2);
$des_key1 = pack("H*", substr($fullkey,    0, 0x10));
$des_key2 = pack("H*", substr($fullkey, 0x10, 0x10));
$des_key3 = pack("H*", substr($fullkey, 0x20, 0x10));
$xor_seed = pack("H*", substr($fullkey, 0x30, 0x10));

// step 1 - prepare the answer
$packet = file_get_contents(__DIR__ . '/packets/' . $fname);
if (empty($packet)) {
	$packet = file_get_contents(__DIR__ . '/error.raw');
} else {
	// step 2 - encrypt with keyset from query packet
	$packet = encrypt3($packet, 0xc8, 0x20, $des_key1, $des_key2, $des_key3, $xor_seed);

	// step 3 - encrypt with envelope keyset
	$packet = encrypt3($packet, 0x28, 0x120, pack("H*", "eb711416cb0ab016"), pack("H*", "ae190174b5ce6339"), pack("H*", "7b01b91880145e34"), pack("H*", "c510a6400a9b022f"));
}

// send the answer
header("HTTP/1.0 200 OK");
//header("Content-Type: image/gif");
header("Content-Length: " . strlen($packet));
echo $packet;

