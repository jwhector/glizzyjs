module.exports = {
	name: 'glizzys',
	aliases: ['g', '$'],
	description: 'Get personal glizzy balance.',
	async execute(p) {
		const user = await p.getAuthor();
		await p.send(`${p.author.toString()}, your current balance is \`${user.glizzys}\` glizzys!`);
		// April Fools
		// await p.send(`${p.author.toString()}, your current balance is \`${user.fake_glizzys}\` glizzys!`);
	},
};