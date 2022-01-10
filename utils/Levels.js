const levelRoles = require('./levelroles.json');

class Levels {
    static async addLevel(message, db_user) {
        if (db_user.level === 100) {
            await message.channel.send('You are already max level!');
            return;
        }

        const cost = this.getCost(db_user.level + 1);
        if (db_user.glizzys < cost) {
            await message.channel.send('You do not have enough glizzys to level up!');
            return;
        }

        if (!((db_user.level + 1) % 10)) {
            const roleId = levelRoles[db_user.level + 1].id;
            const guildRole = message.guild.roles.cache.find(role => role.id === roleId);
            const member = message.guild.members.cache.get(message.author.id);
            if (guildRole && member) {
                const roleCache = member.roles.cache.filter((role) => {
                    for (const lvl in levelRoles) {
                        if (levelRoles[lvl].id === role.id) {
                            return true;
                        }
                    }
                    return false;
                });
                roleCache.forEach(async (value, key) => {
                    await member.roles.remove(key);
                });
                await member.roles.add(guildRole);
            }
        }

        db_user.glizzys -= cost;
        db_user.level += 1;
        await db_user.save();

        await message.channel.send(`${message.author.toString()} - Congratulations! You are now level \`${db_user.level}\`!`);
    }

    static getCost(level) {
        return Math.floor(200 * 1.027 ** level);
    }
}

module.exports = Levels;