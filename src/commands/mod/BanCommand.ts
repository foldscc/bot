import { RolePermission } from './../../util/Constants';
import { SlashCommandBuilder } from '@discordjs/builders';
import Command from "../../structure/Command";
import DiscordClient from '../../client/DiscordClient';
import { CommandInteraction, CommandInteractionOptionResolver, Guild } from 'discord.js';
import { Model } from 'sequelize/types';

export default class BanCommand extends Command {
    commandName = 'ban'
    commandDescription = 'Ban a user from this guild'
    perms = 'MOD' as RolePermission
    data = new SlashCommandBuilder().setDefaultPermission(this.getDefaultPermission())
        .addSubcommand(cmd => cmd.setName('by-ign')
            .setDescription('Ban a user by his IGN (or UUID)')
            .addStringOption(opt => opt.setRequired(true).setName('ign').setDescription('The IGN/UUID of a user to ban').setRequired(true))
            .addStringOption(opt => opt.setName('reason').setDescription('The reason of the ban').setRequired(true))

        )
        .addSubcommand(cmd => cmd.setName('by-mention')
            .setDescription('Ban a user by his Mention')
            .addMentionableOption(opt => opt.setName('mention').setDescription(`A mention of the user to ban`).setRequired(true))
            .addStringOption(opt => opt.setName('reason').setDescription('The reason of the ban').setRequired(true))
        )
        async run(client: DiscordClient, cmd: CommandInteraction, options: CommandInteractionOptionResolver, guild: Guild, user: Model<any, any>, userLanguage: any) {
            client.emit('debug', '[DEV] Client has found a command executed!')   
        }
    
    
    
}