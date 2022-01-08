module.exports = (sequelize, DataTypes) => {
    return sequelize.define('items', {
        item_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        item_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        emoji: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
    }, {
        timestamps: false,
    });
};