import { config } from 'dotenv'
import DiscordClient from './client/DiscordClient';
import { ClientIntents as intents } from './util/Constants';
const client = new DiscordClient({intents});
import { DISCORD_TOKEN } from './config/auth.dev.json';
import chalk from 'chalk';
import Util from './util/Util';

(async () => {
    
    config();
    await client.login(process.env.DISCORD_TOKEN ?? DISCORD_TOKEN)
    client.on('ready', () => {
        console.log(chalk.green(`${client.user!.tag} is now ready.`))
        console.log(client.commands.map(k => k.getData()))
        Util.publishCommands(client)
    })

    
})();





export default client;