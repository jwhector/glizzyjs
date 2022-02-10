module.exports = {
	name: 'fuckyoujava',
	description: 'I love sym!',
	async execute(p) {
		console.log(p);
		await p.send(`I love ${'<:javahatessym:811689746710659103>'}`);
	},
};