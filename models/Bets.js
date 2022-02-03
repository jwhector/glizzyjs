module.exports = (sequelize, DataTypes) => sequelize.define('bets', {
	_id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	creator: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	wager: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	better_ids: {
		type: DataTypes.ARRAY(DataTypes.STRING),
		allowNull: false,
	},
	better_usernames: {
		type: DataTypes.ARRAY(DataTypes.STRING),
		allowNull: false,
	},

}, {
	timestamps: false,
});