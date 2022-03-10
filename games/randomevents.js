/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
const Promise = require('bluebird');

async function randomEvent(message) {
	const eventChannel = await message.guild.channels.create('Random event!', {
		type: 'GUILD_TEXT',
		permissionOverwrites: [{
			id: message.guild.roles.everyone,
			deny: ['VIEW_CHANNEL'],
		}]
	});
	const msg = await message.channel.send('A random event has started! Enter the portal to join in and earn XP! Entry will expire 60 seconds after the portal opens.', {
		files: [{ attachment: './pics/blackhole.png', name: 'portal.png'}]
	});
	try {
		await msg.react('☄️');
	} catch (err) {
		console.error(err);
	}
	let numPlayers = 0;
	const players = [];
	const filter = (reaction) => reaction.emoji.name === '☄️';
	const collector = msg.createReactionCollector(filter, { time: 60000 });
	collector.on('collect', async (reaction, reaction_user) => {
		await eventChannel.updateOverwrite(reaction_user.id, {
			VIEW_CHANNEL: true
		});
		await eventChannel.send('Welcome ' + reaction_user.toString() + '!');
		numPlayers++;
		players.push(reaction_user);
	});

	collector.on('end', async () => {
		await msg.edit('This random event closed!');
		const event = new EmojiMatch(eventChannel,  players);
		await event.play();
	});

	// RPS - 2 max
	// Fastest reaction - no max, starts based on time
	// First to match emoji - no max, starts based on time

}

class EmojiMatch {
	constructor(eventChannel, players) {
		this.eventChannel = eventChannel;
		this.players = players;
		this.emojis = ['✌','😂','😝','😁','😱','👉','🙌','🍻','🔥','🌈','☀','🎈','🌹','💄','🎀','⚽','🎾','🏁','😡','👿','🐻','🐶','🐬','🐟','🍀','👀','🚗','🍎','💝','💙','👌','❤','😍','😉','😓','😳','💪','💩','🍸','🔑','💖','🌟','🎉','🌺','🎶','👠','🏈','⚾','🏆','👽','💀','🐵','🐮','🐩','🐎','💣','👃','👂','🍓','💘','💜','👊','💋','😘','😜','😵','🙏','👋','🚽','💃','💎','🚀','🌙','🎁','⛄','🌊','⛵','🏀','🎱','💰','👶','👸','🐰','🐷','🐍','🐫','🔫','👄','🚲','🍉','💛','💚'];
	}

	async play() {
		let pingMsg = '';
		this.players.forEach(player => {
			// eslint-disable-next-line operator-assignment
			pingMsg = pingMsg + `${player.toString()}, `;
		});
		const readyMsg = await this.eventChannel.send(pingMsg + 'welcome to Emoji Match! The first to react with the matching emoji on the next message wins the event! React with a ✅ when you\'re ready to go!');
		await readyMsg.react('✅');

		const filter = (reaction, user) => reaction.emoji.name === '✅' && this.players.map(player => player.id).includes(user.id);
		const collector = readyMsg.createReactionCollector(filter, { time: 120000, max: this.players.length });
		// collector.on('collect', async (reaction, reaction_user) => {
		//     await this.eventChannel.send('yoloswag');
		// });
		collector.on('end', async (collected) => {
			const countdownMsg = await this.eventChannel.send('The event will begin in: 10');
			let timeLeft = 9;
			const countdown = async () => {
				if (!timeLeft) {
					await countdownMsg.delete();
					const randomEmoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
					const emojiMsg = await this.eventChannel.send(randomEmoji);
					const filter = (reaction, user) => reaction.emoji.name === randomEmoji && this.players.map(player => player.id).includes(user.id);
					const emojiCollector = emojiMsg.createReactionCollector(filter, { time: 120000, max: 1 });
					emojiCollector.on('collect', async (reaction, reaction_user) => {
						await this.eventChannel.send(reaction_user.toString() + ' won the event! Added `50 xp`!');
					});
					emojiCollector.on('end', async (collected, reason) => {
						await this.eventChannel.send('DEBUG: ' + reason);
						setTimeout(async () => {
							await this.eventChannel.delete();
						}, 120000);
					});
				} else return Promise.delay(1000).then(async () => {
					await countdownMsg.edit('The event will begin in: ' + timeLeft);
					timeLeft--;
					countdown();
				});
			};
			countdown();
		});
	}
}

module.exports = { randomEvent };