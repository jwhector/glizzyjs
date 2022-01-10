/* eslint-disable no-unused-vars */
module.exports = {
    name: 'jarvis',
    description: 'Summon Jarvis.',
    example: '$jarvis I mean Mommy..',
    async execute(p) {
        createImage(p);
    },
};

async function createImage(p) {
        const Canvas = require('canvas');
        const Discord = require('discord.js');
        Canvas.registerFont('./resources/astron-boy-wonder/AstronBoyWonder.ttf', { family: 'Astron' });
        const canvas = Canvas.createCanvas(640, 360);
        const context = canvas.getContext('2d');

        const background = await Canvas.loadImage('./pics/jarvis.png');
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        let fontSize = 60;
        context.font = '60px "Astron"';
        context.fillStyle = '#ffffff';

        context.fillText('Jarvis', 40, 50);
        // context.fillText(`${toGive} glizzys`, 300, 140);
        context.textAlign = 'center';
        context.fillStyle = 'white';
        // const text = p.args.join(' ');

        // while (context.measureText(text).width > canvas.width - 100) {
        //     context.font = `${fontSize -= 10}px "Astron"`;
        // }

        const lines = p.args.join(' ').split('\n');

        for (let i = 0; i < lines.length; i++) {
            const curLine = lines[i];

            while (context.measureText(curLine).width > canvas.width - 100) {
                context.font = `${fontSize -= 10}px "Astron"`;
            }

            context.fillText(lines[i], canvas.width / 2, canvas.height - (25 + 50 * (lines.length - i - 1)));
        }

        // context.fillText(p.args.join(' '), canvas.width / 2, canvas.height - 25);
        // const db_user = await p.getAuthor();
        // context.fillText(db_user.streak + 1, 390, canvas.height - 80);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'jarvis.png');

        p.send(attachment);
}