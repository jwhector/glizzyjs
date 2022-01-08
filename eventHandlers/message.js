exports.handle = async function(msg) {
    if (msg.author.bot) return;

    this.messageHandler.handleMessage(msg);

    this.command.execute(msg);

    const db_user = await this.users.findUser(msg.author.id, this.client);
    db_user.text_posts += 1;
    db_user.save();
};
