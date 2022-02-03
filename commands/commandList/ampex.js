module.exports = {
	name: 'ampex',
	description: 'Amp HQ',
	async execute(p) {
		await p.send({ files: [{ attachment: './pics/amp.jpg', name: 'amp.jpg' }] });
	},
};