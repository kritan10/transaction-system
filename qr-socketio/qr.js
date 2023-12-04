import Jimp from 'jimp';
import decodeQR from '@paulmillr/qr/decode.js';
import { QRCodeCanvas } from '@loskir/styled-qr-code-node';

const defaultOptions = {
	width: 256,
	height: 256,
	margin: 0,
	qrOptions: { typeNumber: '0', mode: 'Byte', errorCorrectionLevel: 'L' },
	imageOptions: { hideBackgroundDots: true, imageSize: 1, margin: 0 },
	dotsOptions: { type: 'rounded', color: '#000000', gradient: null },
	backgroundOptions: { color: '#ffffff' },
	image: null,
	dotsOptionsHelper: { colorType: { single: false, gradient: true }, gradient: { linear: true, radial: false, color1: '#9d1b0d', color2: '#46c5ff', rotation: '0' } },
	cornersSquareOptions: { type: 'extra-rounded', color: '#000000', gradient: null },
	cornersSquareOptionsHelper: { colorType: { single: false, gradient: true }, gradient: { linear: false, radial: true, color1: '#52ff3b', color2: '#869de0', rotation: '0' } },
	cornersDotOptions: { type: '', color: '#000000', gradient: null },
	cornersDotOptionsHelper: { colorType: { single: false, gradient: true }, gradient: { linear: true, radial: false, color1: '#b38349', color2: '#aeb579', rotation: '0' } },
	backgroundOptionsHelper: { colorType: { single: true, gradient: false }, gradient: { linear: true, radial: false, color1: '#ffffff', color2: '#ffffff', rotation: '0' } },
};

export async function generateFancyQR(data) {
	const options = { ...defaultOptions, data: data };
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
