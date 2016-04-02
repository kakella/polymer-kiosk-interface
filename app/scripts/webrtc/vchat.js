'use strict';

var video_out = document.getElementById("vid-box");

function login() {
	console.log('customer login');

	var phone = window.phone = PHONE({
	    number        : "customer", // listen on username line else Anonymous
	    publish_key   : 'pub-c-561a7378-fa06-4c50-a331-5c0056d0163c', // Your Pub Key
	    subscribe_key : 'sub-c-17b7db8a-3915-11e4-9868-02ee2ddab7fe', // Your Sub Key
	});

	phone.ready(function() {
		console.log("customer started");
		errWrap(makeCall);
	});

	phone.receive(function(session) {
		console.log("video");
    session.connected(function(session) {
			video_out.appendChild(session.video);
			showModal();
		});
    session.ended(function(session) {
			console.log('ended');
			video_out.innerHTML='';
		});
	});

	return false;
}

function makeCall() {
	console.log('calling');
	if (!window.phone) {
		console.log("Login First!");
	} else {
		phone.dial('agent');
	}
	return false;
}

function showModal() {
    $("#showModal").click();
}

function errWrap(fxn){
	console.log('in errwrap');
	try {
		return fxn();
	} catch(err) {
		console.log("WebRTC is currently only supported by Chrome, Opera, and Firefox");
		console.log("Error:" + err);
		return false;
	}
}
