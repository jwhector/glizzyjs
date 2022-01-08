module.exports = {
    name: 'roles',
    description: 'See and set available functional roles.',
    async execute(p) {
        const roles = require('../utils/roles.json');
        let msg = '```\n';

        for (const role in roles) {
           msg = msg.concat(`~~${roles[role].name}~~`, '\n  ', roles[role].description, '\n');
        }

        msg += 'Reply with any number of these roles to have them added or removed from your profile.```';

        await p.send(msg);

        const filter = m => m.author.id === p.author.id;
        const collector = p.channel.createMessageCollector(filter, { max: 1, time: 60000 });
        collector.on('collect', async (m) => {
            const msgLower = m.content.toLowerCase();
            for (const role in roles) {
                console.log(role);
                if (msgLower.includes(role)) {
                    const memberRoles = m.member.roles;
                    const roleId = roles[role].id;
                    console.log('roleID: ' + roleId);
                    if (memberRoles.cache.get(roleId)) {
                        await memberRoles.remove(roleId);
                        await p.send(`Your ${roles[role].name} role has been removed!`);
                    } else {
                        await memberRoles.add(roleId);
                        await p.send(`You've gained the ${roles[role].name} role!`);
                    }
                }
            }
        });
    },
};