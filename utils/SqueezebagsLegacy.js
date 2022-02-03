// const Gamma = require('@stdlib/stats/base/dists/gamma').Gamma;

// class Squeezebags {
// 	constructor(gobbler) {
// 		this.gobbler = gobbler;
// 		this.tiers = new Map();
// 		this.tiers.set('838523648238419968', { role: 'Dogwater', color: 'white', cost: 10, text: 'A paltry pale bag', role_chance: 0.1, tier: 1 });
// 		this.tiers.set('838523594261921863', { role: 'Throwing???', color: 'red', cost: 50, text: 'A flimsy red bag', role_chance: 0.04, tier: 2 });
// 		this.tiers.set('838523466331324506', { role: 'oKAYYY?!?', color: 'green', cost: 100, text: 'A rough green leather bag', role_chance: 0.03, tier: 3 });
// 		this.tiers.set('838522853774327808', { role: 'Winning These', color: 'blue', cost: 200, text: 'A shiny blue bag', role_chance: 0.03, tier: 4 });
// 		this.tiers.set('838522305889042513', { role: 'Cracked.', color: 'purple', cost: 500, text: 'A regal purple bag', role_chance: 0.03, tier: 5 });
// 		this.tiers.set('838522079993004072', { role: 'Brobdingnagian', color: 'black', cost: 1000, text: 'The almighty black bag', role_chance: 0.01, tier: 6 });
// 		this.roles = ['838523648238419968', '838523594261921863', '838523466331324506', '838522853774327808', '838522305889042513', '838522079993004072'];
// 	}

// 	async squeeze(message, args) {
// 		const author = await this.gobbler.users.findUser(message.author.id);
// 		const member = message.guild.members.cache.get(message.author.id);
        
// 		if (args.length > 2) {
// 			await message.channel.send('This exotic form of squeezebag does not exist on this plane at the moment, try again.');
// 			return;
// 		}

// 		let bag;
// 		this.tiers.forEach((val) => {
// 			if (val.color === args[0]) {
// 				bag = val;
// 			}
// 		});
// 		if (!bag) {
// 			await message.channel.send('This exotic form of squeezebag does not exist on this plane at the moment, try again.');
// 			return;
// 		}

// 		const memberRole = member.roles.cache.filter((val) => { 
// 			const truth = this.roles.includes(val.id);
// 			return truth;
// 		});
// 		const memberTier = memberRole.size ? this.tiers.get(memberRole.first().id).tier : 0;

// 		if (memberTier < bag.tier - 1) {
// 			await message.channel.send('You are not powerful enough to summon this squeezebag.');
// 			return;
// 		}

// 		if (args.length === 2 && args[1] === '-tithe') {
// 			if (author.glizzys < bag.cost) {
// 				await message.channel.send('You are not resourceful enough to squeeze this bag.');
// 				return;
// 			}
// 			await this.gobbler.users.addGlizzys(author.user_id, -bag.cost);
// 			await this.summon(message, args, bag, author, memberTier);
// 		} else {
// 			const confirmation = await message.channel.send(`${message.author.toString()}, summoning this bag requires a tithe of \`${bag.cost}\` glizzys, would you like to proceed with the ritual?`);
// 			await confirmation.react(confirmation.guild.emojis.cache.get('838541790030200862'));
// 			const confirmationFilter = (r, user) => (r.emoji.name === 'summon' || r.emoji.name === 'dispel') && user.id === message.author.id;
    
// 			const collector = await confirmation.createReactionCollector(confirmationFilter, { time: 30000 });
// 			collector.on('collect', async (r) => {
// 				if (r.emoji.name === 'summon') {
// 					if (author.glizzys < bag.cost) {
// 						await message.channel.send('You are not resourceful enough to squeeze this bag.');
// 						return;
// 					}
// 					await this.gobbler.users.addGlizzys(author.user_id, -bag.cost);
// 					await this.summon(message, args, bag, author, memberTier);
// 				} else {
// 					await message.channel.send('The ritual has been dispelled.');
// 					await confirmation.delete();
// 					return;
// 				}
// 			});
// 			await confirmation.react(confirmation.guild.emojis.cache.get('838542076442443837'));
// 		}  
// 	}

// 	calculateDistribution(bag) {
// 		const gamma = new Gamma(2, 2 / bag.cost);
// 		const value = gamma.quantile(Math.random());
// 		console.log('This bag gave ' + value + ' glizzys!');
// 		return Math.floor(value);
// 	}

