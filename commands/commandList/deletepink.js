module.exports = {
	name: 'deletepink',
	description: 'Delete Pink msgs.',
	hidden: true,
	async execute(p) {
		const channels = p.gobbler.client.channels.cache;
		await channels.each(deleteMsg);
	},
};

async function deleteMsg(channel) {
	const messages = await channel.messages.fetch();
	messages.each(async (msg) => {
		if (msg.content.includes('Among Us in real life (sus, sus)')) {
			await msg.delete();
		}
	});
}