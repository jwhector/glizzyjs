const Canvas = require('canvas');
const Discord = require('discord.js');

const canvas = Canvas.createCanvas(600, 200);
const context = canvas.getContext('2d');

const background = Canvas.loadImage('../pics/dailybg.jpeg');
context.drawImage(background, 0, 0, canvas.width, canvas.height);

const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'daily-image.png');