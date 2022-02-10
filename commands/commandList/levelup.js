/* eslint-disable no-unused-vars */
const Levels = require('../../utils/Levels');

module.exports = {
	name: 'levelup',
	aliases: ['lvlup', 'lvup', 'lu'],
	description: 'Level up.',
	async execute(p) {
		const db_user = await p.getAuthor();
		const curLvl = db_user.level;
		const curRepLvl = db_user.rep_level;

		if (curLvl + 1 > curRepLvl * 10) {
			await p.send(`You need a reputation level of \`${Math.ceil((curLvl + 1) / 10)}\` to level up!`);
			return;
		}

		const confirmation = await p.send(`Your current level is \`${db_user.level}\`. An increase in level costs \`${Levels.getCost(db_user.level + 1)}\` would you like to level up?`);
        
		const collectorFilter = (r, u) => (r.emoji.name === '✅' || r.emoji.name === '❌') && u.id === db_user.user_id;
        
		await confirmation.react('✅');
		await confirmation.react('❌');

        
		const reactionCollector = await confirmation.createReactionCollector(collectorFilter, { time: 15000, max: 1 });
		reactionCollector.on('collect', async (r, u) => {
			if (r.emoji.name === '✅') {
				await Levels.addLevel(p.msg, db_user);
			}
			await confirmation.delete();
		});
	},
};