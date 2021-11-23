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
            .setDescription('Zbanuj użytkownika używając jego IGN (lub UUID)')
            .addStringOption(opt => opt.setRequired(true).setName('ign').setDescription('IGN/UUID użytkownika').setRequired(true))
            .addStringOption(opt => opt.setName('reason').setDescription('Powód bana').setRequired(true))
            .addStringOption(opt => opt.setName('duration').setDescription('Czas trwania bana'))
        )
        .addSubcommand(cmd => cmd.setName('by-mention')
            .setDescription('Zbanuj użytkownika używając jego wzmianki')
            .addMentionableOption(opt => opt.setName('mention').setDescription(`Wzmianka użytkownika do zablokowania`).setRequired(true))
            .addStringOption(opt => opt.setName('reason').setDescription('Powód bana').setRequired(true))
            .addStringOption(opt => opt.setName('duration').setDescription('Czas trwania bana'))
        )
        async run(client: DiscordClient, cmd: CommandInteraction, options: CommandInteractionOptionResolver, guild: Guild, user: Model<any, any> | null) {  
        }
    
    
    
}