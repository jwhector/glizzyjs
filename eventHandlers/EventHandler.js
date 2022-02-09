class EventHandler {
	constructor(gobbler) {
		const fs = require('fs');
		const dir = './eventHandlers';
		const files = fs.readdirSync(dir).filter(file => file !== 'EventHandler.js');

		for (const file in files) {
			console.log(files[file]);
			gobbler.client.on(files[file].slice(0, -3), require('./' + files[file]).handle.bind(gobbler));
		}
	}
}

module.exports = EventHandler;