/* eslint-disable import/no-nodejs-modules */
const path = require('path');

module.exports = {
	name: 'createrandomevent',
	aliases: ['random', 'event'],
	description: 'Trigger a random event.',
	hidden: 'true',
	async execute(p) {
		const { randomEvent } = require(path.join(__dirname, '../../games/randomevents.js'));
		await randomEvent(p.msg, p.gobbler);
	},
};