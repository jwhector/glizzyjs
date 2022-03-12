const Discord = require('discord.js');

module.exports = async (reaction, user, gobbler) => {
	if (reaction.message.author.id === user.id) {
		await reaction.message.channel.send('You cannot highlight your own message!');
		return;
	}
	// Get user and message from MySQL database. Need to modify glizzys and 
	// add the message to the list of messages that have been highlighted before.
	const db_user = await gobbler.users.findUser(user);
	const db_msg = await gobbler.messages.findOne({ where: { _id: `${reaction.message.id}` } });
    
	// If the message is not found in the list of already-highlighted messages.
	if (!db_msg || !db_msg.highlight) {
		const isFree = db_user.free_highlights > 0;

		if (db_user.glizzys >= 1500 || isFree) {
			await reaction.message.fetch();
			const msg = reaction.message;
			const confirmationMsg = isFree ? `${user.toString()}, you have ${db_user.free_highlights} free highlight! Would you like to highlight this post?` : `${user.toString()}, , are you sure you want to spend \`1500\` glizzys to highlight this post?`;
			const confirmation = await msg.channel.send(confirmationMsg);
			await confirmation.react('<:glizzy:821597288652603443>');

			const filter = (react, react_user) => react.emoji.id === '821597288652603443' && react_user.id === db_user.user_id;
			await confirmation.awaitReactions(filter, { time: 60000, maxEmojis: 1 }).then(async (collected) => {
				if (!collected.size) return;
				db_user.highlights_given += 1;
				await db_user.save();
				await gobbler.users.addXp(db_user, 25);
				await constructEmbeds(msg.author, user, msg);
				await gobbler.messages.create({
					_id: `${msg.id}`,
					highlight: true,
				});
				if (isFree) {
					db_user.free_highlights -= 1;
					await db_user.save();
				} else {
					await gobbler.users.addGlizzys(user, -1500);
				}
				await gobbler.users.findUser(msg.author).then(async (author) => {
					await gobbler.users.addGlizzys(msg.author, 250);
					await msg.channel.send(`${msg.author.toString()}, your post has been highlighted! You receive \`250\` glizzys as a reward!`);
					author.highlights_received += 1;
					await author.save();
				});
			}).catch(console.error);
              
			await confirmation.delete();
		} else {
			const response = await reaction.message.channel.send(user.toString() + ', you do not have enough glizzys to highlight a message!');
			await reaction.message.reactions.cache.get('821597288652603443').remove().catch(() => console.error('Could not remove reaction.'));
			gobbler.client.setTimeout(async () => await response.delete(), 4000);
		}
	} else {
		const botmsg = await reaction.message.channel.send('This message is already highlighted!');
		await reaction.message.reactions.cache.get('821597288652603443').remove().catch(() => console.error('Could not remove reaction.'));
		gobbler.client.setTimeout(async () => await botmsg.delete(), 4000);
	}
};

async function constructEmbeds(author, gifter, message) {
	const colors = ['#2BFFC7', '#FF46F9', '#A946FF', '#FF4646', '#468BFF'];
	const color = colors[Math.floor(Math.random() * colors.length)];
	const embed = new Discord.MessageEmbed()
		.setColor(color)
		.setTitle(`${author.username} has received a Golden Glizzy!`)
		.setThumbnail(author.avatarURL())
		.addFields(
			{ name: 'Given By:', value: gifter.username, inline: true },
			{ name: 'Channel:', value: `${message.channel.toString()}`, inline: true },
		);
	if (message.content) {
		let content = message.content;
		if (message.content.length > 1024) {
			content = message.content.slice(0, 1020);
		}
		embed.addField('Message:', content);
	}
	embed.addField('Message Link:', `[Click Here!](${message.url})`, true);
	await send(embed, message);

	if (message.attachments.size) {
		const attachment_embed = new Discord.MessageEmbed().setColor(color);
		const attachment_ext = message.attachments.first().url.slice(-3);
		if (attachment_ext === 'jpg' || attachment_ext === 'png') {
			attachment_embed.setImage(message.attachments.first().url);
			attachment_embed.setTitle(`Attached image from ${author.username}`);
		} else {
			attachment_embed.setTitle(`Attached file from ${author.username}`)
				.attachFiles(message.attachments.first());
		}
		await send(attachment_embed, message);
	}
}

async function send(embed, message) {
	const highlight_channel = message.guild.channels.cache.get('828026056841363456');
	await highlight_channel.send(embed);
}
