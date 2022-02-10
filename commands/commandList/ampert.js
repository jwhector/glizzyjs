module.exports = {
	name: 'ampert',
	description: 'Amp HQ',
	async execute(p) {
		await p.send({ files: [{ attachment: './pics/ampert.jpg', name: 'ampert.jpg' }] });
	},
};