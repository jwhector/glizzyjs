class Questions {
	constructor(gobbler) {
		this.gobbler = gobbler;
		this.openDMs = new Map();
		this.channelId = '859321835019960350';
		this.questionId = '859322516434976778';
	}
    
	async createQuestion(user) {
		const DMChannel = await user.createDM();
		await DMChannel.send('What name do you want to display?');
		DMChannel.awaitMessages((m) => !m.author.bot, { max: 1, time: 60000 })
			.then(async (collected) => {
				const name = collected.first().content;
				await DMChannel.send('What is your question?');
				DMChannel.awaitMessages((m) => !m.author.bot, { max: 1, time: 60000 })
					.then(async (collect) => {
						const question = collect.first().content;
						const channel = await this.gobbler.client.channels.fetch(this.channelId);
						const questionMsg = await channel.send(`A question from ***${name}: ${question}***`);
						await questionMsg.pin();
						await questionMsg.react('❗');
						await this.createCollector(questionMsg);
						this.openDMs.delete(user.id);
					});
			});
        
	}

	async createCollector(message) {
		const filter = () => true;
		const collector = message.createReactionCollector(filter);
		collector.on('collect', async (r, u) => {
			if (r.emoji.name === '❗' && !this.openDMs.has(u.id)) {
				this.openDMs.set(u.id, true);
				await this.createAnswer(u, message.content, message);
			} else if (r.emoji.name === '❓' && !this.openDMs.has(u.id)) {
				this.openDMs.set(u.id, true);
				await this.createQuestion(u);
			}
			const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(u.id));
			try {
				for (const reaction of userReactions.values()) {
					await reaction.users.remove(u.id);
				}
			} catch (error) {
				console.error('Failed to remove reactions.');
			}
		});
	}

	async createAnswer(user, text, question) {
		const DMChannel = await user.createDM();
		await DMChannel.send('What name do you want to display?');
		DMChannel.awaitMessages((m) => !m.author.bot, { max: 1, time: 60000 })
			.then(async (collected) => {
				const name = collected.first().content;
				await DMChannel.send(`Responding to the question ${text}.\nWhat is your answer?`);
				DMChannel.awaitMessages((m) => !m.author.bot, { max: 1, time: 60000 })
					.then(async (collect) => {
						const answer = collect.first().content;
						await question.lineReply(`From ***${name}: ${answer}***`);
						this.openDMs.delete(user.id);
					});
			});
	}

	async findOld() {
		const channel = await this.gobbler.client.channels.fetch(this.channelId);
		const oldMessages = await channel.messages.fetch();
		const fetched = oldMessages.filter(m => m.content.includes('A question from'));
		const question = await channel.messages.fetch(this.questionId);

		fetched.each(async (message) => await this.createCollector(message));
		await this.createCollector(question);
	}
}

module.exports = Questions;