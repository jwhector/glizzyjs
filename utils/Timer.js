/* eslint-disable no-invalid-this */
/* eslint-disable class-methods-use-this */
const cron = require('cron');
const { Op } = require('sequelize');

class Timer {
	constructor(gobbler) {
		this.gobbler = gobbler;
		this.time_map = new Map();
		this.client = gobbler.client;
		this.challenges = gobbler.challenges;
		this.inVoice = new Map();
		this.inVoiceTime = new Map();
		this.startReminder();
		this.intervals();
	}

	// Adds users to a map when they send a message. Gives glizzys every separate minute they post.
	async set(message) {
		const author_id = message.author.id;
		if (!this.time_map.has(author_id)) {
			this.time_map.set(author_id, Date.now());
			const glizzys = Math.floor(Math.random() * 3) + 2;
			await this.gobbler.users.addGlizzys(message.author, glizzys);
		} else {
			const time = this.time_map.get(author_id);
			const diff = Date.now() - time;
			const glizzys = Math.floor(Math.random() * 3) + 2;
			if (diff >= 60000) {
				await this.gobbler.users.addGlizzys(message.author, glizzys);
				this.time_map.set(author_id, Date.now());
			}
		}
	}

	
	calculate_daily() {
		const date = new Date(Date.now());
		const hour = date.getHours();
		console.log('HOUR: ' + hour);
		date.setDate(date.getDate() + 1);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		const dateString = date.toISOString().slice(0, 19).replace('T', ' ');
		// date.setHours(17);

		console.log('DATE: ' + date + ' DATESTRING: ' + dateString);
        
		return [date, dateString];
	}

	async daily() {
		// 826229995974295552 Daily role id
		// 827678508788613171 bot-commands channel id
		// 819963117148700692 test channel id
		// 765826162768740353 guild id
		const channel = await this.client.channels.fetch('827678508788613171');
		const guild = await this.client.guilds.fetch('765826162768740353');
		const role = await guild.roles.fetch('826229995974295552');
		await channel.send(`${role.toString()}, the daily has reset!`);
		await this.refreshDailyVoice();
		await this.gobbler.users.update({ voiceGlizzys: 200, challenge_votes: 0, text_posts_daily: 0, reacts_daily: 0, reacted_daily: 0 }, { where: { name: { [Op.not]: null } } });
		await this.gobbler.userXp.update({ textXp_daily: 0, reactXp_daily: 0, cotdXp_daily: 0, voiceXp_daily: 0, xp_daily: 0, decay_daily: 0 }, { where: { user_id: { [Op.not]: null } } });
	}

	async challenge_remind(theme, msg) {
		// 836785114313916479 challenge of the day channel id
		// 836719621460721694 challenge of the day role id
		const channel = await this.client.channels.fetch('836785114313916479');
		const guild = await this.client.guilds.fetch('765826162768740353');
		const role = await guild.roles.fetch('836719621460721694');
		await channel.send(`${role.toString()}, today is ${theme}! Post ${msg}!`);
	}

	startReminder() {
		// Daily reminder
		const reminder = new cron.CronJob('00 00 00 * * *', async () => {
			await this.daily();
		});
		reminder.start();
		// Sum-Up Sunday
		const SUSunday = new cron.CronJob('00 00 17 * * 0', async () => {
			await this.challenge_remind('Sum-Up Sunday', 'your best play this week');
			const channel = await this.client.channels.fetch('836785114313916479');
			channel.updateOverwrite(channel.guild.roles.everyone, { SEND_MESSAGES: true });
		});
		SUSunday.start();
		// Mememe Monday
		const MMonday = new cron.CronJob('00 00 17 * * 1', async () => {
			await this.gobbler.userXp.update({ textXp_weekly: 0, reactXp_weekly: 0, cotdXp_weekly: 0, voiceXp_weekly: 0, xp_weekly: 0 }, { where: { user_id: { [Op.not]: null } } });
			await this.challenge_remind('Meme Monday', 'the best meme you can find');
			const channel = await this.client.channels.fetch('836785114313916479');
			channel.updateOverwrite(channel.guild.roles.everyone, { SEND_MESSAGES: true });
		});
		MMonday.start();
		// Tune Tuesday
		const TTuesday = new cron.CronJob('00 00 17 * * 2', async () => {
			await this.challenge_remind('Tune Tuesday', 'a tune you\'d like to share');
			const channel = await this.client.channels.fetch('836785114313916479');
			channel.updateOverwrite(channel.guild.roles.everyone, { SEND_MESSAGES: true });
		});
		TTuesday.start();
		// Wholesome Wednesday
		const WWednesday = new cron.CronJob('00 00 17 * * 3', async () => {
			await this.challenge_remind('Wholesome Wednesday', 'your most wholesome content');
			const channel = await this.client.channels.fetch('836785114313916479');
			channel.updateOverwrite(channel.guild.roles.everyone, { SEND_MESSAGES: true });
		});
		WWednesday.start();
		// Thirsty Thursday
		const TThursday = new cron.CronJob('00 00 17 * * 4', async () => {
			await this.challenge_remind('Thirsty Thursday', 'a photo of a cool new concoction');
			const channel = await this.client.channels.fetch('836785114313916479');
			channel.updateOverwrite(channel.guild.roles.everyone, { SEND_MESSAGES: true });
		});
		TThursday.start();
		// Furry Friday
		const FFriday = new cron.CronJob('00 00 17 * * 5', async () => {
			await this.challenge_remind('Furry Friday', 'a photo of your favorite furball(s)');
			const channel = await this.client.channels.fetch('836785114313916479');
			channel.updateOverwrite(channel.guild.roles.everyone, { SEND_MESSAGES: true });
		});
		FFriday.start();
		// Selfie Saturday
		const SSaturday = new cron.CronJob('00 00 17 * * 6', async () => {
			await this.challenge_remind('Selfie Saturday', 'a photo of yourself or any photo you took yourself');
			const channel = await this.client.channels.fetch('836785114313916479');
			channel.updateOverwrite(channel.guild.roles.everyone, { SEND_MESSAGES: true });
		});
		SSaturday.start();
		// End Contests
		const roundup = new cron.CronJob('59 58 06 * * *', async () => {
			this.challenges.roundUp();
			// if (this.collector) this.collector.stop();
			const channel = await this.client.channels.fetch('836785114313916479');
			channel.updateOverwrite(channel.guild.roles.everyone, { SEND_MESSAGES: false });
		});
		roundup.start();
	}

