class Command {
	constructor(gobbler) {
		this.gobbler = gobbler;
		this.commands = getCommands();
	}

	async execute(msg) {
		const commandMsg = checkPrefix(this.gobbler, msg, this.commands);
		if (!commandMsg) return;

		// console.log('EXECUTE');

		const command = this.commands.get(commandMsg.command);

		const params = initParams(msg, commandMsg.command, commandMsg.args, this.gobbler);

		if (await checkPermissions(msg, command)) {
			command.execute(params);
		}
	}
}

function getCommands() {
	const fs = require('fs');
	const commands = new (require('discord.js').Collection)();
	// eslint-disable-next-line no-path-concat
	const commandFiles = fs.readdirSync(__dirname + '/commandList').filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const command = require(`./commandList/${file}`);
		commands.set(command.name, command);
		if (command.aliases) {
			command.aliases.forEach((element) => {
				commands.set(element, command);
			});
		}
	}

	return commands;
}

function checkPrefix(gobbler, msg, commands) {
	if (!msg.content.startsWith(gobbler.prefix)) return null;

	const input = msg.content.slice(gobbler.prefix.length).trim();
	if (!input.length) return null;
    
	const args = msg.content.slice(1, msg.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!commands.has(command)) return null;

	return { command, args };
}

async function checkPermissions(message, cmd) {
	if (cmd.permissions) {
		const authorPerms = message.member.hasPermission(cmd.permissions);
		if (!authorPerms) {
			await message.channel.send('You do not have the correct permissions for this command!');
			return false;
		}
	}
	return true;
}

function initParams(msg, cmd, args, gobbler) {
	const param = {
		msg,
		cmd,
		args,
		'author': msg.author,
		'channel': msg.channel,
		'client': gobbler.client,
		'guild': gobbler.guild,
		'users': gobbler.users,
		gobbler,
		'sequelize': gobbler.sequelize,
		'timer': gobbler.timer,
	};

	param.getAuthor = async () => await param.users.findUser(param.author.id, param.client);

	param.getUser = async (id) => await param.users.findUser(id, param.client);

	param.getMember = () => msg.guild.members.cache.get(param.author.id);

	param.send = async (message) => await param.channel.send(message);

	return param;
}

module.exports = Command;