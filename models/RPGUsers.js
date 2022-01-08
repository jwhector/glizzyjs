module.exports = (sequelize, DataTypes) => {
    return sequelize.define('bets', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        character_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        xp: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        better_usernames: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
        },

    }, {
        timestamps: false,
    });
};