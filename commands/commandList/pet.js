const axios = require('axios').default;

module.exports = {
	name: 'pet',
	description: 'Random Pet Pic',

	async execute(p) {
		let path = 'pics/pets';
		const branch = '?ref=' + process.env.BRANCH;

		const res1 = await axios.get(`https://api.github.com/repos/jwhector/glizzyjs/contents/${path}${branch}`);

		const directories = res1.data;

		const petID = randomizer(directories.length);
		const pet = directories[petID];
		path += `/${pet.name}`;

		const res2 = await axios.get(`https://api.github.com/repos/jwhector/glizzyjs/contents/${path}${branch}`);

		const files = res2.data;
		const fileID = randomizer(files.length);
		const chosenFile = files[fileID];
		const imgURL = chosenFile.download_url;

		await p.send({ files: [{ attachment: imgURL }] });
	},
};

function randomizer(max) {
	return Math.floor(Math.random() * max);
}
