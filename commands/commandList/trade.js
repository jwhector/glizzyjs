module.exports = {
	name: 'trade',
	description: 'Transfer one user\'s glizzys to another\'s.',
	example: '$trade @Penicillen 69',
	async execute(p) {
		const target = p.msg.mentions.users.first();
		const user = await p.getAuthor(target.id);
		console.log(user);
		const author = await p.getAuthor(p.author.id);
		const amt = Number(p.args[1]);
		if (!amt) {
			p.send('Please input a valid integer!');
		}
		if (amt < 1) {
			await p.send(p.author.toString() + ', the trade must be positive!');
			return;
		}
		if (author.glizzys - amt > -1) {
			await p.users.addGlizzys(target.id, amt);
			await p.users.addGlizzys(p.author.id, -amt);
			await p.send(target.toString() + ` is traded \`${amt}\` glizzys by ` + p.author.toString() + '.');
			author.glizzys_traded += amt;
			author.save();
		} else {
			await p.send('You do not have enough glizzys for this transaction.');
		}
	},
};