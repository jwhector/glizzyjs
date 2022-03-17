/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
const Promise = require('bluebird');
 
async function randomEvent(message, gobbler) {
	const eventChannel = await message.guild.channels.create('Random event!', {
		type: 'GUILD_TEXT',
		permissionOverwrites: [{
			id: message.guild.roles.everyone,
			deny: ['VIEW_CHANNEL'],
		}]
	});
	const msg = await message.channel.send('A random event has started! Enter the portal to join in and earn XP! Entry will expire 30 seconds after the portal opens.', {
		files: [{ attachment: './pics/blackhole.png', name: 'portal.png'}]
	});
	try {
		await msg.react('☄️');
	} catch (err) {
		console.error(err);
	}
	let timeLeft = 30;
	const players = [];
	const filter = (reaction) => reaction.emoji.name === '☄️';
	const collector = msg.createReactionCollector(filter, { time: 30000 });
	collector.on('collect', async (reaction, reaction_user) => {
		await eventChannel.updateOverwrite(reaction_user.id, {
			VIEW_CHANNEL: true
		});
		await eventChannel.send('Welcome ' + reaction_user.toString() + `! The event will start in ${timeLeft} seconds.`);
		players.push(reaction_user);
		if (timeLeft > 0) Promise.delay(1000).then(() => timeLeft--);
	});

	collector.on('end', async () => {
		await msg.edit('This random event closed!');
		const event = new EmojiMatch(eventChannel,  players, gobbler);
		await event.play();
	});

	// RPS - 2 max
	// Fastest reaction - no max, starts based on time
	// First to match emoji - no max, starts based on time

}

class Game {
	constructor(eventChannel, players, gobbler) {
		this.gobbler = gobbler;
		this.eventChannel = eventChannel;
		this.players = players;
		this.readiedUsers = [];
	}

	async weclome(welcomeMsg) {
		try {
			let pingMsg = '';
			this.players.forEach(player => {
				// eslint-disable-next-line operator-assignment
				pingMsg = pingMsg + `${player.toString()}, `;
			});
			const readyMsg = await this.eventChannel.send(`${pingMsg} ${welcomeMsg}`);
			await readyMsg.react('✅');
			const filter = (reaction, user) => reaction.emoji.name === '✅' && this.players.map(player => player.id).includes(user.id);
			const collector = await readyMsg.createReactionCollector(filter, { time: 60000, max: this.players.length });
			return collector;
		} catch (err) {
			console.error(err);
		}
	}

	async play(welcomeMsg, play_callback) {
		// console.log(this);
		try {
			const collector = await this.welcome(welcomeMsg);
			collector.on('collect', async (reaction, reaction_user) => {
				this.readiedUsers.push(reaction_user.id);
			});
			collector.on('end', async (collected) => {
				const countdownMsg = await this.eventChannel.send('The event will begin in: 10');
				let timeLeft = 9;
				const countdown = async () => {
					if (!timeLeft) {
						await countdownMsg.delete();
						await play_callback();
					} else return Promise.delay(1000).then(async () => {
						await countdownMsg.edit('The event will begin in: ' + timeLeft);
						timeLeft--;
						countdown();
					});
				};
				countdown();
			});
		} catch (err) {
			console.error(err);
		}
	}
}

class EmojiMatch extends Game {
	constructor(eventChannel, players, gobbler) {
		super(eventChannel, players, gobbler);
		this.emojis = ['✌','😂','😝','😁','😱','👉','🙌','🍻','🔥','🌈','☀','🎈','🌹','💄','🎀','⚽','🎾','🏁','😡','👿','🐻','🐶','🐬','🐟','🍀','👀','🚗','🍎','💝','💙','👌','❤','😍','😉','😓','😳','💪','💩','🍸','🔑','💖','🌟','🎉','🌺','🎶','👠','🏈','⚾','🏆','👽','💀','🐵','🐮','🐩','🐎','💣','👃','👂','🍓','💘','💜','👊','💋','😘','😜','😵','🙏','👋','🚽','💃','💎','🚀','🌙','🎁','⛄','🌊','⛵','🏀','🎱','💰','👶','👸','🐰','🐷','🐍','🐫','🔫','👄','🚲','🍉','💛','💚'];
		this.welcomeMsg = 'welcome to Emoji Match! The first to react with the matching emoji on the next message wins the event! React with a ✅ when you\'re ready to go, anyone who readies up will receive bonus XP!';
	}

	async play_callback() {
		try {
			const randomEmoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
			const emojiMsg = await this.eventChannel.send(randomEmoji);
			const filter = (reaction, user) => reaction.emoji.name === randomEmoji && this.players.map(player => player.id).includes(user.id);
			const emojiCollector = emojiMsg.createReactionCollector(filter, { time: 120000, max: 1 });
			emojiCollector.on('collect', async (reaction, reaction_user) => {
				const xpToGive = super.readiedUsers.includes(reaction_user.id) ? 75 : 50;
				await this.eventChannel.send(reaction_user.toString() + ` won the event! Added \`${xpToGive} xp\`!`);
				const db_user = await this.gobbler.users.findUser(reaction_user);
				await this.gobbler.users.addXp(db_user, xpToGive);
			});
			emojiCollector.on('end', async (collected, reason) => {
				await this.eventChannel.send('DEBUG: ' + reason);
				setTimeout(async () => {
					await this.eventChannel.delete();
				}, 120000);
			});
		} catch (err) {
			console.error(err);
		}
	}

	async play() {
		console.log(this);
		try {
			await super.play(this.welcomeMsg, this.play_callback);
		} catch (err) {
			console.error(err);
		}
	}
}

class RPS {
	constructor(eventChannel, players, gobbler) {
		this.gobbler = gobbler;
		this.eventChannel = eventChannel;
		this.players = players;
		this.emojis = ['🗿', '📜', '✂️'];
		this.welcomeMsg = 'welcome to Rock, Paper, Scissors! When the timer ends, react 🗿, 📜, or ✂️ on the next message. You will have 10 seconds to beat what the Gobbler is thinking!';
	}

	// async play() {

	// }
}

module.exports = { randomEvent };