export default UsersObj = (sequelize, DataTypes) => sequelize.define('users', {
	user_id: {
		type: DataTypes.STRING,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
		defaultValue: 'Unknown',
	},
    guild_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
	glizzys: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	xp: {
		type: DataTypes.DOUBLE,
		defaultValue: 0,
		allowNull: false,
	},
	level: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	daily: {
		type: 'TIMESTAMP',
		defaultValue: '2001-09-28 23:00',
		allowNull: false,
	},
	streak: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	voiceGlizzys: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	challenge_votes_received: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	time_in_voice: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	text_posts: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	challenge_posts: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	challenge_wins: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	highlights_given: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	highlights_received: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	reactions_given: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	reactions_received: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	glizzys_traded: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	dailies: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	rep_level: {
		type: DataTypes.INTEGER,
		defaultValue: 1,
		allowNull: false,
	},
	challenge_votes: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	free_highlights: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
	}
}, {
	timestamps: false,
});