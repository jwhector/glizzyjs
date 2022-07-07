import Discord from 'discord.js';

function Bot() {
    this.client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

    const initialize = () => {
        console.log('init');
    }
}

export default Bot;