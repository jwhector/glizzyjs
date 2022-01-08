module.exports = {
    name: 'recruit',
    description: 'Recruit to a team.',
    async execute(p) {
        await p.gobbler.tournament.recruit(p.args[0], p.args[1]);
    },
};