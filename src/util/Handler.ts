import DiscordClient from "../client/DiscordClient"
import path from "path";
import {promises as fs} from 'fs';
import { Interaction } from "discord.js";
export default class Handler extends null {
    constructor() {
        throw new Error(`The class ${this.constructor.name} is not supposed to be instantiated!`)
    }   

    static registerCommands = async (client: DiscordClient, dir: string = '') => {
        const filePath = path.join(__dirname, dir);
        const files = await fs.readdir(filePath)
        for (const file of files) {
            const stat = await fs.lstat(path.join(filePath, file))
            if(stat.isDirectory()) this.registerCommands(client, path.join(dir, file))
            if(file.endsWith('.js') || file.endsWith('.ts')) {
                const { default: Command } = await import(path.join(dir, file))
                const command = new Command();

                client.commands.set(command.getName(), command);
            }
        }
    }

    static registerEvents = async (client: DiscordClient, dir: string = '') => {
        const filePath = path.join(__dirname, dir);
        const files = await fs.readdir(filePath);
        for (const file of files) {
        const stat = await fs.lstat(path.join(filePath, file));
        if (stat.isDirectory()) this.registerEvents(client, path.join(dir, file));
        if (file.endsWith('.js') || file.endsWith('.ts') && !file.endsWith('.dev.ts') || !file.endsWith('.dev.js')) {
            const { default: Event } = await import(path.join(dir, file));
            const event = new Event();
            client.events.set(event.getName(), event);
            client.on(event.getName(), event.run.bind(event, client));
            }
        }
    }

    static validateInteractionType = async (client: DiscordClient, interaction: Interaction, interactionType: "component" | "button" | "command" | "menu") => {
        const files = await fs.readdir(path.join(__dirname, '/../interactions'))
        for (const file of files) {
            const {default: currentFile} = await import(`${__dirname}/../interactions/${file}`)
            const handledFile = new currentFile()
            if(handledFile.getListenedType() !== interactionType) continue;
            handledFile.run(client, interaction)
        }
    }

    
}