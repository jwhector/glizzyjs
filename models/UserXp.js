module.exports = (sequelize, DataTypes) => {
	const model = sequelize.define('user_xps', {
		user_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		user_name: {
			type: DataTypes.STRING,
		},
		textXp_daily: {
			type: DataTypes.DOUBLE,
			allowNull: false,
			defaultValue: 0,
		},
		reactXp_daily: {
			type: DataTypes.DOUBLE,
			allowNull: false,
			defaultValue: 0,
		},
		cotdXp_daily: {
			type: DataTypes.DOUBLE,
			allowNull: false,
			defaultValue: 0,
		},
		voiceXp_daily: {
			type: DataTypes.DOUBLE,
			allowNull: false,
			defaultValue: 0,
		},
		xp_daily: {
			type: DataTypes.DOUBLE,
			allowNull: false,
			defaultValue: 0,
		},
		decay_daily: {
			type: DataTypes.DOUBLE,
			allowNull: false,
			defaultValue: 0,
		},
		textXp_weekly: {
			type: DataTypes.DOUBLE,
			allowNull: false,
			defaultValue: 0,
		},
		reactXp_weekly: {
			type: DataTypes.DOUBLE,
			allowNull: false,
			defaultValue: 0,
		},
		cotdXp_weekly: {
			type: DataTypes.DOUBLE,
			allowNull: false,
			defaultValue: 0,
		},
		voiceXp_weekly: {
			type: DataTypes.DOUBLE,
			allowNull: false,
			defaultValue: 0,
		},
		xp_weekly: {
			type: DataTypes.DOUBLE,
			allowNull: false,
			defaultValue: 0,
		},
		decay_weekly: {
			type: DataTypes.DOUBLE,
			allowNull: false,
			defaultValue: 0,
		},
	}, {
		timestamps: false,
	});
	model.removeAttribute('id');
	return model;
};