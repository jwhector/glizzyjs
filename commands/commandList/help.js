/* eslint-disable no-unused-vars */
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Wait... you know this one!',
	async execute(p) {
		const embed = new Discord.MessageEmbed().setTitle('Bot Commands').setColor('#ff4a7a');

		const commandFiles = fs.readdirSync('./commands/commandList').filter(file => file.endsWith('.js'));
		// commandFiles = commandFiles.slice(1);
		// console.log(commandFiles);

		for (const file of commandFiles) {
			const command = require(`./${file}`);
			if (Object.keys(command).length) {
				const description = command.description.concat(command.example ? '\n Example: '.concat(command.example) : '').concat(command.aliases ? '\n Aliases: '.concat(command.aliases) : '');
				if (!command.hidden) {
					embed.addField('$'.concat(command.name), `${description}`);
				}
			}
		}
        
		p.send(embed);
	},
};