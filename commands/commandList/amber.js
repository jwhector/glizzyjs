module.exports = {
    name: 'amber',
    description: 'Amp HQ',
    async execute(p) {
        await p.send({ files: [{ attachment: './pics/amber.jpg', name: 'amber.jpg' }] });
    },
};