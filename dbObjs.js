const Sequelize = require('sequelize');
// const Discord = require('discord.js');

const sequelize = new Sequelize('mysql://customer_203824_glizzys:GlizzyGalaxy69!@na05-sql.pebblehost.com/customer_203824_glizzys');

const Users = require('./models/Users')(sequelize, Sequelize.DataTypes);
const Exchange = require('./models/Exchange')(sequelize, Sequelize.DataTypes);
const UserItems = require('./models/UserItems')(sequelize, Sequelize.DataTypes);
const Items = require('./models/Items')(sequelize, Sequelize.DataTypes);
const Messages = require('./models/Messages')(sequelize, Sequelize.DataTypes);
// const UserItems = require('../models/UserItems')(sequelize, Sequelize.DataTypes);
// const Bets = require('./models/Bets')(sequelize, Sequelize.DataTypes);

// UserItems.belongsTo(Users);

Users.findUser = async function(target_id, client) {
    const user = await Users.findOne({
        where: { user_id: target_id },
    });

    if (user) {
        return user;
    } else {
        const username = await client.users.fetch(target_id);
        console.log('New user w/ id: ' + target_id);
        const new_user = await Users.create({
            user_id: `${target_id}`,
            name: `${username.username}`,
        });
        return new_user;
    }
};

Users.addGlizzys = async function(target_id, amt) {
    const user = await Users.findOne({
        where: { user_id: target_id },
    });

    if (user) {
        user.glizzys += amt;
        return user.save();
    } else {
        console.log('New user w/ id: ' + target_id);
        const new_user = await Users.create({
            user_id: `${target_id}`,
            glizzys: amt,   
        });
        return new_user;
    }
};

Users.addXp = async function(message) {
    const levels = [0, 30, 250, 500, 1000, 2000, 4000, 6000];

    const user = await Users.findOne({
        where: { user_id: message.author.id },
    });

    if (user) {
        user.xp += Math.floor(Math.random() * 2) + 3;
        let threshold;
        if(user.level >= 7) {
            threshold = 8000 + (user.level - 7) * 2000;
        } else {
            threshold = levels[user.level + 1];
        }
        if (user.xp >= threshold) {
            user.level += 1;
            message.reply(`congratualtions! You are now level \`${user.level}\`!`);
        }
        return user.save();
    }
};

UserItems.addItem = async function(user, item_name, amount) {
    console.log(item_name);
    const item = await UserItems.findOne({
        where: { item_name: item_name },
    });

    if (item) {
        item.amount += amount;
        return item.save();
    } else {
        const itemEntry = await Items.findOne({
            where: { item_name: item_name },
        });
        if (!itemEntry) {
            console.error('There is no such item!');
            return;
        }
        const newItem = await UserItems.create({
            user_id: user.id,
            user_name: user.username,
            item_name: item_name,
            amount: amount,
            item_id: itemEntry.item_id,
        });

        return newItem;
    }
};

exports.Users = Users;

exports.sequelize = sequelize;

exports.Exchange = Exchange;

exports.Items = Items;

exports.UserItems = UserItems;

exports.Messages = Messages;

// module.exports = { Users, sequelize, Messages, Bets };
