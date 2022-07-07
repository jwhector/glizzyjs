import Sequelize from "sequelize";
import MessagesObj from "./Messages";
import UsersObj from "./Users";
import GuildsObj from "./Guilds";

const sequelize = new Sequelize('mysql://customer_269565_glizzy:DyXuHLETRvxWL$Ov@a4Z@na03-sql.pebblehost.com/customer_269565_glizzy', {
	logging: false
});

const Users = UsersObj(sequelize, Sequelize.DataTypes);
const Messages = MessagesObj(sequelize, Sequelize.DataTypes);
const Guilds = GuildsObj(sequelize, Sequelize.DataTypes);

Users.findUser = async function(user) {
	const db_user = await Users.findOne({
		where: { user_id: user.id }
	});

	if (db_user) {
		return db_user;
	}

	console.log('New user w/ id: ' + user.id);
	const cleanName = user.username.replace(/[^0-9A-Z]+/gi,'');
	const new_user = await Users.create({
		user_id: `${user.id}`,
		name: `${cleanName}`,
	});

	return new_user;
};

Users.findAllUsers = async function() {
	const getPlainData = records => records.map(record =>
  		record.get({ plain: true }));

	const users = await Users.findAll({
		attributes: ['user_id', 'rep_level', 'xp'],
	}).then(getPlainData);
	
    return users;
};

Users.prototype.addGlizzys = async function(amt) {
	if (!amt) {
		throw new Error("Must include amount to modify!");
	}
	
	try {
		const db_user = await Users.findOne({
			where: { user_id: this.id },
		});
	
		if (db_user) {
			db_user.glizzys += amt;
			return await db_user.save();
		}
	
		console.log('New user w/ id: ' + this.id);
		const cleanName = this.username.replace(/[^0-9A-Z]+/gi,'');
		const new_user = await Users.create({
			user_id: `${this.id}`,
			name: `${cleanName}`,
			glizzys: amt,   
		});
	
		return new_user;
	} catch (error) {
		console.log(error);
	}
};

Guilds.findGuild = async function(guildId) {
	try {
		const guild = await Guilds.findOne({
			where: { 'id': guildId }
		});
		
	} catch (error) {
		
	}
}

Guilds.getPrefixes = async function() {
	const getPlainData = records => records.map(record =>
		record.get({ plain: true }));
	
	try {
		const allGuilds = await Guilds.findAll({
			attributes: ['id', 'prefix']
		}).then(getPlainData);
		
		const prefixes = {};
	
		allGuilds.forEach(guild => {
			prefixes[guild.id] = guild.prefix;
		});
		return prefixes;
	} catch (error) {
		console.log(error);
	}
}

export { Users, Guilds, Messages };