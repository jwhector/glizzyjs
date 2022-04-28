const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mysql://customer_269565_glizzy:nR0p#zUExGLHsZBj~aaZ@na03-sql.pebblehost.com/customer_269565_glizzy');

const Users = require('./models/Users')(sequelize, Sequelize.DataTypes);
// const Exchange = require('./models/Exchange')(sequelize, Sequelize.DataTypes);
// const UserItems = require('./models/UserItems')(sequelize, Sequelize.DataTypes);
// const Items = require('./models/Items')(sequelize, Sequelize.DataTypes);
// const Messages = require('./models/Messages')(sequelize, Sequelize.DataTypes);
// const Bets = require('./models/Bets')(sequelize, Sequelize.DataTypes);

// const force = process.argv.includes('--force') || process.argv.includes('-f');

Users.sync({ alter: true }).then(async () => {
	try {
		await sequelize.authenticate();
		console.log('Authenticated!');
	} catch (error) {
		console.error('Unable to connect:', error);
	}
}).catch(console.error);

// sequelize.sync();