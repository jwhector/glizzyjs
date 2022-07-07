import Bot from './Bot';
require('dotenv').config();

const express = require('express');
const PORT = process.env.PORT || 5000;

express().listen(PORT, () => console.log(`Listening on ${ PORT }`));

const bot = new Bot();

bot.client.login(process.env.TOKEN);

bot.client.once('ready', () => {
	bot.initialize();
});
