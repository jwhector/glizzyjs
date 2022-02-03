const Gobbler = require('./Gobbler.js');
// const { token } = require('./config.json');
require('dotenv').config();

const bot = new Gobbler();

// console.log(process.env.TOKEN);

bot.client.login(process.env.TOKEN);


bot.client.once('ready', () => {
	bot.initialize();
});

