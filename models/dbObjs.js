const Sequelize = require('sequelize');
// const Discord = require('discord.js');

const sequelize = new Sequelize('mysql://customer_269565_glizzy:DyXuHLETRvxWL$Ov@a4Z@na03-sql.pebblehost.com/customer_269565_glizzy');

const Users = require('./Users')(sequelize, Sequelize.DataTypes);
const Messages = require('./Messages')(sequelize, Sequelize.DataTypes);
const UserXp = require('./UserXp')(sequelize, Sequelize.DataTypes);

// UserItems.belongsTo(Users);

Users.hasOne(UserXp, { foreignKey: 'user_id' });
UserXp.belongsTo(Users, { foreignKey: 'user_id' });

Users.findUser = async function(user) {
	const db_user = await Users.findOne({
		where: { user_id: user.id },
		include: UserXp,
	});

	if (db_user) {
		return db_user;
	} 
	// const username = await client.users.fetch(user.id);
	console.log('New user w/ id: ' + user.id);
	const cleanName = user.username.replace(/[^0-9A-Z]+/gi,'');
	const new_user = await Users.create({
		user_id: `${user.id}`,
		name: `${cleanName}`,
	});
	return new_user;
    
};

Users.findAllUsers = async function() {
	const users = await Users.findAll({
		attributes: ['user_id', 'rep_level', 'xp'],
		include: UserXp,
	});
	return users;
};

Users.addGlizzys = async function(user, amt) {
	const db_user = await Users.findOne({
		where: { user_id: user.id },
	});

	if (db_user) {
		db_user.glizzys += amt;
		return db_user.save();
	} 
	// const username = await client.users.fetch(user.id);
	console.log('New user w/ id: ' + user.id);
	const cleanName = user.username.replace(/[^0-9A-Z]+/gi,'');
	const new_user = await Users.create({
		user_id: `${user.id}`,
		name: `${cleanName}`,
		glizzys: amt,   
	});
	return new_user;
    
};

Users.addXp = async function(db_user, amt) {
	const newXp = db_user.xp + amt;
	await db_user.increment('xp', { by: amt });
	if (db_user.rep_level * 150 < newXp) {
		await db_user.increment('rep_level', { by: 1 });
	}
};

UserXp.prototype.addXp = async function(db_user, col, amt) {
	// console.log('ID: ' + db_user.user_id + ' COL: ' + col);
	const userXp = await UserXp.findOne({
		where: { user_id: db_user.user_id },
	});

	if (userXp) {
		// console.log(amt);
		await userXp.increment(col, { by: amt }).catch(console.error());
		// userXp[col] = userXp.col + amt;
		// console.log(userXp[col]);
		// await userXp.save();
		return userXp;
	}

	const newXp = await UserXp.create({ user_id: db_user.user_id, user_name: db_user.name, col: amt });
	return newXp;
};

exports.Users = Users;

exports.sequelize = sequelize;

exports.Messages = Messages;

exports.UserXp = UserXp;

// module.exports = { Users, sequelize, Messages, Bets };
