/* eslint-disable no-unused-vars */
module.exports = {
	name: 'squeezebag',
	description: 'Summon increasingly powerful squeezebags of the colors: white, red, green, blue, purple, and black, in increasing order of cost and reward. Use the -tithe flag to skip the confirmation message.',
	example: '$squeezebag blue or $squeezebag blue -tithe',
	async execute(p) {
		if (p.args[0] !== 'classic' && p.msg.channel.id !== '827678508788613171' && p.msg.channel.id !== '839354295999791135' && p.msg.channel.id !== '819963117148700692' && p.msg.channel.id !== '842569042647973888') {
			await p.msg.delete();
			// await p.msg.channel.send('Not here!');
			return;
		}

		if (p.args[0] !== 'classic') {
			const bags = new (require('../../utils/Squeezebags'))(p.gobbler);
			await bags.squeeze(p.msg, p.args);
		} else {
			const bag = await p.msg.channel.send('💰');
			await p.msg.channel.send('A bag has been summoned for squeezing!');
    
			let left = false;
			const filter = () => true;
			const collector = bag.createReactionCollector(filter, { time: 30000 });
			collector.on('collect', async (r) => {
				if ((r.emoji.name !== '🤜' && !left) || (r.emoji.name !== '🤛' && r.emoji.name !== '🤜' && left)) {
					const search = r.emoji.id ? r.emoji.id : r.emoji.name;
					await bag.reactions.cache.get(search).remove().catch(error => console.error('Failed to remove reaction: ', error));
				} else if (r.emoji.name === '🤜' && !left) {
					left = true;
				} else if (r.emoji.name === '🤛' && left) {
					const emojis = ['🐝', '🍯', '<:doomfist:811689745217748993>', '<:javahatessym:811689746710659103>', '<:glizzy:821597288652603443>', '<:cumhearts:833831762169823262>'];
					const names = ['a bee', 'some delicious honey', 'Doomfist', 'Sym', 'a golden glizzy', 'a good time'];
					const num = Math.floor(Math.random() * 6);
					await bag.channel.send(emojis[num]);
					await bag.channel.send(`You squeezed ${names[num]} out of the bag!`);
    
					if (num === 4) {
						const user = r.users.cache.first();
						// const db_user = await p.users.findUser(user);
						p.users.addGlizzys(user, 150);
						await bag.channel.send(user.toString() + ', `150` glizzys have been added to your balance!');
					}
    
					collector.stop();
				}
			});
			collector.on('end', collected => console.log(`Collected ${collected.size} items.`));
		}
	},
};