// 	async summon(message, args, bag, user, memberTier) {
// 		const bagMsg = await message.channel.send(message.author.toString() + ` ${bag.text} has been summoned for squeezing!`, {
// 			files: [{ attachment: `./pics/${args[0]}_bag.png`, name: `${args[0]}_bag.png` }],
// 		});
// 		await bagMsg.react(bagMsg.guild.emojis.cache.get('838570331596783637'));

// 		const filter = (r, u) => u.id === message.author.id;
// 		const collector = bagMsg.createReactionCollector(filter, { max: 1 });
// 		collector.on('collect', async (r) => {
// 			if ((r.emoji.name != 'squeeze')) {
// 				const search = r.emoji.id ? r.emoji.id : r.emoji.name;
// 				await bagMsg.reactions.cache.get(search).remove().catch(error => console.error('Failed to remove reaction: ', error));
// 			} else if (r.emoji.name === 'squeeze') {
// 				const reward = this.calculateDistribution(bag);
// 				const bagRole = Math.random() <= bag.role_chance;
// 				const shardRole = Math.random() <= 0.005;
// 				const singularity = Math.random() <= 0.005;
// 				const guildRole = bagRole ? message.guild.roles.cache.find(role => role.name === bag.role) : false;
// 				const member = message.guild.members.cache.get(message.author.id);

// 				if (guildRole && !member.roles.cache.some(role => role.id === guildRole.id) && memberTier < bag.tier) {
// 					const roleCache = member.roles.cache.filter((role) => this.roles.includes(role.id));
// 					roleCache.forEach(async (value, key) => {
// 						await member.roles.remove(key);
// 					}); 
// 					await member.roles.add(guildRole);
// 					await message.channel.send(`${message.author.toString()} Woah! The squeezebag has evolved your self worth! You now bear the title \`${bag.role}\`!`);
// 				}

// 				const isBrob = member.roles.cache.get('838522079993004072');

