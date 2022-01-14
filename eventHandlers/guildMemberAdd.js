exports.handle = async function(guildMember) {
    guild.channels.get('819963117148700692').send({ embed : {
        color: ('#1433A6'),
        title: "Welcome!",
        description: "Welcome to deez " + guildMember.user.username + " nutz gottem",
        fields: [{ 
            name: "Glizzard Entertainment",
            value: "We are gamers/coders/doctors/artists, and so much more! We hope you stay with us and have a wonderful time and become part of our little family! :)"
        }],
        timestamp: newDate(),
        footer: {
            icon_url: client.user.avatarURL,
            text: "© Glizzard Entertainment 2020 - The Future"
        }
    }});    
    
    const DMChannel = await guildMember.createDM();
    
    await DMChannel.send("This bot was created by Penicillen, and is now being co-dev'd by LucioBoi. Please read the rules, set up a profile using $profile, and don't be afraid to ask us questions! :)");
}