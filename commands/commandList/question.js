module.exports = {
    name: 'question',
    aliases: ['q'],
    description: 'Temp: pose a question..',
    async execute(p) {
        const question = new (require('../../misc/Questions'))(p.gobbler);
        await question.findOld();
        await question.createQuestion('wazup', 'is the lolo rly coco???');
    },
};