// 				if (shardRole && args[0] != 'black') {
// 					await message.channel.send({
// 						files: [{ attachment: `./pics/${args[0]}_shard.png`, name: `${args[0]}_shard.png` }],
// 					});
// 					await message.channel.send('You squeeze something... hard? A glowing crystal emerges from the sack!');
// 					user[getShard(bag.tier)] += 1;
// 					console.log(user.shards);
// 					// await this.gobbler.users.update(
// 					//     { 'shards': user.shards },
// 					//     { 'where': { 'user_id': user.user_id } },
// 					//     );
// 					await user.save();
// 					// const item_name = this.getElementalName(args[0]);
// 					// if (item_name) await this.gobbler.userItems.addItem(message.author, item_name, 1);
// 				} else if (singularity && args[0] == 'black' && isBrob) {
// 					await message.channel.send({
// 						files: [{ attachment: './pics/blackhole.png', name: 'blackhole.png' }],
// 					});
// 					await message.channel.send('You squeeze something completely I̴̧̛͕̦̠̦͒̐̚̚̚N̸̡̢̟͇̤̜̰̬̲̬͑̈́̎̍́̑͊̚̚T̵͎͈͍̎̿͆̔̓̌̋͠A̶̧̜̣̩͕͇͍͐̋̀̐̇̆̋̒̀̽̆N̸̨̗̠͉̙̫̜̑̎́̄͒̂̽̀̀̈́͒̒͘͝ͅG̸͈͖̰͔̎Į̸̠̝͎̟̗͖̼́̿̅̄̔̐̈́̔̿͑̚̚B̴̧͎̏̄͊̉̓̽͘Ḽ̷̡̧̨̧̘̥̲̫̫̘̞̜̅Ë̴̢͚̺̘̫̼̗͔͉̹̠̪́̉̂͗̈́͗̾̀̆̿̌͗̀̚͝ͅ. A̷̼̼̐̀̃̋̓̊͐̈́̉̅̚͝͝ ̶̢̨̡̥̘̣̼̞̪͍̦̪̤̦̭̳̜̻͎̞̬̳̫̈́͊͗̚͠͠͠ͅT̵̢̙̼̭̳͔̫̪̜͎͚̘͙̫̗̜͖͚̙̜̜͈̫̥̤̝̝̮̼͎̮̱̪̣̺̥̭̈͊̉̽̃́̈́͜͠I̷̼̯͇̯͌͐̓̎̿͋̇́͊̈́̎̈̿̌͋̀͗̒͑̄̈̉́́̍̕͝͝M̷͖̙͖̣̰͉͒̃̂̍̽̃͋̍̄̍͊̏̄̒͠E̴̮̺̤̹͉̍͌͊̒̔̉̄̑̓̐͑̋̄̓͊͘͠͝ͅ-̸̢̡͔̞͖͚̤̽̓̔̎̌̈́̆̑͌̿̿͂̃̾̂͒̕͝ͅḆ̵̨̛̛̤͇̗̺̬͈̟͔̖̖͑̀̆̅̌̅̓̽́͑͂̈̇̾͊͑̈́̓͗͆͂͑̄̒̓̄̕̚͝͝E̴̢͔͈͇̹͇̥̟̹̤͚̺̟̩̦͓̱̦͔̣̱̜̹̦̭̲̒̾͆̄͊̔͒̋̅́͌̕͝͝ͅŅ̶̨̺̝̙̘̠̺̞̪͙͕͈̙͔̝̜̣̦̘̼͍̹̳̭̯̣͉̫̈̋̆͆̀͋̄̑͗̊͗̑͐̽̚̚͜͠͝͝ͅͅD̷̡̠̣̤͈̝̝̙̻̳̗͉͍̹̟̟̳̯̫̙̙͔͕̜͖͚̭͓̒̌̂͜͝ͅI̴̢̡̝͚͇̺͕̭̟̰̤̟̜͈̣̟͕͍̠̮̬͎͖̮̰͉͒̓̉͌̎̌̂̃̄́̇͛̋̈́̽̉͒̃̒̂̂̔̈́̇͘Ǹ̴̢̧͙̜͚̤̱͓̹͎̳̟̬̃̈G̶̢̢̡̛̛̟̫̫̻̹͇͇̮͎͉͇̪̥̙͙̙͍̗̜̩̮͉͈̙͔̭̟̙̭̿̇̓͆̽͛̔̈́̌̑͂̊̒̈́͛̔͑̎̐͂͐̈́́̓͘͝͝ͅ ̸̛̛̖̟̤͉̝̝̪̭̝̓̂̐̾̄̒͂̾͋̔͊̐̀̓̽̌͑̽̊̐̒̀͊̿̅̊͑͑͗̚̚̕͝S̵̡̨̛͉̣̜̜̥͈̖̣̠̩͈͍̺̦̮͚͓͍̮̫͓͇̬̖̹͚̪͐̈͋̑̓͗̈́͒̅ͅİ̸̧̧̢̛̹̤̺̮̝͖̖̬̪̭̖̙͓͂͆͐͂͊̿̈̈́́̋̍̈́̃͛͌̌̑͋͊̃̐́͒̕̚͝͝͝ͅŅ̵̞̗̲̞͙̼̜̓͛Ģ̵̢̡̡̧̟̹͈͍̖͚͍̝͕̘͚͔͈̝̥̲̖̬̘̝̞̻̄͆̀͆͌̆͑̑̌́̆́̉͆̐̓͌̂͐̇̋̑̏̿́͗̕̚͝͝͝Ư̶̧̠̳̦̙͙͙̻̫͉̪̮̪̘͕̤̮͉̼͓̪̰̽̍͂̌̄̽͛̔̽͊̈́̂͂͒̆̈́̒͜͝ͅL̶̨͚͕̣̥̣̭͇͔̣̩̝̝̖̯̻͉̜̺̩̱͍̣̹͉̱̈́̽̽̎͐͂̃̂͂̊̀̑̈́͆͘͠ͅÁ̵̡̨̨̡̭̘̼͖̙̝̺̣͖̤͓̪̰̲̭͚̲̰͔͚̙̩̘̇̂͋̆͐̈́̑̅̓̍̔͘͜͜͜͝R̵̨̧̢͔͓̪͓̼̱̪̮̥̦̖̞̳̩͍̤̙̲̫̤̳̲̘̩̞̲̤̼̗̤͔͒̈́͒́̀̾̊͊͐̑̕͘͜͠ͅỊ̶̡̡̡̺͍̙͚͖̗̖̮̠̮͈͙̳̖̋̉͋̈́̃̄̓̑͋̀̎̃͌̈́́̈́̋͛̉̊̎̌̈́̋͒̕̕̚͘͘̚͝͝͝͠͠T̷̢̝͓̗̰̫̣̞͚̞͖̯͓̼̳̝̲̖͇͔̘̫͎͋̐͑̾̃̾̌̍̎̉͛̕̕͜Ỷ̷̛̰͚̗̠̣̃̐͒͑͐̒́̀͆̈͋̓̑̈́͗̋̃̔̍̈́̍̿́͛̍̆̄͌͐̇͘͘͝͠ ̴̧̩̙̪̟̤̼̺̣͓̠̫͙͕̳̠̳̦̞͇̜̗̳̤̞̑̍͛̿̃͘̕͝͠H̴͔̩͕̲̞̪̣̫̭͕̳͂̔̃̽͋̈́͂͑͗̉̂̐̄̋̐̃͆̉̑̕͠͠͝͝͝͠͠Á̶̡̢̧̢̧͕̳̯̺̳͍̳̘͙̭̦͇̜̲̲̲͖̻̬̗̯̙̻̞͔̙͙͎̺̝̬̗̟́͗̈́̅̿̈̈͝S̴͉̉͛̾̏͑͂̍͆̒̊͐ ̸̨͉͍͓̦̯̫͇͈̞͓̮̻͓͇͍̟̰͉̥̗͉̦̖̆̈́͆̓̐͂̎̅̆̉͂̕Ā̸̢̭̘̜̣̜̣̱̖͙̊̀̄̅͂̃ͅͅP̸̛͕̘̦͚͕̭̳̖̟̱͓̞̙͔̪̘̝̲̯̮̗͎̟̄̄̿͌͊͐͆͐́̐̌̆̋̀̓́̽̃̍̇̈́̈̈́͌̊̎̆̀̌̽̈́̓̆͋̕P̷̡̢̯̲̙̼̞͈̮͖̠̩̳͔̥̬̙̬̣̮̠̜͉̝͒̾̓̀̊̎́̓̏̊̐͌̈̍̇̔͒͐̈́́̄̈̅͘̚̕̕̚͜͠È̸̛̯͎̯̪͙̦̮̝̮̠̎̓̓̒͛̿͌̃̐̉͌͋̆̂̌͗̓͘A̵̡̢̙͉̳̤͍̫͍͇̣̪͇̯̖̗̤̳̟̘̲̼̰͉͋̔̔̂͋͜ͅR̷̢̨̢͇̣͓͓̱̘̩̫͎͖̤̞͙̦̗̠̀̏̈́́̓͂́͂̆̆̃̃̉͆̌̊͒̄̈́͑̍̔͋̀̈̎̈́̕͜͜͝ͅĘ̴̡͔̰̣̝͓̣̳̩̙̥͎̮̗͓̩͇̫̺̮̈́͜D̵̛͊̐̋̕ in your hands.');
// 					user.singularities += 1;
// 					// console.log(user.shards);
// 					// await this.gobbler.users.update(
// 					//     { 'shards': user.shards },
// 					//     { 'where': { 'user_id': user.user_id } },
// 					//     );
// 					await user.save();
// 					const general = message.guild.channels.cache.find(channel => channel.name.toLowerCase() === 'general');
// 					await general.send(`${message.author.toString()} has unveiled the singularity!`);
// 				}
// 				await this.gobbler.users.addGlizzys(user.user_id, reward);
// 				await message.channel.send(`${message.author.toString()}, you squeezed \`${reward}\` glizzys out of the bag!`);
// 				collector.stop();
// 			}
// 		});


// 		// await message.channel.send(`${bag.text} has been summoned for squeezing!`);
// 		// collector.on('end', collected => console.log(`Collected ${collected.size} items`));
// 	}

// 	getElementalName(color) {
// 		switch(color) {
// 		case 'white':
// 			return 'Air Shard';
// 		case 'red':
// 			color = 'red';
// 			break;
// 		case 'green':
// 			return 'Earth Shard';
// 		case 'blue':
// 			return 'Water Shard';
// 		case 'purple':
// 			return 'Dark Shard';
// 		default:
// 			console.log('No such shard.');
// 			return null;
// 		}
// 	}

// 	getShard(tier) {
// 		switch(tier) {
// 		case 1:
// 			return 'white_shard';
// 		case 2:
// 			return 'red_shard';
// 		case 3:
// 			return 'green_shard';
// 		case 4:
// 			return 'blue_shard';
// 		case 5:
// 			return 'purple_shard';
// 		default:
// 			console.log('No such shard!');
// 			return null;
// 		}
// 	}
// }

// module.exports = Squeezebags;