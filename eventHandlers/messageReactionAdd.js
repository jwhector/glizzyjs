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

    const db_user = await this.users.findUser(user.id, this.client);
    db_user.reactions_given += 1;
    db_user.save();
    const db_receiver = await this.users.findUser(reaction.message.author.id, this.client);
    db_receiver.reactions_received += 1;
    db_receiver.save();
};