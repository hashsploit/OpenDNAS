const example_game_id = [
	// 0x0d, 0x89, 0xfd, 0x58, 0x3d, 0x6c, 0x1c, 0x47
	"\x0d", "\x89", "\xfd", "\x58", "\x3d", "\x6c", "\x1c", "\x47"
];

const example_qrytype = [
	// 0x01, 0x18, 0x80, 0x01
	"\x01", "\x18", "\x80", "\x01"
];

const expected_empty_response = [
	"\u0001", "\u0018", "\u0000", "\u0004", "\u0000", "\u0000", "\u0000", "\u0000",
	"\u0000", "\u0000", "\u0000", "\u0000", "\u0000", "\u0000", "\u0000", "\u0000",
	"\u0000", "\u0000", "\u0000", "\u0000", "\u0000", "\u0000", "\u0000", "\u0000",
	"\u0000", "\u0000", "\u0000", "\u0000", "\u0000", "\u0000", "\u0000", "\u0000",
	"\u0000", "\u0000", "\u0000", "\u0000", "\u0000", "\u0000", "\u0000", "\u0001",
	"@"
];

$("#test_submit").click(function() {

	lockTest();

	tsl("==== Starting DNAS Tests ====");

	// 1st request
	tsl("Testing v2.5_i-connect endpoint with an empty payload ...");
	req("v2.5_i-connect", null, function(data) {
		// verify data
		if (data) {
			var array = data.split('');
			if (arraysEqual(expected_empty_response, array)) {
				tsl("<span style='color:#008800'>Successfully got expected response from v2.5_i-connect endpoint.</span>");
			}
		} else {
			tsl("<span style='color:#FF4444'>Failed to get expected response.</span>");
		}

		// 2nd request
		tsl("Testing v2.5_i-others endpoint with an empty payload ...");
		req("v2.5_others", null, function(data) {

			if (data) {
				var array = data.split('');
				if (arraysEqual(expected_empty_response, array)) {
					tsl("<span style='color:#008800'>Successfully got expected response from v2.5_others endpoint.</span>");
				}
			} else {
				tsl("<span style='color:#FF4444'>Failed to get expected response.</span>");
			}

			var example_payload = createPacket(example_qrytype, example_game_id);

			// 3rd request
			tsl("Testing v2.5_i-others endpoint with a proper payload ...");
			req("v2.5_others", example_payload, function(data) {


				if (data) {
					var array = data.split('');
					if (arraysEqual(expected_empty_response, array)) {
						tsl("<span style='color:#FF4444'>Failed to get a successful DNAS response.</span>");
					} else {
						tsl("<span style='color:#008800'>Successfully got expected DNAS response.</span>");
					}
				} else {
					tsl("<span style='color:#FF4444'>Failed to get a response.</span>");
				}

				tsl("DNAS test finished successfully.");
				unlockTest();
			}, function(errorMessage) {
				tsl("DNAS test failed.");
				unlockTest();
			});
		}, function(errorMessage) {
			tsl("DNAS test failed.");
			unlockTest();
		});
	}, function(errorMessage) {
		tsl("DNAS test failed.");
		unlockTest();
	});


});

// Generate DNAS query packet
function createPacket(queryType, gameId) {
	var payload = [];
	payload = payload.concat(queryType);
	// Query | Other data              | Game ID  | Other Data
	// ####  | ####################### | ######## | ####
	for (var i=0; i<23; i++) {
		payload.push("\x00");
	}

	// Set Game ID
	payload = payload.concat(gameId);

	//return payload.join('');
	// Package array of bytes to array buffer to send raw-data
	var arrayBuffer = new ArrayBuffer(payload.length);
	var writer = new Uint8Array(arrayBuffer);
	var payloadStr = payload.join('');
	for (var i=0; i<payloadStr.length; i++) {
		writer[i] = payloadStr.charCodeAt(i);
	}
	return arrayBuffer;
}

// Lock button
function lockTest() {
	$("#test_submit").prop("disabled", true);
	$("#test_submit").attr("value", "Running DNAS test queries ...");
}

// Unlock button
function unlockTest() {
	$("#test_submit").prop("disabled", false);
	$("#test_submit").attr("value", "Run DNAS Test Query");
}

// Check if arrays are equal
function arraysEqual(a, b) {
	if (a === b) {
		return true;
	}
	if (a == null || b == null) {
		return false;
	}
	if (a.length != b.length) {
		return false;
	}
	for (var i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) {
			return false;
		}
	}
	return true;
}

// Make a request
function req(endpoint, payload, onSuccess, onError) {
	var rand = Math.floor((Math.random() * 999999) + 100000);
	if (payload) {
		if (payload instanceof ArrayBuffer) {
			tsl("<span style='color:#888888'><b>&gt;</b> Sending [ArrayBuffer] of " + payload.byteLength + " bytes to " + escapeHTML(endpoint) + "?_=" + rand + " ...</span>");
		} else {
			tsl("<span style='color:#888888'><b>&gt;</b> Sending " + payload.toString() + " bytes to " + escapeHTML(endpoint) + "?_=" + rand + " ...</span>");
		}
	} else {
		tsl("<span style='color:#888888'><b>&gt;</b> Sending an empty payload to " + escapeHTML(endpoint) + "?_=" + rand + " ...</span>");
	}
	$.ajax({
		url: endpoint + "?_=" + rand,
		method: "POST",
		data: payload,
		processData: false,
		//contentType: "image/gif",
		cache: false,
		success: function(data, status) {
			// On success
			var bytes = [];
			for (var i=0; i<data.length; i++) {
				bytes = bytes.concat([data.charCodeAt(i)]);
			}
			tsl("<span style='color:#888888'><b>&gt;</b> Response: " + toHexString(bytes) + "</span>");
			onSuccess(data);
		},
		error: function(jqXHR, status) {
			tsl("<span style='color:#FF4444'>Failed to get a response from " + endpoint + ": [" + status + "] " + jqXHR.status + " " + jqXHR.statusText + "</span>");
			onError(status);
		}
	});
}

// Test Status Log
function tsl(str) {
	var date = new Date();
	var hours = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours());
	var minutes = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
	var seconds = (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
	var millis = (date.getMilliseconds() < 10 ? "00" + date.getMilliseconds() : (date.getMilliseconds() < 100 ? "0" + date.getMilliseconds() : date.getMilliseconds()));

	var timestamp = hours + ":" + minutes + ":" + seconds + "." + millis;
	$("#test_status").append(timestamp + " " + str + "\n");
}


// Escape HTML
function escapeHTML(unsafe) {
	return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/\n/g, "<span style='color:#444444'><b>\\n</b></span>").replace(/\r/g, "<span style='color:#444444'><b>\\r</b></span>");
}

function toHexString(byteArray) {
	return Array.from(byteArray, function(byte) {
		return "0x" + ('0' + (byte & 0xFF).toString(16)).slice(-2);
	}).join(', ');
}

// Enable test button
$("#test_submit").prop("disabled", false);
