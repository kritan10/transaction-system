/**
 * This function is a simple utility logger to log incoming and outgoing websocket messages.
 * @param {} socket The connected client instance
 * @param {boolean} enabled Whether to enable the logger
 * @returns void
 */
export function logIncomingAndOutgoingEvents(socket, enabled) {
	if (!enabled) return;
	socket.onAny((eventName) => {
		console.log(`incoming event: ${parseEvent(eventName)}`);
	});

	socket.onAnyOutgoing((eventName) => {
		console.log(`outgoing event: ${parseEvent(eventName)}`);
	});
}

/**
 * This function parses event code to their corresponding names.
 * @param {number} eventName the event code
 * @returns event name
 */
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
		case 7:
			return 'START_QR_TIMER';
		case 8:
			return 'DISSOLVE_QR';
		default:
			return 'UNKNOWN_EVENT';
	}
}
