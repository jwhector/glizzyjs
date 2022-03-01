class MessageHandler {
	constructor(gobbler) {
		this.gobbler = gobbler;
		this.count = 495;
		this.challenges = gobbler.challenges;
		this.cooldowns = {};
	}

	async handleMessage(message) {
		this.count += 1;
		if (!(this.count % 200)) {
			goldenGlizzy(message, this.gobbler);
		} else if (!(this.count % 500)) {
			await randomEvent(message);
		}

		await ggEz(message);

		this.gobbler.timer.set(message);

		try {
			const db_user = await this.gobbler.users.findUser(message.author.id, this.gobbler.client);
			await db_user.increment('text_posts_daily', { by: 1 });
			const xpGained = calculateXp(db_user.text_posts_daily + 1, 25);
			await this.gobbler.users.addXp(db_user, xpGained);
			await db_user.user_xp.addXp(db_user, 'textXp_daily', xpGained);
			await db_user.user_xp.addXp(db_user, 'textXp_weekly', xpGained);
			await db_user.user_xp.addXp(db_user, 'xp_daily', xpGained);
			await db_user.user_xp.addXp(db_user, 'xp_weekly', xpGained);
		} catch (err) {
			console.error(err);
		}

		this.challenges.messageHandler(message);
	}

	async handleReact(reaction, user) {
		if (reaction.emoji.id === '821597288652603443') {
			require('./highlight')(reaction, user, this.gobbler);
		}

		const db_author = await this.gobbler.users.findUser(reaction.message.author.id, this.gobbler.client);
		const db_reactor = await this.gobbler.users.findUser(user.id, this.gobbler.client);
		await this.gobbler.users.addXp(db_author, calculateXp(db_author.reacted_daily + 1, 12.5));
		await this.gobbler.users.addXp(db_reactor, calculateXp(db_reactor.reacts_daily + 1, 12.5));
		await db_reactor.user_xp.addXp(db_reactor, 'reactXp_daily', calculateXp(db_reactor.reacts_daily + 1, 12.5));
		await db_author.user_xp.addXp(db_author, 'reactXp_daily', calculateXp(db_reactor.reacts_daily + 1, 12.5));
		await db_reactor.user_xp.addXp(db_reactor, 'reactXp_weekly', calculateXp(db_reactor.reacts_daily + 1, 12.5));
		await db_author.user_xp.addXp(db_author, 'reactXp_weekly', calculateXp(db_reactor.reacts_daily + 1, 12.5));
		await db_reactor.user_xp.addXp(db_reactor, 'xp_daily', calculateXp(db_reactor.reacts_daily + 1, 12.5));
		await db_author.user_xp.addXp(db_author, 'xp_daily', calculateXp(db_reactor.reacts_daily + 1, 12.5));
		await db_reactor.user_xp.addXp(db_reactor, 'xp_weekly', calculateXp(db_reactor.reacts_daily + 1, 12.5));
		await db_author.user_xp.addXp(db_author, 'xp_weekly', calculateXp(db_reactor.reacts_daily + 1, 12.5));

		await db_reactor.increment('reacts_daily', { by: 1 });
		await db_author.increment('reacted_daily', { by: 1 });

		this.challenges.reactionHandler(reaction, user);
	}
}

async function goldenGlizzy(message, gobbler) {
	const msg = await message.channel.send('BEHOLD the almighty golden glizzy! The first to bask in its glory shall walk away with fortune!', {
		files: [{ attachment: './goldenglizzy.png', name: 'goldenglizzy.png' }],
	});
	try {
		await msg.react('820459716236148766');
	} catch (err) {
		console.error(err);
	}
	const filter = (reaction) => reaction.emoji.id === '820459716236148766';
	const collector = msg.createReactionCollector(filter, { max: 1 });
	collector.on('collect', async (reaction, reaction_user) => {
		await message.channel.send(reaction_user.toString() + ' has claimed the Golden Glizzy! `150` glizzys and `25` xp have been added to your balance!');
		const user = await gobbler.users.findUser(reaction_user.id, message.client);
		await gobbler.users.addGlizzys(user.user_id, 150);
		await gobbler.users.addXp(user, 25);
		await msg.delete();
	});
}

async function randomEvent(message) {
	const eventChannel = await message.guild.channels.create('Random event!', {
		type: 'GUILD_TEXT',
		permissionOverwrites: [{
			id: message.guild.roles.everyone,
			deny: ['VIEW_CHANNEL'],
		}]
	});
	const msg = await message.channel.send('A random event has started! Enter the portal to join in and earn XP!', {
		files: [{ attachment: './pics/blackhole.png', name: 'portal.png'}]
	});
	try {
		await msg.react('838939955484950568');
	} catch (err) {
		console.error(err);
	}
	const filter = (reaction) => reaction.emoji.id === '838939955484950568' || reaction.emoji.id === '🧢';
	const collector = msg.createReactionCollector(filter);
	collector.on('collect', async (reaction, reaction_user) => {
		eventChannel.permissionOverwrites.create(reaction_user, {
			VIEW_CHANNEL: true
		});
	});
}

async function ggEz(message) {
	if (message.content.includes('gg ez') || message.content.includes('ggez')) {
		const phrases = ['Ah shucks... you guys are the best!',
			'C’mon, Mom! One more game before you tuck me in. Oops mistell.',
			'For glory and honor! Huzzah comrades!',
			'Gee whiz! That was fun. Good playing!',
			'Good game! Best of luck to you all!',
			'Great game, everyone!',
			'I could really use a hug right now.',
			'I feel very, very small... please hold me...',
			'I\'m trying to be a nicer person. It\'s hard, but I am trying guys.',
			'I\'m wrestling with some insecurity issues in my life but thank you all for playing with me.',
			'It was an honor to play with you all. Thank you.',
			'It’s past my bedtime. Please don’t tell my mommy.',
			'Mommy says people my age shouldn’t suck their thumbs.',
			'Well played. I salute you all.',
			'Wishing you all the best.'];
		const chosenPhrase = phrases[Math.floor(Math.random() * phrases.length)];
		const channel = message.channel;
		const authorString = message.author.toString();
		await message.delete();
		await channel.send(authorString + ': ' + chosenPhrase);
	}
}

function calculateXp(num, factor) {
	return factor / num ** 1.3;
}

module.exports = MessageHandler;