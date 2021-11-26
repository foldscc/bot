
import { CommandInteractionOptionResolver, Guild, GuildMember } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import DiscordClient from '../../client/DiscordClient';
import Command from "../../structure/Command";
import { Model } from 'sequelize/types';
import EmbedFactory from '../../util/EmbedFactory';


export default class BindChannelCommand extends Command {
    commandName = 'bind'
    commandDescription = 'Zmień kanał głosowy i kanał chatu sterowania bota!'
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
        //@ts-ignore
        if(member.id !== guildPlayer?.queue?.current?.requester.id) {
            cmd.reply({embeds: [EmbedFactory.generateErrorEmbed(`Music 🎶`, `Nie możesz zmienić kanału tekstowego i głosowego nie będąc osobą, która jest \`requesterem\`!`)]})
            return;
        }
        guildPlayer.setVoiceChannel(member.voice.channelId);
        guildPlayer.setTextChannel(cmd.channelId);
        cmd.reply({embeds: [EmbedFactory.generateInfoEmbed(`Music 🎵`, `Zaaktualizowano kanał głosowy: <#${member.voice.channelId}> i kanał chatu: <#${cmd.channelId}>!`)]})


        
        
    }
}