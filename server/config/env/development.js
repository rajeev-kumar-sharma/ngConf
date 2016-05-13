'use strict';

// =================================================================
// Dev enviroment dependencies =====================================
// =================================================================
module.exports = {
	db: {
		uri: 'mongodb://localhost/ng-conf',
		options: {
			user: '',
			pass: ''
		}
	},
	log: {
		// Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
		format: 'dev',
		// Stream defaults to process.stdout
		// Uncomment to enable logging to a log on the file system
		options: {
			//stream: 'access.log'
		}
	},
	app: {
		title: 'Node Learning - Development Environment'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	},
	sendgrid: {
		to: ['info@placeklean.com', 'rkbatwada@gmail.com', 'rajeev.sharma@metacube.com'],
		toname: ['placeKlean', 'Rohit', 'Rajeev'],
		from: process.env.MAIL_FROM || 'admin@example.com',
		fromname: process.env.MAILER || 'Mr. Admin',
		apiKey: process.env.SENDGRID_API_KEY || 'SENDGRID_API_KEY'
	}
};
