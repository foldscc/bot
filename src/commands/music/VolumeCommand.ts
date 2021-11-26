
import { CommandInteractionOptionResolver, Guild, GuildMember } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import DiscordClient from '../../client/DiscordClient';
import Command from "../../structure/Command";
import { Model } from 'sequelize/types';
import EmbedFactory from '../../util/EmbedFactory';


export default class VolumeCommand extends Command {
    commandName = 'volume'
    commandDescription = 'Zmień głośność muzyki na kanale'
    ephemeral = false;
    data = new SlashCommandBuilder().setDefaultPermission(true).addNumberOption(opt => opt.setName('volume').setDescription('Głośność').setRequired(false))

    async run(client: DiscordClient, cmd: CommandInteraction, options: CommandInteractionOptionResolver, guild: Guild, userProfile: Model<any, any>) {
        const player = client.erela.players.get(guild.id);
        const member = cmd.member as GuildMember


        if(!player) {
          cmd.reply({embeds: [EmbedFactory.generateWarningEmbed(`Music 🎵`, `Nic nie jest teraz odtwarzane!`)]})
          return;     
        }
      
        if(!member.voice.channelId) {
          cmd.reply({embeds: [EmbedFactory.generateErrorEmbed(`Music 🎵`, `Nie jesteś na kanale głosowym!`)]})
          return;
        }

        if(member.voice.channelId !== player.voiceChannel) {
          cmd.reply({embeds: [EmbedFactory.generateErrorEmbed(`Music 🎵`, `Aby słuchać muzyki, dołącz na ten sam kanał co ja!`)]})
          return;
        }
        if(!options.getNumber('volume')) {
            cmd.reply({embeds: [EmbedFactory.generateInfoEmbed(`Music 🎵`, `Obecna głośność to: \`${player.volume}%\``)]})
            return;
        }
        if(options.getNumber('volume', true) > 100 || options.getNumber('volume', true) < 1) {
          cmd.reply({embeds: [EmbedFactory.generateErrorEmbed(`Music 🎵`, `Wartość głośności musi być pomiędzy \`1\` a \`100\`!`)]})
          return;
        }

        player.setVolume(options.getNumber('volume', true))
        cmd.reply({embeds: [EmbedFactory.generateInfoEmbed(`Music 🎵`, `Pomyślnie ustawiono głośność: \`${options.getNumber('volume', true)}%\``)]})

    }
}