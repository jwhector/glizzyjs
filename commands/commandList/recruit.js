module.exports = {
    name: 'recruit',
    description: 'Recruit to a team.',
    hidden: true,
    async execute(p) {
        await p.gobbler.tournament.recruit(p.args[0], p.args[1]);
    },
};