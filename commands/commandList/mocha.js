/* eslint-disable no-unused-vars */

module.exports = {
    name: 'mocha',
    description: 'Cat.',
    async execute(p) {
        const mochaFolder = './pics/mocha';
        const fs = require('fs');
        fs.readdir(mochaFolder, async (err, files) => {
            // files.forEach(file => {
            //     console.log(file);
            // });
            // console.log(files);
            const idx = Math.floor(Math.random() * (files.length - 1));
            const chosenPic = files[idx];

            // console.log(chosenPic);

            const pic = fs.readFileSync('./pics/mocha/' + chosenPic);

            await p.send({ files: [pic] });

            // const db_user = await p.getAuthor();
            await p.gobbler.users.addGlizzys(p.author.id, -5);

        })
    },
};