/* eslint-disable no-unused-vars */

module.exports = {
	name: 'level',
	aliases: ['lvl', 'lv'],
	description: 'Display level and experience values.',
	async execute(p) {
		const user = await p.getAuthor();
		await p.send(`Your current level is \`${user.level}\`, your current rep level is \`${user.rep_level}\`, and your current xp is \`${Math.round(user.xp)}\`!`);
	},
};