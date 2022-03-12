const { Op } = require('sequelize');

module.exports = {
	name: 'resetweekly',
	description: 'Reset weekly xp gains.',
	hidden: true,
	permissions: 'ADMINISTRATOR',
	async execute(p) {
		await p.gobbler.userXp.update({ textXp_weekly: 0, reactXp_weekly: 0, cotdXp_weekly: 0, voiceXp_weekly: 0, xp_weekly: 0 }, { where: { user_id: { [Op.not]: null } } });
	},
};