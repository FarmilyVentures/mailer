// handler.js

'use strict';

const AWS = require('aws-sdk');
const SES = new AWS.SES();

function sendMail(formData, cb) {
	let emailParams = {};

	if (formData['cart']) {
		const {
			from,
			contact,
			address,
			tel,
			body,
			cart,
			frequency,
			payment,
			source,
			price,
		} = formData;

		const orderList = cart.map(({ name, value }) => `- ${value} ${name}\n`);

		emailParams = {
			Source: 'mailgun@awitherow.com',
			ReplyToAddresses: [
				from,
			],
			Destination: {
				ToAddresses: [
					'aloha@alohawai.farm',
				],
			},
			Message: {
				Body: {
					Text: {
						Charset: 'UTF-8',
						Data: `Contact: ${contact}\nEmail: ${from}\nPhone: ${tel}\nAddress: ${address}\nOrder:\n${orderList}\nSource: ${source}\nFrequency: ${frequency}\nPayment Method: ${payment}\nCost: ${price}\nDetails: ${body}`,
					},
				},
				Subject: {
					Charset: 'UTF-8',
					Data: `Veggie Box Order | ${contact} - $${price}`,
				},
			},
		};
	} else {
		const { contact, from, subject, body } = formData;

		emailParams = {
			Source: 'mailgun@awitherow.com',
			ReplyToAddresses: [
				from,
			],
			Destination: {
				ToAddresses: [
					'aloha@alohawai.farm',
				], // SES RECEIVING EMAIL
			},
			Message: {
				Body: {
					Text: {
						Charset: 'UTF-8',
						Data: `Contact: ${contact}\nEmail: ${from}\n\n ${body}`,
					},
				},
				Subject: {
					Charset: 'UTF-8',
					Data: `INQUIRY | [${contact}] - ${subject}`,
				},
			},
		};
	}

	SES.sendEmail(emailParams, cb);
}

module.exports.mail = (event, context, callback) => {
	const formData = JSON.parse(event.body);

	sendMail(formData, function(err, data) {
		const response = {
			statusCode: err ? 500 : 200,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': 'https://alohawai.farm',
			},
			body: JSON.stringify({
				message: err ? err.message : data,
			}),
		};

		callback(null, response);
	});
};
