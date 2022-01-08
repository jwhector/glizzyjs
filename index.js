const Gobbler = require('./Gobbler.js');
const { token } = require('./config.json');

const bot = new Gobbler();

bot.client.login(token);

bot.client.once('ready', () => {
    bot.initialize();
});