	async voiceConnect(voiceState) {
		if (this.inVoice.has(voiceState.id)) return;
		const user = await this.gobbler.users.findUser(voiceState.member.user);
		this.inVoice.set(voiceState.id, user.voiceGlizzys);
		this.inVoiceTime.set(voiceState.id, 0);
	}

	async voiceDisconnect(voiceState) {
		const value = this.inVoice.get(voiceState.id);
		const time = this.inVoiceTime.get(voiceState.id);
		const user = await this.gobbler.users.findUser(voiceState.member.user);
		const voiceGlizzys = user.voiceGlizzys;
		await user.increment('glizzys', { by: voiceGlizzys - value });
		// user.glizzys = user.glizzys + user.voiceGlizzys - value;
		await user.decrement('voiceGlizzys', { by: value });
		// user.voiceGlizzys -= user.voiceGlizzys - value;
		await user.increment('time_in_voice', { by: time });
		await this.gobbler.users.addXp(user, (voiceGlizzys - value) / 3);
		await user.user_xp.addXp(user, 'xp_daily', (voiceGlizzys - value) / 3);
		await user.user_xp.addXp(user, 'xp_weekly', (voiceGlizzys - value) / 3);
		await user.user_xp.addXp(user, 'voiceXp_daily', (voiceGlizzys - value) / 3);
		await user.user_xp.addXp(user, 'voiceXp_weekly', (voiceGlizzys - value) / 3);
		// user.time_in_voice += time;
		// await user.save();
		this.inVoice.delete(voiceState.id);
		this.inVoiceTime.delete(voiceState.id);
	}

	async intervals() {
		setInterval(async () => {
			this.inVoice.forEach(voiceIntervalHelper.bind(this));
			this.inVoiceTime.forEach(voiceIntervalTimeHelper.bind(this));
			await (decayXp.bind(this))();
		}, 60000);
	}

	async refreshDailyVoice() {
		// eslint-disable-next-line no-unused-vars
		this.inVoice.forEach(async (user_id, voiceGlizzys) => {
			await this.voiceDisconnect(user_id);
			await this.voiceConnect(user_id);
		});
	}
}

function voiceIntervalHelper(value, key) {
	if (value > 0) {
		this.inVoice.set(key, value - 3);
	}
}

function voiceIntervalTimeHelper(value, key) {
	this.inVoiceTime.set(key, value + 1);
}

async function decayXp() {
	const users = await this.gobbler.users.findAllUsers();
	const usersToUpdate = [];
	const userXPsToUpdate = [];
	for (let i = 0; i < users.length; i++) {
		const multiplier = 0.0186 * (1.4 ** (users[i].rep_level - 1));
		const newXp = users[i].xp - multiplier;
		if (newXp > 0) {
			const newLvl = Math.ceil(newXp / 150);
			// const userToUpdate = {
			// 	user_id: users[i].user_id,
			// 	xp: newXp,
			// 	rep_level: newLvl < users[i].rep_level ? users[i].rep_level - 1 : users[i].rep_level
			// };
			// const userXPToUpdate = {
			// 	user_id: users[i].user_id,
			// 	decay_daily: users[i].user_xp.decay_daily + multiplier,
			// 	decay_weekly: users[i].user_xp.decay_weekly + multiplier
			// };
			usersToUpdate.push({
				user_id: users[i].user_id,
				xp: newXp,
				rep_level: newLvl < users[i].rep_level ? users[i].rep_level - 1 : users[i].rep_level
			});
			userXPsToUpdate.push({
				user_id: users[i].user_id,
				decay_daily: users[i].user_xp.decay_daily + multiplier,
				decay_weekly: users[i].user_xp.decay_weekly + multiplier
			});
			// await user.decrement('xp', { by: multiplier });
			// await user.user_xp.addXp(user, 'decay_daily', multiplier);
			// await user.user_xp.addXp(user, 'decay_weekly', multiplier); 
			// if (newLvl < user.rep_level) {
			// 	await user.decrement('rep_level', { by: 1 });
			// }
		} 
	}
	try {
		await this.gobbler.users.bulkCreate(
			usersToUpdate,
			{
				updateOnDuplicate: ['xp', 'rep_level']
			}
		);
		await this.gobbler.userXp.bulkCreate(
			userXPsToUpdate,
			{
				updateOnDuplicate: ['decay_daily', 'decay_weekly']
			}
		);
	} catch (err) {
		console.error(err);
	}
}

module.exports = Timer;