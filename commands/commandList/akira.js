const axios = require('axios').default;

module.exports = {
	name: 'akira',
	aliases: ['🐕'],
	description: 'Dog.',

	async execute(p) {
		const path = 'pics/pets/akira';
		const branch = '?ref=' + process.env.BRANCH;

		const fileResponse = await axios.get(`https://api.github.com/repos/jwhector/glizzyjs/contents/${path}${branch}`);

		const files = fileResponse.data;
		const fileID = randomizer(files.length);
		const chosenFile = files[fileID];
		const imgURL = chosenFile.download_url;

		const base64data = await axios
			.get(imgURL, { responseType: 'arraybuffer' })
			.then(response => Buffer.from(response.data, 'binary')
			.toString('base64'));

		await p.send(base64data)
	},
};

function randomizer(max) {
	return Math.floor(Math.random() * max);
}
