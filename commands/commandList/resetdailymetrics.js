const { Op } = require('sequelize');

module.exports = {
	name: 'refreshdailymetrics',
	description: 'Refresh daily metrics table.',
	hidden: true,
	async execute(p) {
		await p.gobbler.userXp.update({ textXp_daily: 0, reactXp_daily: 0, cotdXp_daily: 0, voiceXp_daily: 0, xp_daily: 0, decay_daily: 0 }, { where: { user_id: { [Op.not]: null } } });
	},
};