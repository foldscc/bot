import { Manager, Node } from "erela.js";
import client from '..';
import Spotify from 'erela.js-spotify';
import chalk from 'chalk';
import { config } from "dotenv";
config();
import { ERELA_HOST, ERELA_PORT, ERELA_PASSWORD, SPOTIFY_SECRET, SPOTIFY_ID} from '../config/auth.dev.json'
const ErelaClient = new Manager({
    nodes: [
        {
            host: process.env.ERELA_HOST ?? ERELA_HOST,
            port: parseInt(process.env.ERELA_PORT!) ?? ERELA_PORT,
            password: process.env.ERELA_PASSWORD ?? ERELA_PASSWORD,
        }
    ],
    plugins: [
        new Spotify({
            clientSecret: process.env.SPOTIFY_SECRET ?? SPOTIFY_SECRET,
            clientID: process.env.SPOTIFY_ID ?? SPOTIFY_ID
        })
    ], 
    send(id, payload) {
        const guild = client.guilds.cache.get(id);
        if(guild) guild.shard.send(payload)
    }
}).on('nodeError', (node: Node, err: Error) => {
    console.log(chalk.red(err.message))
}).on('nodeConnect', (node) => {
    client.emit('debug', chalk.cyan(`[DEV] Node ${node.options.identifier} has connected successfully!`))
})
export default ErelaClient;