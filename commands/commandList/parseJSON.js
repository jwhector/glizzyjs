module.exports = {
    name: 'parse',
    description: '{DEBUG} Parse and print JSON.',
    hidden: true,
    async execute(p) {
        const json = require('../../utils/squeezebags.json');
        console.log(json['838522305889042513']);
    },
};