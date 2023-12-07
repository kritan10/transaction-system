export function logIncomingAndOutgoingEvents(socket, enabled) {
	if (!enabled) return;
	socket.onAny((eventName) => {
		console.log(`incoming event: ${parseEvent(eventName)}`); // 'hello'
	});

	socket.onAnyOutgoing((eventName) => {
		console.log(`outgoing event: ${parseEvent(eventName)}`); // 'hello'
	});
}

function parseEvent(eventName) {
	switch (eventName) {
		case 1:
			return 'INIT';
		case 2:
			return 'REQUEST_BALANCE';
		case 3:
			return 'DECODE_QR';
		case 4:
			return 'TRANSACTION_STATUS';
		case 5:
			return 'ACCEPT_TRANSACTION';
		case 6:
			return 'REJECT_TRANSACTION';

		default:
			break;
	}
}
