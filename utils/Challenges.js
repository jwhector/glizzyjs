class Challenges {
    constructor(gobbler) {
        this.gobbler = gobbler;
        this.channel_id = '836785114313916479';
        // bot-ideas channel
        // this.channel_id = '841570603253497856';
        this.emote_id = '836758303568560148';
    }

    async printEntries() {
        const entries = await this.getEntries();
        // console.log(entries);
        this.roundUp();
    }

    async roundUp() {
        const channel = this.gobbler.client.guilds.cache.first().channels.cache.get(this.channel_id);
        const entries = await this.getEntries();
        let max = 0;
        let most_popular;
        for (const [key, entry] of entries) {
            // console.log(entry);
            const react = entry.reactions.cache.get(this.emote_id);
            // console.log(react);
            const db_user = await this.gobbler.users.findUser(entry.author.id, this.gobbler.client);
            if (react) {
                db_user.challenge_votes_received += react.count;
                db_user.challenge_posts += 1;
                await db_user.save();
                await this.gobbler.users.addXp(db_user, 25 + 3 * react.count);
                await db_user.user_xp.addXp(db_user, 'cotdXp_daily', 25 + 3 * react.count);
                await db_user.user_xp.addXp(db_user, 'cotdXp_weekly', 25 + 3 * react.count);
                await db_user.user_xp.addXp(db_user, 'xp_daily', 25 + 3 * react.count);
                await db_user.user_xp.addXp(db_user, 'xp_weekly', 25 + 3 * react.count);
                const count = react.count;
                // console.log(entry.author, ' ', count);
                if (count > max) {
                    max = count;
                    most_popular = entry;
                } else if (count === max) {
                    if (Array.isArray(most_popular)) {
                        most_popular.push(entry);
                    } else {
                        most_popular = [most_popular, entry];
                    }
                }
            }
        }
        console.log('MOST POPULAR: ' + most_popular);
        if (!most_popular) {
            await channel.send('Nobody was selected!');
            return;
        }
        if (Array.isArray(most_popular)) {
            await channel.send('There were multiple winners in today\'s contest!');
            for (let i = 0; i < most_popular.length; i++) {
                await channel.send(`${most_popular[i].author.toString()} is a winner in today's contest! \`250\` glizzys have been added to their balance.`);
                const winner = await this.gobbler.users.findUser(most_popular[i].author.id, this.gobbler.client);
                winner.challenge_wins += 1;
                await winner.save();
                await this.gobbler.users.addGlizzys(winner.user_id, 250);
                await this.gobbler.users.addXp(winner, 75);
                await winner.user_xp.addXp(winner, 'cotdXp_daily', 75);
                await winner.user_xp.addXp(winner, 'cotdXp_weekly', 75);
                await winner.user_xp.addXp(winner, 'xp_daily', 75);
                await winner.user_xp.addXp(winner, 'xp_weekly', 75);
            }
        } else {
            await channel.send(`${most_popular.author.toString()} won today's contest! \`250\` glizzys have been added to their balance.`);
            const winner = await this.gobbler.users.findUser(most_popular.author.id, this.gobbler.client);
            winner.challenge_wins += 1;
            await winner.save();
            await this.gobbler.users.addGlizzys(winner.user_id, 250);
            await this.gobbler.users.addXp(winner, 75);
            await winner.user_xp.addXp(winner, 'cotdXp_daily', 75);
            await winner.user_xp.addXp(winner, 'cotdXp_weekly', 75);
            await winner.user_xp.addXp(winner, 'xp_daily', 75);
            await winner.user_xp.addXp(winner, 'xp_weekly', 75);
        }
    }

    async getEntries() {
        const channel = this.gobbler.client.guilds.cache.first().channels.cache.get(this.channel_id);
        const now = new Date();
        const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 0, 0);
        if (now.getHours() < 7) date.setDate(date.getDate() - 1);
        const messages = await channel.messages.fetch();
        const entries = messages.filter(msg => msg.createdAt - date > 0);
        return entries;
    }

    async getVotes(userId) {
        let count;
        const entries = await this.getEntries();
        for (const [id, msg] of entries) {
            const votes = msg.reactions.cache.get(this.emote_id);
            if (votes) {
                const userCache = await votes.users.fetch();
                userCache.each((user) => {
                    if (user.id === userId) {
                        if (!count) {
                            count = 1;
                        } else {
                            count += 1;
                        }
                    }
                });
            }
            // console.log(count);
        }
        return count;
    }

    async checkDuplicates(message) {
        const entries = await this.getEntries();
        if (entries.filter(msg => msg.author === message.author).size > 1) {
            const botMsg = await message.channel.send(message.author.toString() + ', you have already entered once!');
            message.client.setTimeout(async () => await botMsg.delete(), 4000);
            await message.delete();
            return true;
        } else {
            await message.react('<:vote:836758303568560148>');
            return false;
        }
    }

    async messageHandler(msg) {
        if (msg.channel.id != this.channel_id) return;
        await this.checkDuplicates(msg);
    }

    async reactionHandler(reaction, user) {
        if (reaction.message.channel.id != this.channel_id) return;
        if (reaction.message.author.id === user.id) {
            await reaction.message.reactions.resolve(this.emote_id).users.remove(user.id);
            const botMsg = await reaction.message.channel.send(user.toString() + ', you cannot vote for your own post!');
            reaction.message.client.setTimeout(async () => await botMsg.delete(), 4000);
            return;
        }
        try {
            const votes = await this.getVotes(user.id);
            // console.log('FINAL VOTES: ' + votes);
            const db_user = await this.gobbler.users.findUser(user.id, this.gobbler.client);
            let allowedVotes = 2;
            if (db_user.level >= 70) allowedVotes = 4;
            else if (db_user.level < 70 && db_user.level >= 40) allowedVotes = 3;
            // console.log(db_user.name, db_user.levelallowedVotes);
            if (db_user.challenge_votes < allowedVotes) {
                await this.gobbler.users.addXp(db_user, 15);
                await db_user.user_xp.addXp(db_user, 'cotdXp_daily', 15);
                await db_user.user_xp.addXp(db_user, 'cotdXp_weekly', 15);
                await db_user.user_xp.addXp(db_user, 'xp_daily', 15);
                await db_user.user_xp.addXp(db_user, 'xp_weekly', 15);
                await db_user.increment('challenge_votes', { by: 1 });
            }
            if (votes > allowedVotes) {
                await reaction.message.reactions.resolve(this.emote_id).users.remove(user.id);
                const botMsg = await reaction.message.channel.send(user.toString() + ', you have already voted your maximum amount!');
                reaction.message.client.setTimeout(async () => await botMsg.delete(), 4000);
            }
        } catch (err) {
            console.error(err);
            return;
        }
    }
}
module.exports = Challenges;