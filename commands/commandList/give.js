module.exports = {
    name: 'give',
    description: 'Gives an @\'d user a specified amount of glizzys.',
    permissions: 'ADMINISTRATOR',
    hidden: true,
    async execute(p) {
        console.log('Giving!');
        const target = p.msg.mentions.users.first() || p.msg.author;
        const amt = Number(p.args[1]);
        await p.users.addGlizzys(target.id, amt);
        p.send(`Gave \`${amt}\` glizzys to ` + target.toString() + '.');
    },
};