module.exports = {
    name: 'dailyimg',
    description: 'Get daily display images.',
    hidden: true,
    async execute(p) {
        await createSyringe(p, 50, 50);
    },
};

async function createSyringe(p, toGive, streak) {
    const Canvas = require('canvas');
    const Discord = require('discord.js');
    Canvas.registerFont('./resources/astron-boy-wonder/AstronBoyWonder.ttf', { family: 'Astron' });
    const canvas = Canvas.createCanvas(560, 560);
    const context = canvas.getContext('2d');

    const background = await Canvas.loadImage('./pics/syringe.png');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.font = '44px "Astron"';
    context.fillStyle = '#000000';

    context.save();
    context.rotate(-Math.PI/4.1);
    context.translate(-200, 100);

    const name = p.getMember().displayName;

    // context.fillText(p.getMember().displayName, 100, 150);
    context.save();
    while (context.measureText(name).width > 237) {
        context.font = context.font.replace(/\d+px/, (parseInt(context.font.match(/\d+px/)) - 2) + "px");
    }

    context.fillText(name, 100, 150);
    context.restore();
    console.log(context.measureText('Glizzard Wiz').width)

    context.fillText(`${toGive} glizzys`, 125, 200);
    context.fillText('STREAK', 100, canvas.height - 85);
    context.fillText(streak, 110, canvas.height - 140);

    // context.restore();

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'daily-image.png');

    p.send(attachment);
}