module.exports = (sequelize, DataTypes) => sequelize.define('users', {
	user_id: {
		type: DataTypes.STRING,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
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
	// contest_entry: {
	//     type: DataTypes.STRING,
	//     defaultValue: '',
	//     allowNull: false,
	// },
	streak: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	// white_shards: {
	//     type: DataTypes.INTEGER,
	//     defaultValue: 0,
	//     allowNull: false,
	// },
	// red_shards: {
	//     type: DataTypes.INTEGER,
	//     defaultValue: 0,
	//     allowNull: false,
	// },
	// green_shards: {
	//     type: DataTypes.INTEGER,
	//     defaultValue: 0,
	//     allowNull: false,
	// },
	// blue_shards: {
	//     type: DataTypes.INTEGER,
	//     defaultValue: 0,
	//     allowNull: false,
	// },
	// purple_shards: {
	//     type: DataTypes.INTEGER,
	//     defaultValue: 0,
	//     allowNull: false,
	// },
	// singularities: {
	//     type: DataTypes.INTEGER,
	//     defaultValue: 0,
	//     allowNull: false,
	// },
	// amulets: {
	//     type: DataTypes.INTEGER,
	//     defaultValue: 0,
	//     allowNull: false,
	// },
	voiceGlizzys: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	// tank: {
	//     type: DataTypes.BOOLEAN,
	//     defaultValue: false,
	//     allowNull: false,
	// },
	// dps: {
	//     type: DataTypes.BOOLEAN,
	//     defaultValue: false,
	//     allowNull: false,
	// },
	// support: {
	//     type: DataTypes.BOOLEAN,
	//     defaultValue: false,
	//     allowNull: false,
	// },
	// team: {
	//     type: DataTypes.INTEGER,
	// },
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
	text_posts_daily: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	reacts_daily: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	reacted_daily: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	free_highlights: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	christmas_2021: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
		allowNull: false,
	},
	fake_glizzys: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	fake_streak: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
	}
}, {
	timestamps: false,
});