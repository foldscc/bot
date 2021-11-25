import { config } from 'dotenv'
import DiscordClient from './client/DiscordClient';
import { ClientIntents as intents } from './util/Constants';
const client = new DiscordClient({intents});
import { DISCORD_TOKEN } from './config/auth.dev.json';

(async () => {
    config();
    await client.login(process.env.DISCORD_TOKEN ?? DISCORD_TOKEN)
    client.on('raw', (data) => client.erela.updateVoiceState(data))
})();





export default client;