/* eslint-disable no-unused-vars */
module.exports = {
    name: 'balance',
    aliases: ['b', 'bal'],
    description: 'Get another user\'s glizzy balance.',
    async execute(p) {
        const name = p.args[0].toLowerCase();
        let user = p.msg.guild.members.cache.find(member => member.displayName.toLowerCase() === name);
        console.log(user);
        if (p.msg.mentions.users.size) {
            console.log('MENTION');
            user = p.msg.mentions.users.first();
        }
        if (!user) {
            p.send('No user with that name exists in this server!');
            return;
        }
        const db_user = await p.getUser(user.id);
        p.send(`${user.user.username}'s current balance is \`${db_user.glizzys}\` glizzys!`);
    },
};