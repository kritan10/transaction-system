import { connect } from 'amqplib';
import { v4 } from 'uuid';
import customResponseHandler from '../utils/response-handler.js';
import { balanceClient, userClient } from '../client/index.js';

// /**
//  *
//  * @param {{ method: String, args: Object }} request
//  */
// async function requestBroker(request) {
// 	const queue = 'rpc_queue';

// 	const connection = await connect('amqp://localhost');
// 	const channel = await connection.createChannel();

// 	const q = await channel.assertQueue('', { exclusive: true });

// 	const correlationId = v4();

// 	channel.sendToQueue(queue, Buffer.from(JSON.stringify(request)), { correlationId: correlationId, replyTo: q.queue });
// 	channel.consume(q.queue, (msg) => {
// 		if (msg.properties.correlationId == correlationId) {
// 			const res = msg.content.toString();
// 			console.log(`Result ${res}`);
// 			customResponseHandler(JSON.parse(res));
// 		}
// 	});
// }

class LoadBalancer{
	static port = 0;
	static USER_CLIENT = 0;
	static BALANCE_CLIENT = 1;
	
	constructor(){}

	getClient(client){
		if(port > 0){
			port++
			return this.getClientByType(client, port)
		}else{
			port = 0
			return this.getClientByType(client, port)
		}

	}

	getClientByType(type, port){
		if(type === LoadBalancer.USER_CLIENT){
			return userClient
		}
		if(type === LoadBalancer.BALANCE_CLIENT){
			return balanceClient
		}
	}
	

}

async function requestBroker(call, callback) {
	const client = 
}


export { requestBroker };
