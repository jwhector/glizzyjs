/* eslint-disable no-unused-vars */
const Discord = require('discord.js');

module.exports = {
    name: 'profile',
    description: 'Alllows a user to create a custom profile over private message.',
    async execute(p) {
        const author = p.author;
        const DMChannel = await author.createDM();
        const user = await p.getAuthor(author.id);
        const filter = m => m.author === author;
        const messages = ['What\'s your favorite song?', 'What\'s your favorite food?', 'Where do you want to go on vacation next?',
            'I hope you have hobbies... Any?', 'One last thing, give us a short description of yourself!', 'Welcome to Glizzys!!'];
        const mods = ['games_text', 'song', 'food', 'vacation', 'hobbies', 'description'];
        const profile = {};

        DMChannel.send('Let\'s get started setting up your profile! Please respond to each question once.');
        DMChannel.send('What games do you play?');

        try {
            for (let i = 0; i < messages.length; i++) {
                await awaitResponse(filter, DMChannel, profile, messages[i], mods[i]);
            }
            
            const embed = constructEmbed(author, profile);
            await p.client.channels.fetch('827370925867401229').then(channel => channel.send(embed));
            user.save();
        } catch(e) {
            console.error(e);
        }

    },
};

async function awaitResponse(filter, DMChannel, profile, msg, mod) {
    await DMChannel.awaitMessages(filter, { max: 1, time: 600000, errors: ['time'] })
        .then(collected => {
            profile[mod] = collected.first().content;
            DMChannel.send(msg);
        })
        .catch(() => {
            DMChannel.send('Session timed out! Please use the $profile command again to restart.');
            throw 'Timeout!';
        });
}

function constructEmbed(author, profile) {
    const colors = ['#2BFFC7', '#FF46F9', '#A946FF', '#FF4646', '#468BFF'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const exampleEmbed = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle(`${author.username}'s Introduction`)
            .setThumbnail(author.avatarURL())
            .addFields(
                { name: 'Games', value: profile.games_text, inline: true },
                { name: 'Favorite Food', value: profile.food, inline: true },
                { name: 'Favorite Song', value: profile.song, inline: true },
                { name: 'Next Vacation', value: profile.vacation, inline: true },
                { name: 'Hobbies', value: profile.hobbies, inline: true },
            )
            .setImage()
            .addField('Bio', profile.description);
    return exampleEmbed;
}