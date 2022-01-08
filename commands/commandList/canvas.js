/* eslint-disable no-unused-vars */
const Canvas = require('canvas');
const Discord = require('discord.js');

module.exports = {
    name: 'canvas',
    aliases: ['c', 'can'],
    description: 'Draw test canvas.',
    hidden: true,
    async execute(p) {
        Canvas.registerFont('./resources/astron-boy-wonder/AstronBoyWonder.ttf', { family: 'Astron' });
        const canvas = Canvas.createCanvas(640, 360);
        const context = canvas.getContext('2d');

        const background = await Canvas.loadImage('./pics/dailybg.jpeg');
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        context.font = '60px "Astron"';
        context.fillStyle = '#ffffff';

        context.fillText(p.getMember().displayName, 50, 75);
        context.fillText('150 glizzys', 300, 125);
        context.fillText('STREAK', 375, canvas.height - 25);
        const db_user = await p.getAuthor();
        context.fillText(db_user.streak, 390, canvas.height - 80);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'daily-image.png');

        p.send(attachment);
    },
};