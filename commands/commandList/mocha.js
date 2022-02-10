const axios = require('axios').default;

module.exports = {
	name: 'mocha',
	description: 'Cat.',

	async execute(p) {
		const path = 'pics/pets/mocha';
		const branch = '?ref=' + process.env.BRANCH;

		const response = await axios.get(`https://api.github.com/repos/jwhector/glizzyjs/contents/${path}${branch}`);

		const files = response.data;
		const fileID = randomizer(files.length);
		const chosenFile = files[fileID];
		const pic = chosenFile.download_url;

		await p.send(pic);
		// const db_user = await p.getAuthor();
		await p.gobbler.users.addGlizzys(p.author.id, -5);
		// await p.gobbler.users.addGlizzys()
		// IDEA: pay the animal owner when someone else fetches a picture of their pet
	},
};

function randomizer(max) {
  return Math.floor(Math.random() * (max - 1));
}
