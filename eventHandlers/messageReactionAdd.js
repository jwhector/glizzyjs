exports.handle = async function(reaction, user) {
	if (reaction.partial) {
		try {
			await reaction.fetch();
			console.log('FETCHED');
		} catch (error) {
			console.error('There was an error fetching the reaction.');
			return;
		}
	}

	if (user.bot || reaction.message.author.bot) return;

	this.messageHandler.handleReact(reaction, user);

	const db_user = await this.users.findUser(user);
	db_user.reactions_given += 1;
	await db_user.save();
	const db_receiver = await this.users.findUser(reaction.message.author);
	db_receiver.reactions_received += 1;
	await db_receiver.save();
};