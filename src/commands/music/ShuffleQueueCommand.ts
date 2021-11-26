
import { CommandInteractionOptionResolver, Guild, GuildMember } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import DiscordClient from '../../client/DiscordClient';
import Command from "../../structure/Command";
import { Model } from 'sequelize/types';
import EmbedFactory from '../../util/EmbedFactory';


export default class ShuffleCommand extends Command {
    commandName = 'shuffle'
    commandDescription = 'Rozmieszaj całą kolejkę'
    ephemeral = false;
    data = new SlashCommandBuilder().setDefaultPermission(true)

    async run(client: DiscordClient, cmd: CommandInteraction, options: CommandInteractionOptionResolver, guild: Guild, userProfile: Model<any, any>) {
        const member = cmd.member as GuildMember

        
        const guildPlayer = client.erela.players.get(cmd.guildId!)
        if(!guildPlayer) {
            cmd.reply({embeds: [EmbedFactory.generateErrorEmbed(`Music 🎶`, `Nic nie jest teraz odtwarzane!`)]})
            return;
        }
        if(!member.voice.channelId) {
            cmd.reply({embeds: [EmbedFactory.generateErrorEmbed(`Music 🎵`, `Nie jesteś na kanale głosowym!`)]})
            return;
        }
        if(member.voice.channelId !== guildPlayer.voiceChannel) {
            cmd.reply({embeds: [EmbedFactory.generateErrorEmbed(`Music 🎶`, `Aby słuchać muzyki, dołącz na ten sam kanał co ja!`)]})
            return;
        }
        guildPlayer.queue.shuffle()

        cmd.reply({embeds: [EmbedFactory.generateInfoEmbed(`Music 🎵`, `Pomyślnie rozmieszano kolejkę z \`${guildPlayer.queue.totalSize}\` utworami!`)]})
        
        
        
        
        
    }
}