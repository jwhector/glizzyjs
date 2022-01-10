module.exports = {
    name: 'merryglizzmas',
    aliases: ['merryglizmas', 'fucc ya santa'],
    description: 'Merry Glizzmas!.',
    permissions: 'ADMINISTRATOR',
    hidden: true,
    async execute(p) {
        const user = await p.getAuthor();

        await user.save();

        if (!user.christmas_2021) {
            user.christmas_2021 = true;
            try {
                await p.users.addXp(user, 150);
                await p.users.addGlizzys(user.user_id, 500);
                user.free_highlights = user.free_highlights + 1;
                await user.save();
                await p.send('Merry Glizzmas! Down a weenie and enjoy `500` glizzys, a free highlight, and a free rep level up!');
            } catch (err) {
                await p.send('Something went wrong!');
                console.log(err);
            }
        } else {
            await p.send('Merry Christmas you greedy hoe!');
        }
    },
};