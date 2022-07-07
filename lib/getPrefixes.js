import { Guilds } from "./models/dbObjs";

export async function getPrefixes() {

}

export async function getPrefix(guildId) {
    try {
        const prefixes = await Guilds.getPrefixes();

    } catch (err) {
        console.log(err);
    }
}

export async function setPrefix(guildId) {
    
}