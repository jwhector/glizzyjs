const axios = require('axios').default;

module.exports = {
	name: 'facts',
	description: 'Random fun fact.',
	aliases: ['fax', '📠'],
	async execute(p) {
		axios.get('https://useless-facts.sameerkumar.website/api')
			.then(async (response) => {
				await p.send(response.data.data);
			});
	},
};