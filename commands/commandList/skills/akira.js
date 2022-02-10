module.exports = {
	name: 'akira',
	aliases: ['🐕'],
	description: 'Dog.',

	async execute(p) {
		const akiraDir = './pics/akira';
		const fs = require('fs');

		fs.readdir(akiraDir, async(err, files) => {
			const picID = randomizer(files.length);
			const chosenPic = files[picID];
			const pic = fs.readFileSync(akiraDir + chosenPic);

			await p.send({files:[pic]});
			await p.gobbler.users.addGlizzys(p.author.id, -5);
		});
	},
};

function randomizer(max) {
	return Math.floor(Math.random() * (max - 1));
}
