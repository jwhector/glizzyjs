const Sequelize = require('sequelize');
// const Discord = require('discord.js');

const sequelize = new Sequelize('mysql://customer_203824_glizzys:GlizzyGalaxy69!@na05-sql.pebblehost.com/customer_203824_glizzys', { logging: false });

const Users = require('./Users')(sequelize, Sequelize.DataTypes);
const Messages = require('./Messages')(sequelize, Sequelize.DataTypes);
const UserXp = require('./UserXp')(sequelize, Sequelize.DataTypes);

// UserItems.belongsTo(Users);

Users.hasOne(UserXp, { foreignKey: 'user_id' });
UserXp.belongsTo(Users, { foreignKey: 'user_id' });

Users.findUser = async function(target_id, client) {
	const user = await Users.findOne({
		where: { user_id: target_id },
		include: UserXp,
	});

	if (user) {
		return user;
	} 
	const username = await client.users.fetch(target_id);
	console.log('New user w/ id: ' + target_id);
	const cleanName = username.username.replace(/[^0-9A-Z]+/gi,'');
	const new_user = await Users.create({
		user_id: `${target_id}`,
		name: `${cleanName}`,
	});
	return new_user;
    
};

Users.findAllUsers = async function() {
	const users = await Users.findAll({
		include: UserXp,
	});
	return users;
};

Users.addGlizzys = async function(target_id, amt) {
	const user = await Users.findOne({
		where: { user_id: target_id },
	});

	if (user) {
		user.glizzys += amt;
		return user.save();
	} 
	console.log('New user w/ id: ' + target_id);
	const new_user = await Users.create({
		user_id: `${target_id}`,
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
