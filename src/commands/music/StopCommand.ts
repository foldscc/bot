
import { CommandInteractionOptionResolver, Guild, GuildMember } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import DiscordClient from '../../client/DiscordClient';
import Command from "../../structure/Command";
import { Model } from 'sequelize/types';
import EmbedFactory from '../../util/EmbedFactory';


export default class StopCommand extends Command {
    commandName = 'stop'
    commandDescription = 'Zatrzymaj muzykę'
    ephemeral = false;
    data = new SlashCommandBuilder().setDefaultPermission(true)

    async run(client: DiscordClient, cmd: CommandInteraction, options: CommandInteractionOptionResolver, guild: Guild, userProfile: Model<any, any>) {
        const member = cmd.member as GuildMember

        
        const guildPlayer = client.erela.players.get(cmd.guildId!)
        if(!guildPlayer) {
            cmd.reply({embeds: [EmbedFactory.generateErrorEmbed(`Music 🎶`, `Nic nie jest teraz odtwarzane!`)]})
            return;
        }
        
        if(member.voice.channelId !== guildPlayer.voiceChannel) {
            cmd.reply({embeds: [EmbedFactory.generateErrorEmbed(`Music 🎶`, `Aby wyłączyć muzykę, musiz być na tym samym kanale co ja!`)]})
            return;
        }

        guildPlayer.destroy()
        cmd.reply({embeds: [EmbedFactory.generateErrorEmbed(`Music 🎶`, `Pomyślnie zatrzymano muzykę!`)]})
        return;
        
    }
}