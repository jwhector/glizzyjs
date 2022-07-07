export default GuildsObj = (sequelize, DataTypes) => sequelize.define('guilds', {
	id: {
		type: DataTypes.STRING,
		primaryKey: true,
	},
	commands_channel: {
		type: DataTypes.INTEGER,
		defaultValue: null,
		allowNull: true,
	},
	challenge_channel: {
		type: DataTypes.INTEGER,
		defaultValue: null,
		allowNull: true,
	},
    profiles_channel: {
        type: DataTypes.INTEGER,
        defaultValue: null,
        allowNull: true,
    },
    prefix: {
        type: DataTypes.INTEGER,
        defaultValue: '$',
        allowNull: false
    }
}, {
	timestamps: false,
});