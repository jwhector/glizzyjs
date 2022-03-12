/* eslint-disable no-unused-vars */
module.exports = {
	name: 'daily',
	aliases: ['d'],
	description: 'Get daily 150 glizzys.',
	async execute(p) {
		// if (p.channel.id != '827678508788613171') return;
		// console.log(p.timer);
		const [dailyDate, dateString] = p.timer.calculate_daily();
		console.log(dailyDate, dateString);
		const user = await p.getAuthor();

		const onStreak = checkStreak(dailyDate, user);

		const ready = await p.sequelize.query('SELECT ? > daily AS r FROM users WHERE user_id = ?', {
			type: p.sequelize.QueryTypes.SELECT,
			replacements: [dateString, user.user_id],
		});

		if (ready[0].r) {
			let toGive = 150;
			let bonusXp = 0;
			if (onStreak) {
				user.streak += 1;
				if (user.streak >= 15) {
					toGive = 300;
					bonusXp = 15;
				} else if (user.streak >= 5) {
					toGive = 150 + 50 * Math.trunc(user.streak / 5);
					bonusXp = 5 * Math.trunc(user.streak / 5);
				}
			} else {
				user.streak = 1;
			}
			await p.users.addGlizzys(p.author, toGive);
			await p.users.addXp(user, 10 + bonusXp);
			// await p.send(`You're on a \`${user.streak}\` day streak! \`${toGive}\` glizzys have been added to your balance!`);
			if (Math.random() < 0.5) {
				await createImage(p, toGive, user.streak);
			} else {
				await createSyringe(p, toGive, user.streak);
			}
			user.daily = dateString;
			user.dailies += 1;
			// console.log(user.daily);
			await user.save();
		} else {
			await p.send('You have already invoked the daily today!');
			// await createImage(p);
		}
	},
};

function checkStreak(dailyDate, user) {
	const lastDaily = user.daily;
	dailyDate.setDate(dailyDate.getDate() - 1);

	if (dailyDate.getDate() <= lastDaily.getDate()) return true;
	return false;
}

async function createImage(p, toGive, streak) {
	const Canvas = require('canvas');
	const Discord = require('discord.js');
	Canvas.registerFont('./resources/astron-boy-wonder/AstronBoyWonder.ttf', { family: 'Astron' });
	const canvas = Canvas.createCanvas(640, 360);
	const context = canvas.getContext('2d');

	const background = await Canvas.loadImage('./pics/dailybg.jpeg');
	context.drawImage(background, 0, 0, canvas.width, canvas.height);

	context.font = '60px "Astron"';
	context.fillStyle = '#ffffff';

	context.fillText(p.getMember().displayName, 50, 75);
	context.fillText(`${toGive} glizzys`, 300, 140);
	context.fillText('STREAK', 375, canvas.height - 25);
	context.fillText(streak, 390, canvas.height - 80);

	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'daily-image.png');

	p.send(attachment);
}

async function createSyringe(p, toGive, streak) {
	const Canvas = require('canvas');
	const Discord = require('discord.js');
	Canvas.registerFont('./resources/astron-boy-wonder/AstronBoyWonder.ttf', { family: 'Astron' });
	const canvas = Canvas.createCanvas(560, 560);
	const context = canvas.getContext('2d');

	const background = await Canvas.loadImage('./pics/syringe.png');
	context.drawImage(background, 0, 0, canvas.width, canvas.height);

	context.font = '44px "Astron"';
	context.fillStyle = '#000000';

	context.save();
	context.rotate(-Math.PI/4.1);
	context.translate(-200, 100);

	const name = p.getMember().displayName;

	// context.fillText(p.getMember().displayName, 100, 150);
	context.save();
	while (context.measureText(name).width > 237) {
		context.font = context.font.replace(/\d+px/, (parseInt(context.font.match(/\d+px/)) - 2) + 'px');
	}

	context.fillText(name, 100, 150);
	context.restore();
	// console.log(context.measureText('Glizzard Wiz').width);

	context.fillText(`${toGive} glizzys`, 125, 200);
	context.fillText('STREAK', 100, canvas.height - 85);
	context.fillText(streak, 110, canvas.height - 140);

	// context.restore();

	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'daily-image.png');

	p.send(attachment);
}

