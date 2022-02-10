const axios = require('axios').default;

module.exports = {
	name: 'akira',
	aliases: ['🐕'],
	description: 'Dog.',

	async execute(p) {
		const path = 'pics/pets/akira';
		const branch = '?ref=' + process.env.BRANCH;

		const response = await axios.get(`https://api.github.com/repos/jwhector/glizzyjs/contents/${path}${branch}`);

		const files = response.data;
		const fileID = randomizer(files.length);
		const chosenFile = files[fileID];
		const pic = chosenFile.download_url;

		await p.send(pic);
	},
};

function randomizer(max) {
	return Math.floor(Math.random() * max);
}
