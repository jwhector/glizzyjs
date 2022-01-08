const channelId = '861727569556013105';
const roleMsgId = '861735183111684096';
const emojiIds = ['861728801866907678', '861728817583226880', '861728828262973501'];
const Users = require('../models/dbObjs').Users;
const { Op } = require('sequelize');

// tank: 861728801866907678
// dps:861728817583226880
// support: 861728828262973501

class Tournament {
    constructor(gobbler) {
        this.gobbler = gobbler;
    }
    
    async assignRoles() {
        const roleMsg = await this.gobbler.client.channels.fetch(channelId)
            .then(async (channel) => await channel.messages.fetch(roleMsgId))
            .catch(console.error());
        const filter = (r) => emojiIds.includes(r.emoji.id);
        const collector = roleMsg.createReactionCollector(filter, { dispose: true });
        collector.on('collect', async (r, u) => {
            await setRole(r, u, true);
        });
        collector.on('remove', async (r, u) => {
            await setRole(r, u, false);
        });
    }

    async recruit(name, team) {
        const db_user = await Users.findOne({
            where: { name: name },
        }).catch(console.error());
        const channel = await this.gobbler.client.channels.fetch(channelId);

        if (!db_user) {
            await channel.send('No user exists with this name!');
            return;
        } else if (!team) { team = null; }

        db_user.team = team;
        db_user.save();
        
        await channel.send(`Recruited ${name} to Team ${team ? team : 'None'}.`);
    }

    async printRoles(team) {
        const tanks = await this.getTanks(team);
        const dpses = await this.getDps(team);
        const supports = await this.getSupports(team);
        
        let str = '```\n';
        str += team ? `------ROLES FOR TEAM ${team}------\n` : '----------OPEN ROLES--------\n';
        str += '------------TANKS-----------\n';
        for (const tank of tanks) {
            str = str + `${tank.dataValues.name}\n`;
        }
        str += '------------DPS-------------\n';
        for (const dps of dpses) {
            str += `${dps.dataValues.name}\n`;
        }
        str += '----------SUPPORTS----------\n';
        for (const support of supports) {
            str += `${support.dataValues.name}\n`;
        }
        str += '```';

        const channel = await this.gobbler.client.channels.fetch(channelId);
        await channel.send(str);
    }

    async getTanks(team) {
        const tanks = await Users.findAll({
            where: {
                [Op.and]: [
                    { tank: true },
                    { team: team },
                ],
            },
        });
        return tanks;
    }

    async getDps(team) {
        const dps = await Users.findAll({
            where: {
                [Op.and]: [
                    { dps: true },
                    { team: team },
                ],
            },
        });
        return dps;
    }

    async getSupports(team) {
        const supports = await Users.findAll({
            where: {
                [Op.and]: [
                    { support: true },
                    { team: team },
                ],
            },
        });
        return supports;
    }
}

async function setRole(r, u, give) {
    const db_user = await Users.findOne({
        where: { user_id: u.id },
    }).catch(console.error());
    
    if (r.emoji.id == '861728801866907678') {
        db_user.tank = give;
    } else if (r.emoji.id == '861728817583226880') {
        db_user.dps = give;
    } else if (r.emoji.id == '861728828262973501') {
        db_user.support = give;
    }
    db_user.save();
}

module.exports = Tournament;