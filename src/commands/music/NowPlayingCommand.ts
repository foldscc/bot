
import { CommandInteractionOptionResolver, Guild } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import DiscordClient from '../../client/DiscordClient';
import Command from "../../structure/Command";
import { Model } from 'sequelize/types';
import EmbedFactory from '../../util/EmbedFactory';
import { Track } from 'erela.js';


export default class NowPlayingCommand extends Command {
    commandName = 'nowplaying'
    commandDescription = 'Sprawdź obecnie grany utwór'
    ephemeral = false;
    data = new SlashCommandBuilder().setDefaultPermission(this.getDefaultPermission())

    async run(client: DiscordClient, cmd: CommandInteraction, options: CommandInteractionOptionResolver, guild: Guild, userProfile: Model<any, any>) {
       
        
        const guildPlayers = client.erela.players.get(cmd?.guild?.id!)
        if(!guildPlayers) {
            cmd.reply({embeds: [EmbedFactory.generateErrorEmbed(`Music 🎶`, `Nic nie jest teraz odtwarzane!`)]})
            return;
        }
        const nextSong = guildPlayers.queue.values().next().value as Track
        cmd.reply({embeds: [EmbedFactory.generateInfoEmbed(`Music 🎶`, `\`•\` Obecnie odtwarzane: \`${guildPlayers.queue.current?.title}\` | ${guildPlayers.queue.current?.isStream 
            ? '[LIVE]' 
            : guildPlayers.queue.current?.duration} \n\n \`•\` Następne w kolejce: ${nextSong ? `\`${nextSong.title}\` | ${nextSong.isStream ? 'LIVE' : nextSong.duration}` : `Brak.`}`)]})

        
    }
}