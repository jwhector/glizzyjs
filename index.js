const Gobbler = require('./Gobbler.js');
// const { token } = require('./config.json');
require('dotenv').config();

const express = require('express');
const PORT = process.env.PORT || 5000;

express().listen(PORT, () => console.log(`Listening on ${ PORT }`));

const bot = new Gobbler();

// console.log(process.env.TOKEN);

bot.client.login(process.env.TOKEN);


bot.client.once('ready', () => {
	bot.initialize();
});

