import { RolePermission } from './../../util/Constants';
import { SlashCommandBuilder } from '@discordjs/builders';
import Command from "../../structure/Command";
import DiscordClient from '../../client/DiscordClient';
import { CommandInteraction, CommandInteractionOptionResolver, Guild } from 'discord.js';
import { Model } from 'sequelize/types';
import EmbedFactory from '../../util/EmbedFactory';


export default class BanCommand extends Command {
    commandName = 'ping'
    commandDescription = 'Pong!'
    perms = 'USER' as RolePermission
    data = new SlashCommandBuilder().setDefaultPermission(this.getDefaultPermission())
    
        async run(client: DiscordClient, cmd: CommandInteraction, options: CommandInteractionOptionResolver, guild: Guild, user: Model<any, any> | null) {  
            
            cmd.reply({embeds: [EmbedFactory.generateLoadingEmbed(false, `Pong!`, `The current **websocket ping** is: \`${client.ws.ping}ms\`. \nHold tight for the **interaction edit** latency!`)]}).then(() => {
                cmd.editReply({embeds: [EmbedFactory.generateLoadingEmbed(true, `Pong!`, `The current **websocket ping** is: \`${client.ws.ping}ms\`. The **interaction edit** latency is: \`${Date.now() - cmd.createdTimestamp}ms\``)]})
            })            
        
        }
    
    
    
}