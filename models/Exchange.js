module.exports = (sequelize, DataTypes) => sequelize.define('exchange', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	user_id: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	item_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	item_name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	price: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
}, {
	timestamps: false,
});