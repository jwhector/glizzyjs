module.exports = (sequelize, DataTypes) => {
	const model = sequelize.define('user_items', {
		user_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		user_name: {
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
		amount: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
	}, {
		timestamps: false,
	});
	model.removeAttribute('id');
	return model;
};