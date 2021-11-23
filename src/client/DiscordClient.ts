import chalk from 'chalk';
import { Client, ClientOptions, Collection } from 'discord.js'
import { REST } from '@discordjs/rest'
import Command from '../structure/Command';
import { DISCORD_TOKEN } from '../config/auth.dev.json'
import discordData from '../config/discord-data.json'
import Handler from '../util/Handler';
import Event from '../structure/Event'
import { Manager } from 'erela.js';
import ErelaClient from './ErelaClient';
export default class DiscordClient extends Client {
    
    private _erela: Manager = ErelaClient;
    private _cmds = new Collection<string, Command>();
    private _events = new Collection<string, Event>();
    private _DJSRest = new REST({version: '9'})
    private _config = process.argv.includes('--server=test') ? discordData.test : discordData.folds;
    constructor(options: ClientOptions) {
        super(options);
        (async () => {
            await Handler.registerEvents(this, '../events').then(() => this.emit('debug', chalk.red(`Successfully registered events!`)))
            await Handler.registerCommands(this, '../commands').then(() => this.emit('debug', chalk.red(`Successfully registered commands!`)))

        })()
        
        

    }

    set config(config) {
        this._config = config;
    }
    get config() {
        return this._config
    }
    get events() {
        return this._events
    }
    get commands() {
        return this._cmds
    }

    get erela() {
        return this._erela
    }

    get restAPI() {
        return this._DJSRest.setToken(process.env.DISCORD_TOKEN ?? DISCORD_TOKEN);
    }
    

}