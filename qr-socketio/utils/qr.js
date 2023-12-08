import { Buffer } from 'node:buffer';

import Jimp from 'jimp';
import decodeQR from '@paulmillr/qr/decode.js';
import { QRCodeCanvas } from '@loskir/styled-qr-code-node';

export async function generateFancyQR(data) {
	const qrcode = new QRCodeCanvas({ data: data });
	const encodedQR = await qrcode.toDataUrl('png');
	return encodedQR;
}

export async function decodeImageQR(qrdata) {
	const base64Image = qrdata.replace('data:image/png;base64,', '');
	const buffer = Buffer.from(base64Image, 'base64');
	const image = await Jimp.read(buffer);
	const decoded = decodeQR(image.bitmap);
	console.log(decoded);
	return decoded;
}
