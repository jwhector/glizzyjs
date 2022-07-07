export default MessagesObj = (sequelize, DataTypes) => sequelize.define('messages', {
	_id: {
		type: DataTypes.STRING,
		primaryKey: true,
	},
	highlight: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
		allowNull: false,
	},
	glizzys: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
}, {
	timestamps: false,
});