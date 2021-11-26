
import { CommandInteractionOptionResolver, Guild, GuildMember } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import DiscordClient from '../../client/DiscordClient';
import Command from "../../structure/Command";
import { Model } from 'sequelize/types';
import EmbedFactory from '../../util/EmbedFactory';


export default class SkipCommand extends Command {
    commandName = 'skip'
    commandDescription = 'Pomiń piosenkę'
    ephemeral = false;
    data = new SlashCommandBuilder().setDefaultPermission(true).addIntegerOption(opt => opt.setName('song').setDescription('Piosenka, do której chcesz pominąć').setRequired(false))

    async run(client: DiscordClient, cmd: CommandInteraction, options: CommandInteractionOptionResolver, guild: Guild, userProfile: Model<any, any>) {
        const member = cmd.member as GuildMember

        
        const guildPlayers = client.erela.players.get(member.guild.id);
        if(!guildPlayers) {
            cmd.reply({embeds: [EmbedFactory.generateErrorEmbed(`Music 🎶`, `Nic nie jest teraz odtwarzane!`)]})
            return;
        }
        if(!member.voice.channelId) {
            cmd.reply({embeds: [EmbedFactory.generateErrorEmbed(`Music 🎵`, `Nie jesteś na kanale głosowym!`)]})
            return;
        }
        if(member.voice.channelId !== guildPlayers.voiceChannel) {
            cmd.reply({embeds: [EmbedFactory.generateErrorEmbed(`Music 🎶`, `Aby słuchać muzyki, dołącz na ten sam kanał co ja!`)]})
            return;
        }
        guildPlayers.stop(options.getInteger('song', false) ?? undefined)
        cmd.reply({embeds: [EmbedFactory.generateInfoEmbed(`Music 🎶`, `👌 Pominięto!`)]})

            
        
    }
}