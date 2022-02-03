const Discord = require('discord.js');
require('discord-reply');


class Gobbler {
	constructor() {
		this.users = require('./models/dbObjs').Users;
		this.items = require('./models/dbObjs').Items;
		this.userItems = require('./models/dbObjs').UserItems;
		this.exchange = require('./models/dbObjs').Exchange;
		this.messages = require('./models/dbObjs').Messages;
		this.userXp = require('./models/dbObjs').UserXp;

		this.client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

		this.prefix = '$';

		this.challenges = new (require('./utils/Challenges'))(this);

		this.timer = new (require('./utils/Timer'))(this);

		this.sequelize = require('./models/dbObjs').sequelize;
	}

	initialize() {
		this.eventHandler = new (require('./eventHandlers/EventHandler'))(this);

		this.messageHandler = new (require('./utils/MessageHandler'))(this);

		this.questions = new (require('./misc/Questions'))(this);
		this.questions.findOld();

		// this.tournament = new (require('./misc/Tournament'))(this);
		// this.tournament.assignRoles();

		this.command = new (require('./commands/command'))(this);
	}
}

module.exports = Gobbler;