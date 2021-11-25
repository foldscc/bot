
import { CommandInteractionOptionResolver, Guild } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import DiscordClient from '../../client/DiscordClient';
import Command from "../../structure/Command";
import { Model } from 'sequelize/types';
import EmbedFactory from '../../util/EmbedFactory';


export default class PlayCommand extends Command {
    commandName = 'play'
    commandDescription = 'Zrób radio na swoim kanale głosowym'
    ephemeral = false;
    data = new SlashCommandBuilder().setDefaultPermission(true).addStringOption(opt => opt.setName('query').setDescription('Zapytanie (tytuł/link...)').setRequired(true))

    async run(client: DiscordClient, cmd: CommandInteraction, options: CommandInteractionOptionResolver, guild: Guild, userProfile: Model<any, any>) {
        const query = options.getString('query', true)
        const musicTracks = await client.erela.search(query, cmd.user)
        const member = await guild?.members.fetch(cmd.user.id)!
        if(!member.voice.channelId) {
            cmd.reply({embeds: [EmbedFactory.generateErrorEmbed(`Music 🎵`, `Nie jesteś na kanale głosowym!`)]})
            return;
        }
        
        const guildPlayers = client.erela.players.get(cmd.guildId!)
        if(!guildPlayers) {
            const player = client.erela.create({
                guild: cmd!.guild!.id,
                voiceChannel: member.voice.channelId || undefined,
                textChannel: cmd.channel!.id!,
                selfDeafen: true
            })
            
            await player.connect()
            if(musicTracks.loadType === 'PLAYLIST_LOADED') {
                for (const track of musicTracks.tracks) {
                    player.queue.add(track)
                }
                cmd.reply({embeds: [EmbedFactory.generateInfoEmbed(`Music 🎶`,`${cmd.user} dodał(a) playlistę: \`${musicTracks.playlist?.name}\` [\`${musicTracks.tracks.length} piosenek\`]`)]})
                
            } else {
                console.log(musicTracks)
                player.queue.add(musicTracks.tracks[0])
                
                cmd.reply({embeds: [EmbedFactory.generateInfoEmbed(`Music 🎶`, `${cmd.user} dodał(a) piosenkę: \`${musicTracks.tracks[0].title}\``).setImage(`${musicTracks.tracks[0].thumbnail ?? ''}`)]})
            }
            await player.play().then(() => console.log('test'))
            return;
        }
        if(member.voice.channelId !== guildPlayers.voiceChannel) {
            cmd.reply({embeds: [EmbedFactory.generateErrorEmbed(`Music 🎶`, `Aby słuchać muzyki, dołącz na ten sam kanał co ja!`)]})
            return;
        }
        if(musicTracks.loadType === 'PLAYLIST_LOADED') {
            for (const track of musicTracks.tracks) {
                guildPlayers.queue.add(track)
            }
            cmd.reply({embeds: [EmbedFactory.generateInfoEmbed(`Music 🎶`,`${cmd.user} dodał(a) playlistę: \`${musicTracks.playlist?.name}\` [\`${musicTracks.tracks.length} piosenek\`]`)]})
            return;
        }
        guildPlayers.queue.add(musicTracks.tracks[0])
        cmd.reply({embeds: [EmbedFactory.generateInfoEmbed(`Music 🎶`, `${cmd.user} dodał(a) piosenkę: \`${musicTracks.tracks[0].title}\``).setImage(`${musicTracks.tracks[0].thumbnail ?? ''}`)]})
        if(!guildPlayers.playing) guildPlayers.play()
        
        if(guildPlayers.playing === false && guildPlayers.queue.size) {
            await guildPlayers.play()
            cmd.reply({embeds: [EmbedFactory.generateInfoEmbed(`Play`, `Continuing!`)]})
            return;
        }


        

    }
}