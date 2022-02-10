const axios = require('axios').default;

module.exports = {
	name: 'akira',
  aliases: ['🐕'],
	description: 'Dog.',

	async execute(p) {
		const path = 'pics/akira';
		const branch = '?ref=' + process.env.BRANCH;
		const yungBankInfo = 99754494325186560;

		const response = await axios.get(`https://api.github.com/repos/jwhector/glizzyjs/contents/${path}${branch}`);

		const files = response.data;
		const fileID = randomizer(files.length);
		const chosenFile = files[fileID];
		const pic = chosenFile.download_url;

		await p.send(pic);
		await p.gobbler.users.addGlizzys(p.author.id, -10);
		await p.gobbler.users.addGlizzys(yungBankInfo, +10);
	},
};

function randomizer(max) {
  return Math.floor(Math.random() * (max - 1));
}
